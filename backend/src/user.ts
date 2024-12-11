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
     userSchema,
     User
} from '@pdkishr/guided-common'

const user = new Hono<{
    Bindings : {
        DATABASE_URL : string
        JWT_KEY : string
        SALT_ROUNDS: number
      };
}>();

user.use('/auth/*', async(c,next)=>{
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

user.post('/signup',async(c)=>{

    const body : Signup = await c.req.json();
    const {success} = signupSchema.safeParse(body);

    if(! success){
        c.status(403);
         return c.json({msg :'invalid inputs'})
       }
    
    const hashedPassword = await bcrypt.hash(body.password, c.env.SALT_ROUNDS);

    const prisma = new PrismaClient({
		datasourceUrl: c.env.DATABASE_URL	
	}).$extends(withAccelerate())
    
    try{
        const user = await prisma.user.create({
            data :{
              email : body.email,
              password : hashedPassword,
              mobile_number : body.mobile_number
            }
        })
    
       const token = await sign({id:user.id},c.env.JWT_KEY)
       return c.json({token : token})
    }
    catch(e){
        c.status(403);
        return c.json({err:'one user account already assosiated with email or mobile number'})
    }
    finally {
        await prisma.$disconnect();
    }
})

user.post('/signin', async (c)=>{
    const body : Signin = await c.req.json();
    const {success} = signinSchema.safeParse(body);
     
    if(! success){
        c.status(403);
         return c.json({msg :'invalid inputs'})
       }

    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

    try{
        const user = await prisma.user.findUnique({
            where :{
                email : body.email
            }
        })
        
        if(!user) {
            c.status(403)
            return c.json({msg:'user not exists'})
        }
       
        const rehashedPassword : string  = user.password;
        const isMatch = await bcrypt.compare(body.password, rehashedPassword);
       
        if(!isMatch){
            c.status(403)
           return c.json({err:'password mismatch'})
        }
        const token = await sign({id:user?.id},c.env.JWT_KEY)
        return c.json({token:token});
    }
    catch(e){
        c.status(403)
        return c.json({err:'error'})
    }
    finally {
        await prisma.$disconnect();
    }

})

user.get('/auth/view-myProfile', async(c)=>{
     const jwtPayload = c.get('jwtPayload')
     const id : string = jwtPayload.id
     
     const prisma = new PrismaClient({
        datasourceUrl : c.env?.DATABASE_URL
     }).$extends(withAccelerate())
    
     try{
         const user = await prisma.user.findUnique({
            where :{id:id},
            select:{
                name              : true,
                language          : true,
                city              : true,
                state             : true,
                country           : true,
                profilePicture    : true,
                linkedin          : true,
                resume            : true,
                highestDegree     : true,
                course            : true,
                college           : true,
                completePercentage: true,
                createdAt         : true          
            }
         })
        
         return c.json({user:user});
     }
     catch(e){
        c.status(403);
        return c.json({err:'error'})
    }
    finally{
        await prisma.$disconnect();
    }
})

user.put('/auth/update-myProfile',async (c)=>{

    // this function checks completeness of profile 
    function completePercentageFunction(user:{[key:string]:any}): number{
    
       const factors = ['name','mobilenumber','email','profilePicture','city','state','country','language','linkedin','resume','highestDegree','course','college']
       const filters = factors.filter( factor => user[factor])
       const total   = factors.length
       const filled  = filters.length
       return 100 * filled/total;
    
    }
   
    const jwtpayload  = c.get('jwtPayload');
    const id : string = jwtpayload.id;
    
    const body              = await c.req.json()
    const updateData : User = body
    const {success}         = userSchema.safeParse(updateData);

    if(! success){
        c.status(403);
         return c.json({msg :'invalid inputs'})
       }
    
    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());
    
    try{
        const oldData = await prisma.user.findUnique({
            where :{id:id}
        })

      await prisma.user.update({
         where :{
            id : id
         },
         data: {
            name              : body?.name ?? oldData?.name,
            language          : body?.language ?? oldData?.language,
            profilePicture    : body?.profilePicture ?? oldData?.profilePicture,
            city              : body?.city ?? oldData?.city, 
            state             : body?.state ?? oldData?.state,
            country           : body?.country ?? oldData?.country,
            linkedin          : body?.linkedin ?? oldData?.linkedin,
            resume            : body?.resume ?? oldData?.resume,
            highestDegree     : body?.highestDegree ?? oldData?.highestDegree,
            course            : body?.course ?? oldData?.course,
            college           : body?.collage ?? oldData?.college
         }
       })
      
       const completePercentage = completePercentageFunction(user);   
    
       await prisma.user.update({
        where :{id:id},
        data :{ completePercentage : completePercentage}
       }) 
       
       return c.json({msg:'updated'});
    }
    catch(e){
        c.status(403);
        return c.json({err:'error'})
    }
    finally{
        await prisma.$disconnect();
    }
})

user.put('/auth/change-email', async(c)=>{
   
    const email =  c.req.header('email')
    const emailSchema = zod.string().email()
    const {success} = emailSchema.safeParse(email)

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
         const user = await prisma.user.update({
           where:{id:id},
           data : {
              email : email,
           }
         })
         return c.json({msg:'changed email'})
      }
     catch(e){
      c.status(403)
      return c.json({err:"email exists"})
      }
      finally{
          await prisma.$disconnect()
      }
})

