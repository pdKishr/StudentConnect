import zod from 'zod';

// user & mentor signup validation

export const  signupSchema = zod.object({
    email        : zod.string().email(),
    password     : zod.string().min(8),
    mobile_number: zod.string().min(10).max(15)
})

export type  Signup = zod.infer<typeof signupSchema>

// user & mentor signin validation

export const signinSchema = zod.object({
    email    : zod.string().email(),
    password : zod.string().min(8)
})

export type Signin = zod.infer<typeof signinSchema>

// user profile update

export const userSchema = zod.object({
      name               : zod.string().min(1).optional(),
      language           : zod.array(zod.string()).optional(),
      city               : zod.string().optional(),
      state              : zod.string().optional(),
      country            : zod.string().optional(),
      profilePicture     : zod.string().url().optional(),
      linkedin           : zod.string().url().optional(),
      Instagram          : zod.string().url().optional(),
      resume             : zod.string().url().optional(),
      highestDegree      : zod.string().optional(),
      course             : zod.string().optional(),
      collage            : zod.string().optional()
})

export type User = zod.infer<typeof userSchema>

//  mentor profileupdate validation
export const day = zod.enum(["mon","tue","wed","thu","fri","sat","sun"]);

export const mentorSchema = zod.object({
      name               : zod.string().min(1).optional(),
      language           : zod.array(zod.string()).optional(),
      skill              : zod.array(zod.string()).optional(),
      currentlyWorking   : zod.boolean().optional(),
      yearsofExperience  : zod.number().optional(),
      domain             : zod.string().optional(),
      linkedin           : zod.string().url().optional(),
      about              : zod.string().optional()
})

export type Mentor = zod.infer<typeof mentorSchema>

export const mentorGeographicSchema = zod.object({
    city : zod.string(),
    state: zod.string(),
    country: zod.string(),
    timezone : zod.string()
})

export type MentorGeographic = zod.infer<typeof mentorGeographicSchema >

export const mentorEducationSchema = zod.array(zod.object({
    
        degree    : zod.string(),
        college   : zod.string(),
        course    : zod.string(),
        startYear : zod.string(),
        endYear   : zod.string()

}));

export type MentorEducation = zod.infer<typeof mentorEducationSchema>

export const mentorWorkExperienceSchema = zod.array(zod.object({
        company   : zod.string(),
        role      : zod.string(),
        startYear : zod.string(),
        endYear   : zod.string()
}));

export type mentorWorkExperience = zod.infer<typeof mentorWorkExperienceSchema>

export const mentorAvailableTimeSchema = zod.array(zod.object({
        day          : zod.number().min(0).max(6),
        isAvailable  : zod.boolean(),
        startTime    : zod.string(),
        endTime      : zod.string(),
        })).refine((arr)=>{
            type TimeSlot = {startTime: number, endTime: number};
            const groupedByDay : Record<number , TimeSlot[]> = {};
            const timeRegex = /^\d{2}:\d{2}$/;

           for(const time of arr){
                if(time.isAvailable){
                     
                    if (!timeRegex.test(time.startTime) || !timeRegex.test(time.endTime)) {
                        return false;
                      }

                    const startTimeInMinutes = parseTime(time.startTime);
                    const endTimeInMinutes   =  parseTime(time.endTime);

                    if (startTimeInMinutes === null || endTimeInMinutes === null || startTimeInMinutes >= endTimeInMinutes) {
                        return false;
                    }

                    if(!groupedByDay[time.day]){
                        groupedByDay[time.day] = [];
                    } 

                    groupedByDay[time.day].push
                    ({
                        startTime:startTimeInMinutes,
                        endTime:endTimeInMinutes
                        })
                    
                }
            }

           for(const day in groupedByDay){
               const intervals = groupedByDay[day];
               intervals.sort((a,b)=> a.startTime - b.startTime);

               for(let i=1;i<intervals.length;i++){
                   if(intervals[i].startTime < intervals[i-1].endTime) return false;
               }
           }      
             return true;              

        },{
            message:'Invalid time slots: overlapping or improperly ordered times. Time slots'
        });


function parseTime(time: string) : number|null {
    const [hours,minutes] = time.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        return null;
    }
    return hours * 60 + minutes;
}

export type mentorAvailableTime = zod.infer<typeof mentorAvailableTimeSchema>