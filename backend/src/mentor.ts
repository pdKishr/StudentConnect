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
     MentorGeographic,
     mentorGeographicSchema,
     mentorEducationSchema,
     MentorEducation,
     mentorWorkExperienceSchema,
     mentorWorkExperience,
     mentorAvailableTimeSchema,
     mentorAvailableTime
} from '@pdkishr/guided-common';



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

mentor.put('/auth/update/email', async(c)=>{
  const email =  c.req.header('email')
  
  const emailSchema = zod.string().email()
  const {success} = emailSchema.safeParse(email)

  if(!success){
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

mentor.put('/auth/update/mobile_number', async(c)=>{
  const body :{mobile_number:string} =  await c.req.json()
  const schema  = zod.string().min(10).max(15)
  const {success} = schema.safeParse(body.mobile_number)

  if(!success){
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
              mobile_number : body.mobile_number
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

mentor.put('/auth/update/password', async(c)=>{
  const body = await c.req.json()
  const schema = zod.object({
      newPassword : zod.string().min(8),
      oldPassword : zod.string().min(8)
  })
  const {success} = schema.safeParse(body);

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

mentor.put('auth/update/profilepicture', async(c)=>{

      const profilePicture = c.req.header('profilepicture')
      const schema = zod.string().url();

      const {success} = schema.safeParse(profilePicture);
      if(! success) return c.json({msg:'invalid input'})

      const jwtpayload          = c.get('jwtPayload');
      const id        : string  = jwtpayload.id;
    
    
      const prisma = new PrismaClient({
        datasourceUrl : c.env?.DATABASE_URL
      }).$extends(withAccelerate())

      try{
            await prisma.mentor.update({
              where :{id:id},
              data :{
                profilePicture : profilePicture
              }
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

mentor.put('/auth/update/demographic' , async(c)=>{

      const body : Mentor = await c.req.json()
      const {success} = mentorSchema.safeParse(body);
      if(! success) return c.json({msg:'invalid inputs'})

      const jwtpayload          = c.get('jwtPayload');
      const id        : string  = jwtpayload.id;
    
      const prisma = new PrismaClient({
        datasourceUrl : c.env?.DATABASE_URL
      }).$extends(withAccelerate())
    
      try{      
      
        const mentor = await prisma.mentor.update({
            where :{
               id : id
            },
            data :{
                 name              : body?.name ,
                 language          : body?.language ,    
                 skill             : body?.skill ,
                 currentlyWorking  : body?.currentlyWorking ,
                 yearsofExperience : body?.yearsofExperience ,
                 domain            : body?.domain ,
                 linkedin          : body?.linkedin ,
                 about             : body?.about 
                }
          })
        
          return c.json({msg:'updated'}) 
      }  
      catch(e){ 
        c.status(403)
        return c.json({err:e})
      }
      finally{
        await prisma.$disconnect()
      }
})

mentor.put('/auth/update/geographic' , async(c)=>{
          const body : MentorGeographic = await c.req.json();
          const {success} = mentorGeographicSchema.safeParse(body);
          if(! success) return c.json({msg:'invalid inputs'})

          const jwtpayload   = c.get('jwtPayload');
          const id : string  = jwtpayload.id;

          const prisma = new PrismaClient({
            datasourceUrl : c.env?.DATABASE_URL
          }).$extends(withAccelerate())

          try{
             await prisma.mentor.update({
                where :{id:id},
                data : {
                  city              : body.city , 
                  state             : body.state ,
                  country           : body.country,
                  timezone          : body.timezone
                }
              })
          }
          catch(e){
            c.status(403)
            return c.json({err:e})
          }
          finally{
            await prisma.$disconnect()
          }
})

mentor.put('/auth/update/education', async(c)=>{

  const body : {education : MentorEducation} = await c.req.json();
  const {success} = mentorEducationSchema.safeParse(body.education);
  if(! success) return c.json({msg:'invalid inputs'})

  const jwtpayload   = c.get('jwtPayload');
  const id : string  = jwtpayload.id;
  
  const prisma = new PrismaClient({
    datasourceUrl : c.env?.DATABASE_URL
  }).$extends(withAccelerate())
  
  try{  
          await prisma.education.deleteMany({
            where :{mentorId : id}
          })
        
          const mentor = await prisma.mentor.update({
              where :{ id:id},
              data :{
                  education : {create :body.education}
              },
              select :{
                education : true
              }
          })   
          
         return c.json({mentor})
  }  
  catch(e){
    c.status(403)
    return c.json({err:"error"})
  }
  finally{
    await prisma.$disconnect()
  }   
})

mentor.put('/auth/update/workExperience', async(c)=>{

    const body: {workExperience : mentorWorkExperience}= await c.req.json();
    const {success} = mentorWorkExperienceSchema.safeParse(body.workExperience);
    if(! success) return c.json({msg:'invalid inputs'})
    
    const jwtpayload   = c.get('jwtPayload');
    const id : string  = jwtpayload.id;
    
    const prisma = new PrismaClient({
    datasourceUrl : c.env?.DATABASE_URL
  }).$extends(withAccelerate())
  
          try{            
              await prisma.workExperience.deleteMany({
                where :{ mentorId : id}
              })
             
              const mentor = await prisma.mentor.update({
                where : {id:id},
                data :{
                  workExperience : {create: body.workExperience}
                },
                select :{
                  workExperience : true
                }
              })
    
            return c.json({msg:mentor})        
          }  
          catch(e){
            c.status(403)
            return c.json({err:"error"})
          }
          finally{
            await prisma.$disconnect()
          }   
  
})

mentor.put('/auth/update/availability' , async(c)=>{
       const body : {availability : mentorAvailableTime} = await c.req.json();
       const {success} = mentorAvailableTimeSchema.safeParse(body.availability);
       if(! success) return c.json({err:'invalid input'})
                         
       const jwtpayload   = c.get('jwtPayload');
       const id : string  = jwtpayload.id;
       
       const prisma = new PrismaClient({
           datasourceUrl : c.env?.DATABASE_URL
         }).$extends(withAccelerate())
        
         try{           
                await prisma.availability.deleteMany({
                     where :{ mentorId : id} 
                })
              
                const mentor = await prisma.mentor.update({
                  where :{id:id},
                  data :{
                    availability : {create : body.availability } 
                  },
                  select :{
                    availability : true
                  }
                })      
                
                return c.json({mentor})
         }  
         catch(e){
           c.status(403)
           return c.json({err:"error"})
         }
         finally{
           await prisma.$disconnect()
         }   
})

mentor.get('/auth/Bookings', async(c)=>{
    const jwtpayload   = c.get('jwtPayload')
    const id : string  = jwtpayload.id;
    
    const prisma = new PrismaClient({
        datasourceUrl : c.env?.DATABASE_URL
      }).$extends(withAccelerate())
      
      try{
        const mentor = await prisma.mentor.findUnique({
            where : { id:id},
            select : {booking : true}          
        })
          
        return c.json({mentees : mentor})     
      }  
      catch(e){
        c.status(403)
        return c.json({err:"error"})
      }
      finally{
        await prisma.$disconnect()
      }   
})

mentor.get('/auth/home' , async(c)=>{
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
                linkedin          : true,
                about             : true,
                language          : true,
                menteesCount      : true,  
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
                availability :{
                     select :{
                      isAvailable : true,
                      day : true,
                      startTime : true,
                      endTime : true
                     }
                  } ,
                slot :{
                  select : {
                    startTime : true,
                    endTime   : true
                  }
                }       
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