user.put('/auth/change-mobileNumber', async(c)=>{

    const body :{mobile:string} =  await c.req.json()
    const schema  = zod.number().min(10).max(15)
    const {success} = schema.safeParse(body.mobile)

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
         const user = await prisma.user.update({
           where:{id:id},
           data : {
              mobile_number : body.mobile
           }
         })
         return c.json({msg:'changed mobile number'})
      }
     catch(e){
        console.log(e);
      c.status(403)
      return c.json({err:"mobile number exists"})
      }
      finally{
          await prisma.$disconnect()
      }
})

user.put('/auth/change-password', async(c)=>{
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
         const user = await prisma.user.findUnique({
           where  : {id:id},
           select : {password:true}
         })

         const hashedoldPassword: string = user?.password ? user.password:'default';
         const isMatch = await  bcrypt.compare(body.oldPassword,hashedoldPassword);
        
         if(! isMatch){
             c.status(401)
             return c.json({err:'oldPassword mismatch'})
         }

        const hashednewpassword = await bcrypt.hash(body.newPassword,c.env.SALT_ROUNDS);

        await prisma.user.update({
            where :{id:id},
            data:{ password: hashednewpassword}
        })
    
        return c.json({msg:'password updated'})

      }
    
     catch(e){
        
      c.status(403)
      return c.json({err:"error catched"})
      }
      finally{
          await prisma.$disconnect()
      }
})

user.get('/auth/search-mentors', async(c)=>{
    const searchKey  = c.req.header('searchkey');

    const prisma = new PrismaClient({
        datasourceUrl : c.env?.DATABASE_URL
    }).$extends(withAccelerate())
    
    try{
         const mentors = await prisma.mentor.findMany({
            where :{
                AND :[
                    {
                    OR:[
                        {name      : { contains :searchKey , mode:"insensitive"}},
                        {education :{ some :{
                                    OR:[
                                        { college : { contains : searchKey , mode :"insensitive"} },
                                        { degree  : { contains: searchKey , mode :"insensitive"} },
                                        { course  : { contains: searchKey , mode :"insensitive"} },
                                    ],                
                                    }}   
                        },
                        {workExperience :{ some:{
                                      OR:[
                                        { company  : { contains: searchKey , mode :"insensitive"} },
                                        { role     : { contains: searchKey , mode :"insensitive"} },
                                      ]
                                     }}
    
                        },
                        {skill      :  { has  : searchKey }},
                        {domain     :  { contains :searchKey , mode:"insensitive"}},                        
                      ]
                    },              
                ]  
            },
            select :{
                   email             : true,
                   name              : true,
                   skill             : true,
                   yearsofExperience : true,
                   domain            : true,
                   language          : true,
                   currentlyWorking  : true,
                   about             : true,
                   menteeMinutes     : true,           
                   education      :{ select : { college:true,degree: true, course: true}},
                   workExperience :{ select : { company:true ,role:true}}
            }
         })

         return c.json({mentors : mentors});

    }
    catch(e){
        c.status(403)
        return c.json({err:'error'})
    }
    finally{
        await prisma.$disconnect()
    }

})
// add filters route if needed

user.get('/auth/view-mentor-profile', async(c)=>{
     const mentorEmail  = c.req.header('mentoremail');

     if(!mentorEmail) {
         c.status(403)
        return c.json({msg:'empty search'})
     } 

     const prisma = new PrismaClient({
        datasourceUrl : c.env?.DATABASE_URL
    }).$extends(withAccelerate())

    try{
        const mentor = await prisma.mentor.findUnique({
               where :{
                  email : mentorEmail, verified: true
               },
               select :{
                email             : true,
                name              : true,
                city              : true,
                state             : true,
                country           : true,
                language          : true,
                skill             : true,
                about             : true,
                service           : {select : { name : true, price: true , description : true}}, 
                education         : {select : { college : true ,degree: true, course: true, startYear: true, endYear: true}},
                workExperience    : {select : { company:true , role:true}},
                slot              : {select : { id: true, startTime: true ,endTime: true}}
               }
        })
        return c.json({mentor : mentor})
    }
    catch(e){
        c.status(403)
        return c.json({err:'error'})
    }
    finally{
        await prisma.$disconnect()
    }  
}) 

//payments route & selecting slot & booking

user.post('/auth/booking', async(c)=>{

    const body = await c.req.json();
    const jwtpayload   = c.get('jwtPayload');
    const id : string  = jwtpayload.id;

    const prisma = new PrismaClient({
        datasourceUrl : c.env?.DATABASE_URL
    }).$extends(withAccelerate())

    try{
         await prisma.$transaction(async ( prisma)=>{
             
             await prisma.slot.update({
                where : {id: body.slotId},
                data :  { isBooked : true}
              })

              await prisma.booking.create({
                 data :{
                     userId : id,
                     mentorId : body.mentorId,
                     serviceId: body.serviceId,
                     slotId   : body.slotId,
                     status   : 'upcoming',
                 }
              })

              // payment pending

         }) ;

         return c.json({msg:'booking successful'})
    }
    catch(e){
        c.status(403)
        return c.json({err:'error'})
    }
    finally{
        await prisma.$disconnect()
    } 
})

export default user