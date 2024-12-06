import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {jwt,sign} from 'hono/jwt'
import bcrypt from 'bcryptjs' 
import zod from 'zod'
import {
     signupSchema,
     Signup,
     signinSchema,
     Signin,
     mentorSchema,
     Mentor,
     mentorEducationSchema,
     MentorEducation,
     mentorWorkExperienceSchema,
     mentorWorkExperience,
     mentorAvailableTimeSchema,
     mentorAvailableTime

} from '@pdkishr/guided-common'

const mentor = new Hono<{
    Bindings : {
        DATABASE_URL : string
        JWT_KEY : string
        SALT_ROUNDS: number
      };
}>();

mentor.use('/auth/*', async(c,next)=>{
    try{
        // this automatically gets the (token) authorization header from header
        const tokenVerified = jwt({secret : c.env.JWT_KEY});
        await tokenVerified(c,next);
    }
    catch(e){
        c.status(401)
        return c.json({msg:'unauthorized user'});
    }
})

mentor.post('/signup', async(c)=>{
  const body : Signup = await c.req.json();
  const {success} = signupSchema.safeParse(body);

  if(! success){
      c.status(403);
       return c.json({msg :'invalid inputs'})
     }
     const hashedPassword = await bcrypt.hash(body.password,10);
    
     const prisma = new PrismaClient({
        datasourceUrl : c.env?.DATABASE_URL
     }).$extends(withAccelerate())
    
     try{
        const mentor = await prisma.mentor.create({
            data : {
                email : body.email,
                password : hashedPassword,
                mobile_number : body.mobile_number,  
            }
        })
      
      const days = [0,1,2,3,4,5,6]
      days.map( async(day)=>{
        await prisma.availableTime.create({
          data :{
             mentorId : mentor.id,
             day      : day 
          }
        })
        
      })   
        const token = await sign({id:mentor.id},c.env.JWT_KEY)
        return c.json({token});
     }
     catch(e){
        c.status(403)
        return c.json({err:'username already exists'});
     }
     finally{
        await prisma.$disconnect()
     }

})

mentor.post('/signin',async (c)=>{
  const body : Signin = await c.req.json();
  const {success} = signinSchema.safeParse(body);
   
  if(! success){
      c.status(403);
       return c.json({msg :'invalid inputs'})
     }
    
    const prisma = new PrismaClient({
        datasourceUrl : c.env?.DATABASE_URL
    }).$extends(withAccelerate())
    
    try{
        const mentor = await prisma.mentor.findUnique({
            where :{email : body.email}
        })

        if(!mentor) {
            c.status(401)
            return c.json({err:'username not found'});
        }

        const hashedPassword: string = mentor.password;
        const isMatch = await  bcrypt.compare(body.password,hashedPassword);

        if(! isMatch){
            c.status(401)
            return c.json({err:'password mismatch'})
        }
    
        const token = await sign({id:mentor.id},c.env.JWT_KEY)
        return c.json({token})

    }
    catch(e){
        c.status(403)
        return c.json({err:"error"})
    }
    finally{
        await prisma.$disconnect()
    }
})

mentor.put('/auth/change-email', async(c)=>{
  const email =  c.req.header('email')
  const emailSchema = zod.string().email()
  const success = emailSchema.safeParse(email)

  if(! success){
      c.status(403);
       return c.json({msg :'invalid inputs'})
     }

      const jwtpayload          = c.get('jwtPayload');
      const id        : string  = jwtpayload.id;
       
      const prisma = new PrismaClient({
        datasourceUrl : c.env?.DATABASE_URL
      }).$extends(withAccelerate())

        try{
           const mentor = await prisma.mentor.update({
             where:{id:id},
             data : {
                email : email,
             }
           })
           return c.json({msg:'updated email'})
        }
       catch(e){
        c.status(403)
        return c.json({err:"error"})
        }
        finally{
            await prisma.$disconnect()
        }
})

