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
     Mentor
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
     const hashedpassword = await bcrypt.hash(body.password,10);
    
     const prisma = new PrismaClient({
        datasourceUrl : c.env?.DATABASE_URL
     }).$extends(withAccelerate())
    
     try{
        const mentor = await prisma.mentor.create({
            data : {
                ...body,
                password : hashedpassword
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
        }
       catch(e){
        c.status(403)
        return c.json({err:"error"})
        }
        finally{
            await prisma.$disconnect()
        }
})

mentor.put('/auth/change-mobileNumber', async(c)=>{
  const body :{mobile:number} =  await c.req.json()
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
  const body = c.req.header()
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

mentor.put('/auth/update' , async(c)=>{
  const body  = await c.req.json()
  const body1 : Mentor = body
  const {success}   = mentorSchema.safeParse(body1);
  if(! success){
      c.status(403);
       return c.json({msg :'invalid inputs'})
     }
      const jwtpayload          = c.get('jwtPayload');
      const id        : string  = jwtpayload.id;
    
    /*  const mentorData = {
        name             : body.name ,
        profilePicture   : body.profilePicture || null,
        city             : body.city || null ,
        state            : body.state || null,
        country          : body.country || null,
        currentlyWorking : body.currentlyWorking || null,
        skill            : body.skill || null,
        yearsofExperience: body.yearsofExperience || null,
        domain           : body.domain || null,
        tools            : body.tools || null,
        linkedin         : body.linkedin || null,
        Instagram        : body.Instagram || null,
        price_1month     : body.price_1month || null,
        price_3month     : body.price_3month || null,
        price_6month     : body.price_6month || null,
        sessionsPerMonth : body.sessionsPerMonth || null,
        education        : body.education.map((edu:any) => ({
                                degree   : edu.degree,
                                college  : edu.college,
                                startYear: edu.startYear || null,
                                endYear  : edu.endYear   || null,
                            })) || null,
        workExperience    : body.workExperience((work:any)=>({
                                company   : work.company,
                                role      : work.role,
                                startYear : work.startYear,
                                endYear   : work.endYear || null 
                            })) || null,
        availableTime     : body.availableTimes((time:any)=>({
                                day          : time.day,
                                availability : time.availability,
                                startTime    : time.startTime || null,
                                endTime      : time.endTime || null
                            })) || null      

     }
    
     if(!mentorData) return c.json({})
    */
      const prisma = new PrismaClient({
        datasourceUrl : c.env?.DATABASE_URL
      }).$extends(withAccelerate())
    
      try{
        
        const mentor = await prisma.mentor.update({
            where :{
               id : id
            },
            data :{
                ...body,
                education      : {create:[body.education]},
                workExperience : {create:[body.workExperience]},
                availableTime  : {create:[body.availableTime]},
                pagesetup      : true
            }
          })
         
          return c.json({msg:'successful pagesetup'}) 
      }  
      catch(e){
        c.status(403)
        return c.json({err:"error"})
      }
      finally{
        await prisma.$disconnect()
      }
})

mentor.post('/auth/show-trial-booking', async(c)=>{
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
                       endTime       : true,  
                }}
            }               
        })
        
            return c.json({trials:mentor?.trialbooking});
               
      }  
      catch(e){
        c.status(403)
        return c.json({err:"pageNotsetup"})
      }
      finally{
        await prisma.$disconnect()
      }   
})

mentor.post('/auth/mentee-team' , async(c)=>{
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
         
        return c.json({trial : mentor?.purchase})     
      }  
      catch(e){
        c.status(403)
        return c.json({err:"pageNotsetup"})
      }
      finally{
        await prisma.$disconnect()
      }   
})

mentor.post('/auth/view-myprofile' , async(c)=>{
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
                password          : true,
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
                updatedAt         : true
            },
            
            include:{
                education : {
                    select :{
                        college  : true,
                        degree   : true,
                        course   : true,
                        startYear: true,
                        endYear  : true
                    }
                },
                workExperience : {
                    select :{
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
        c.status(403)
        return c.json({err:"pageNotsetup"})
      }
      finally{
        await prisma.$disconnect()
      }
    
})


export default mentor