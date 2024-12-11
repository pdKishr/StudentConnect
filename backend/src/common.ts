import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { addDays, addMinutes, setHours, setMinutes, startOfDay } from 'date-fns';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';

const slot = new Hono<{
  Bindings : {
      DATABASE_URL : string
      JWT_KEY : string
      SALT_ROUNDS: number
    };
}>();

slot.get('/generate-slot', async(c)=>{

  const prisma = new PrismaClient({
    datasourceUrl : c.env?.DATABASE_URL
  }).$extends(withAccelerate())

const interval = 59; // get as mentor input later

interface Booking{
  slot:{
    startTime : Date;
    endTime   : Date;
  }
}

interface Slot{
  mentorId : string;
  startTime : Date; 
  endTime : Date
}

interface Mentor {
  id: string;
  timezone: string;
  availability: {
      isAvailable: boolean;
      day: number;
      startTime : string;
      endTime : string;
  }[];
  booking: {
    slot :{
      startTime: Date;
      endTime: Date;
    }    
  }[];
}

async function generateTimeSlots(){ 
  const todayInUtc = startOfDay(new Date());
  try{
    const mentors  = await prisma.mentor.findMany({  
     where : { verified : true}  ,
      select :{
        timezone : true,
        availability : {
          select:{
            day : true,
            isAvailable : true,
            startTime : true,
            endTime : true
          }
        },
      
        booking : {
              orderBy: {
                slot: {
                    startTime: 'asc', // Ensures bookings are ordered by slot start time
                },
              },
              select :{
                slot:{
                  select :{
                    startTime : true,
                    endTime : true
                  }
                }     
              }
        }, 
        id : true
      }
    }); 
  
    await prisma.slot.deleteMany({
      where : {isBooked : false}
     }) 
    
    for(const mentor of mentors)
      {
          var createdSlots: Slot[]  = [];
          const todayinMentorstimeZone        = toZonedTime(todayInUtc,mentor.timezone);
          
          const bookings : Booking[] = mentor.booking.filter((booking)=> booking.slot.startTime > todayInUtc)
          const bookingPointer : number[] = [0];
          
          processAllDayAvailability(todayinMentorstimeZone,bookings,interval, bookingPointer,createdSlots ,mentor)        
                
        const slots =  await prisma.slot.createMany({
            data :createdSlots,
            skipDuplicates : true
          })   
      }
  }
  catch(e){
        console.error("Error generating timeslots: ",e);
  }     
}

function processAllDayAvailability(todayinMentorstimeZone:Date,bookings:Booking[],interval:number, bookingPointer: number[],createdSlots : Slot[],mentor : Mentor){
  const {id , timezone , availability} = mentor;
  for(let i=0;i<7;i++){
    const currentDate = addDays(todayinMentorstimeZone,i);
    const dayOfWeek   = currentDate.getDay() // .getDay outputs number 0 to 6 that represents sunday to saturday respectively
      for(const availableDay of availability){
       
          if(availableDay.isAvailable){
         
              if(availableDay.day === dayOfWeek){
                    
                    const [startHour, startMinute] = parseInputTimeStringToDateTimeString(availableDay.startTime) 
                    const [endHour, endMinute]     = parseInputTimeStringToDateTimeString(availableDay.endTime)
                    
                    const localStart = setMinutes(setHours(currentDate,startHour), startMinute) 
                    const localEnd   = setMinutes(setHours(currentDate,endHour), endMinute)

                    const utcStart = fromZonedTime(localStart,timezone)
                    const utcEnd   = fromZonedTime(localEnd, timezone)

                    calculateSlotTimes(utcStart,utcEnd,interval,bookings,id,bookingPointer,createdSlots);
              }
          }
      }
  }
}

function parseInputTimeStringToDateTimeString(timeString : String): number[]{
  return timeString.split(":").map(Number)
}

function calculateSlotTimes( start:Date, end : Date, interval : number,bookings: Booking[], id : string, bookingPointer : number[], createdSlots: Slot[]) {
    
  let newSlot_startTime = start;
  let newSlot_endTime   = addMinutes(newSlot_startTime, interval);
  let p = bookingPointer[0]  
  // p is bookingIndex
      while(newSlot_endTime <= end){ 
             
              while( p< bookings.length && bookings[p].slot.endTime < newSlot_startTime) p++;
            
              const overlapped = bookings[p] &&  isOverlapping(newSlot_startTime,newSlot_endTime,bookings[p].slot.startTime,bookings[p].slot.endTime)

                if(overlapped){
                  newSlot_startTime = addMinutes(bookings[p].slot.endTime,1); // next new slot startTime
                  newSlot_endTime   = addMinutes(newSlot_startTime,interval); // next new slot endTime
                }
                else{
                  createdSlots.push({
                    mentorId : id,
                    startTime    : newSlot_startTime,
                    endTime      : newSlot_endTime                                                         
                })
                  
                newSlot_startTime = addMinutes(newSlot_endTime,1); // updating for next new slot start
                newSlot_endTime = addMinutes( newSlot_startTime,interval); // updating for next new slot end
                }
      }
      bookingPointer[0] = p;
}

function isOverlapping(start1 : Date,end1: Date, start2:Date,end2:Date): boolean{
       return start1<end2 && start2<end1 ;
}

await generateTimeSlots();
return c.json({msg:'completed'})

})

export default slot;