mentor.put('/auth/change-mobilenumber', async(c)=>{
  const body :{mobile:string} =  await c.req.json()
  const schema  = zod.number().min(10).max(15)
  const success = schema.safeParse(body.mobile)

  if(! success){
      c.status(403);
       return c.json({msg :'invalid inputs'})
     }
    const jwtpayload          = c.get('jwtPayload');
    const id        : string  = jwtpayload.id;
     
    const prisma = new PrismaClient({
      datasourceUrl : c.env?.DATABASE_URL
    }).$extends(withAccelerate())

      try{
         const mentor = await prisma.mentor.update({
           where:{id:id},
           data : {
              mobile_number : body.mobile
           }
         })

         return c.json({msg:'updated mobile number'})
      }
     catch(e){
      c.status(403)
      return c.json({err:"error"})
      }
      finally{
          await prisma.$disconnect()
      }
})

mentor.put('/auth/change-password', async(c)=>{
  const body = await c.req.json()
  const schema = zod.object({
      newPassword : zod.string().min(8),
      oldPassword : zod.string().min(8)
  })
  const success = schema.safeParse(body);

  if(! success){
      c.status(403);
       return c.json({msg :'invalid inputs'})
     }

    const jwtpayload   = c.get('jwtPayload');
    const id : string  = jwtpayload.id;

     
    const prisma = new PrismaClient({
      datasourceUrl : c.env?.DATABASE_URL
    }).$extends(withAccelerate())
    
      try{
         const mentor = await prisma.mentor.findUnique({
           where:{id:id},
           select : {password:true}
         })
         const hashedoldPassword: string = mentor?.password ? mentor.password:'default';
         const isMatch = await  bcrypt.compare(body.oldPassword,hashedoldPassword);
 
         if(! isMatch){
             c.status(401)
             return c.json({err:'oldPassword mismatch'})
         }

        const hashednewpassword = await bcrypt.hash(body.newPassword,c.env.SALT_ROUNDS);

        await prisma.mentor.update({
            where :{id:id},
            data:{ password: hashednewpassword}
        })

        return c.json({msg:'password updated'})

      }
    
     catch(e){
      c.status(403)
      return c.json({err:"error"})
      }
      finally{
          await prisma.$disconnect()
      }
})

mentor.put('/auth/update-basicDetails' , async(c)=>{

      const body : Mentor = await c.req.json()
        
      const {success} = mentorSchema.safeParse(body)
       if(! success) return c.json({msg:'invalid inputs'})

      const jwtpayload          = c.get('jwtPayload');
      const id        : string  = jwtpayload.id;
    
      const prisma = new PrismaClient({
        datasourceUrl : c.env?.DATABASE_URL
      }).$extends(withAccelerate())
    
      try{      
        const oldData = await prisma.mentor.findUnique({
          where : {id:id},
        })
      
        const mentor = await prisma.mentor.update({
            where :{
               id : id
            },
            data :{
                 name              : body?.name ?? oldData?.name,
                 language          : body?.language ?? oldData?.language,
                 profilePicture    : body?.profilePicture ?? oldData?.profilePicture,
                 city              : body?.city ?? oldData?.city, 
                 state             : body?.state ?? oldData?.state,
                 country           : body?.country ?? oldData?.country,
                 skill             : body?.skill ?? oldData?.skill,
                 currentlyWorking  : body?.currentlyWorking ?? oldData?.currentlyWorking,
                 yearsofExperience : body?.yearsofExperience ?? oldData?.yearsofExperience,
                 domain            : body?.domain ?? oldData?.domain,
                 linkedin          : body?.linkedin ?? oldData?.linkedin,
                 Instagram         : body?.Instagram ?? oldData?.Instagram,
                 price_1month      : body?.price_1month ?? oldData?.price_1month,
                 price_3month      : body?.price_3month ?? oldData?.price_3month,
                 price_6month      : body?.price_6month ?? oldData?.price_6month,
                 sessionsPerMonth  : body?.sessionsPerMonth ?? oldData?.sessionsPerMonth
            }
          })

          return c.json({msg:'updated'}) 
      }  
      catch(e){
        console.log(e)
        c.status(403)
        return c.json({err:e})
      }
      finally{
        await prisma.$disconnect()
      }
})

