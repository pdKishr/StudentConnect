import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {jwt,sign} from 'hono/jwt'
import bcrypt from 'bcryptjs' 

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
     const body = await c.req.json()
     const hashedpassword = await bcrypt.hash(body.password,10);

     const prisma = new PrismaClient({
        datasourceUrl : c.env?.DATABASE_URL
     }).$extends(withAccelerate())

     try{
        const mentor = await prisma.mentor.create({
            data :{
                email : body.email,
                password : hashedpassword,
                name : body.name,
                mobile_number: body.mobile_number
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
    const body = await c.req.json()
    
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

        const rehashedPassword: string = mentor.password;
        const isMatch = await  bcrypt.compare(body.password,rehashedPassword);

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

mentor.post('/auth/myprofile' , async(c)=>{
    
      const updatedData = await c.req.json()
      
      function completePercentageFunction(user:{[key:string]:any}): number{

        let filledCount = 0;
        let totalCount  = Object.keys(user).length - 1;

        for(const key in user){
            if(user.hasOwnProperty(key)){
                 if(user[key]) filledCount++;
            }
        }
    
        const percent = (filledCount/totalCount)*100;
        return percent;
    }
    
    const jwtpayload  = c.get('jwtPayload');
    const id : string = jwtpayload.id;
         
      const prisma = new PrismaClient({
        datasourceUrl : c.env?.DATABASE_URL
      }).$extends(withAccelerate())
    
      try{
        const mentor = await prisma.mentor.update({
            where :{
               id : id
            },
            data: updatedData
          })
         
          const completePercentage = completePercentageFunction(mentor);    
          return c.json({msg:'updated', completePercentage : completePercentage});
      }  
      catch(e){
        c.status(403)
        return c.json({err:"error"})
      }
      finally{
        await prisma.$disconnect()
      }
})




export default mentor