mentor.put('/auth/add-education', async(c)=>{

  const body : MentorEducation = await c.req.json();
  
  const {success} = mentorEducationSchema.safeParse(body)
  if(! success) return c.json({msg:'invalid inputs'})

  const jwtpayload   = c.get('jwtPayload');
  const id : string  = jwtpayload.id;
  
  const prisma = new PrismaClient({
    datasourceUrl : c.env?.DATABASE_URL
  }).$extends(withAccelerate())
  
  try{
        await prisma.education.create({
             data :{
               mentorId : id,
               college  : body.college ,
               degree   : body.degree ,
               course   : body.course ,
               startYear: body?.startYear,
               endYear  : body?.endYear
             }
          })
        
          return c.json({msg:'education added'})
  }  
  catch(e){
    c.status(403)
    return c.json({err:"error"})
  }
  finally{
    await prisma.$disconnect()
  }   
   

})

mentor.put('/auth/update-education', async(c)=>{
    
     const edId  = c.req.header('edid');
     const body : MentorEducation = await c.req.json();
  
     const {success} = mentorEducationSchema.safeParse(body)
     if(! success) return c.json({msg:'invalid inputs'})

     const jwtpayload   = c.get('jwtPayload');
     const id : string  = jwtpayload.id;
     
     const prisma = new PrismaClient({
      datasourceUrl : c.env?.DATABASE_URL
    }).$extends(withAccelerate())
    
    try{
            
     const exisitingEdu = await prisma.education.findUnique({
         where :{ id:edId},
     })
    
     await prisma.education.update({
          where :{id:edId , mentorId: id},
          data : {
             college  : body?.college ?? exisitingEdu?.college,
             degree   : body?.degree  ?? exisitingEdu?.degree,
             course   : body?.course  ?? exisitingEdu?.course,
             startYear: body?.startYear ?? exisitingEdu?.startYear,
             endYear  : body?.endYear ?? exisitingEdu?.endYear,
          },
          select :{
            college  : true,
            degree   : true,
            course   : true,
            startYear: true,
            endYear  : true
          }
     })
       
     return c.json({msg:'updated education field'})        
    }  
    catch(e){
      c.status(403)
      return c.json({err:"error"})
    }
    finally{
      await prisma.$disconnect()
    }   
     
})

mentor.put('/auth/create-workExperience', async(c)=>{
  const body : mentorWorkExperience = await c.req.json();
  
  const {success} = mentorWorkExperienceSchema.safeParse(body)
  if(! success) return c.json({msg:'invalid inputs'})
  
     const jwtpayload = c.get('jwtPayload')
     const id : string = jwtpayload.id;
     
     const prisma = new PrismaClient({
      datasourceUrl : c.env?.DATABASE_URL
    }).$extends(withAccelerate())
    
    try{
          await prisma.workExperience.create({
               data :{
                 mentorId : id,
                 company  : body.company,
                 role     : body.role,
                 startYear: body.startYear,
                 endYear  : body.endYear
               }
            })
  
            return c.json({msg:'workExperience added'})
    }  
    catch(e){
      c.status(403)
      return c.json({err:"error"})
    }
    finally{
      await prisma.$disconnect()
    } 

})

mentor.put('/auth/update-workExperience', async(c)=>{

  const workId  = c.req.header('workid');
  const body : mentorWorkExperience = await c.req.json();
  
  const {success} = mentorWorkExperienceSchema.safeParse(body)
  if(! success) return c.json({msg:'invalid inputs'})

  const jwtpayload   = c.get('jwtPayload');
  const id : string  = jwtpayload.id;
  
  const prisma = new PrismaClient({
   datasourceUrl : c.env?.DATABASE_URL
 }).$extends(withAccelerate())
 
 try{
         
  const exisitingWork = await prisma.workExperience.findUnique({
      where :{ id:workId},
  })
  
  const work = await prisma.workExperience.update({
       where :{id:workId , mentorId: id},
       data : {
          company  : body?.company ?? exisitingWork?.company,
          role     : body?.role  ?? exisitingWork?.role,
          startYear: body?.startYear ?? exisitingWork?.startYear,
          endYear  : body?.endYear ?? exisitingWork?.endYear,
       },
       select :{
         company  : true,
         role   : true,
         startYear: true,
         endYear  : true
       }
  })
    
  return c.json({msg:'workExperience updated'})        
 }  
 catch(e){
   c.status(403)
   return c.json({err:"error"})
 }
 finally{
   await prisma.$disconnect()
 }   
  
})

mentor.put('/auth/update-availableTime' , async(c)=>{
  const body : mentorAvailableTime = await c.req.json();
  
  const {success} = mentorAvailableTimeSchema.safeParse(body)
  if(! success) return c.json({msg:'invalid inputs'})
       
       const jwtpayload   = c.get('jwtPayload');
       const id : string  = jwtpayload.id;
       
       const prisma = new PrismaClient({
           datasourceUrl : c.env?.DATABASE_URL
         }).$extends(withAccelerate())
        
         try{         
             body.availableTime.map(async (time:any)=>{
                await prisma.availableTime.update({
                  where:{mentorId_day:{mentorId:id,day:time.day}},
                  data :{
                     availability : time.availability,
                     startTime    : time.startTime,
                     endTime      : time.endTime
                  }
                })  
             })              
         }  
         catch(e){
           c.status(403)
           return c.json({err:"error"})
         }
         finally{
           await prisma.$disconnect()
         }   
})

mentor.get('/auth/show-trial-booking', async(c)=>{
    const jwtpayload   = c.get('jwtPayload');
    const id : string  = jwtpayload.id;
    
    const prisma = new PrismaClient({
        datasourceUrl : c.env?.DATABASE_URL
      }).$extends(withAccelerate())
    
      try{
        const mentor = await prisma.mentor.findUnique({
            where : { id:id},
            include:{
                trialbooking : {select:{
                       userId        : true,
                       bookingStatus : true,
                       startTime     : true,
                         
                }}
            }               
        })
        
            return c.json({trials:mentor?.trialbooking});
               
      }  
      catch(e){
        c.status(403)
        return c.json({err:"error"})
      }
      finally{
        await prisma.$disconnect()
      }   
})

mentor.get('/auth/mentee-team' , async(c)=>{
    const jwtpayload   = c.get('jwtPayload')
    const id : string  = jwtpayload.id;
    
    const prisma = new PrismaClient({
        datasourceUrl : c.env?.DATABASE_URL
      }).$extends(withAccelerate())
    
      try{
        const mentor = await prisma.mentor.findUnique({
            where : { id:id},
            include:{
                purchase : {select:{
                       userId        : true,
                       plan          : true,
                       duration      : true,
                       startDate     : true,
                       endDate       : true,
                       totalSessions : true,
                       availableSessions : true
                }}
            }               
        })
          
        return c.json({mentees : mentor?.purchase})     
      }  
      catch(e){
        c.status(403)
        return c.json({err:"error"})
      }
      finally{
        await prisma.$disconnect()
      }   
})

mentor.get('/auth/view-myprofile' , async(c)=>{
    const jwtpayload   = c.get('jwtPayload')
    const id : string  = jwtpayload.id;
    
    const prisma = new PrismaClient({
        datasourceUrl : c.env?.DATABASE_URL
      }).$extends(withAccelerate())
    
      try{
         const mentor = await prisma.mentor.findUnique({
            where :{ id: id},
            select :{
                name              : true,
                email             : true,
                mobile_number     : true,
                profilePicture    : true,
                city              : true,
                state             : true,
                country           : true,
                skill             : true,
                currentlyWorking  : true,
                yearsofExperience : true,
                domain            : true,
                tools             : true,
                linkedin          : true,
                Instagram         : true,
                about             : true,
                language          : true,
                menteesCount      : true,
                price_1month      : true,
                price_3month      : true,
                sessionsPerMonth  : true, 
                sessionsCount     : true,  
                menteeMinutes     : true,
                isActive          : true,    
                verified          : true,  
                createdAt         : true,
                education : {
                    select :{
                        id       : true,
                        college  : true,
                        degree   : true,
                        course   : true,
                        startYear: true,
                        endYear  : true
                    }
                },
                workExperience : {
                    select :{
                        id       : true,
                        company  : true,
                        role     : true,
                        startYear: true,
                        endYear  : true
                    }
                },
                availableTime : {
                    select :{
                        day          : true,
                        availability : true,
                        startTime    : true,
                        endTime      : true
                    }
                },
            }
              
         })
         return c.json({mentor:mentor})
      }
      catch(e){
        console.log(e)
        c.status(403)
        return c.json({err:"error"})
      }
      finally{
        await prisma.$disconnect()
      }
    
})


export default mentor