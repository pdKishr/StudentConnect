import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {jwt,sign} from 'hono/jwt'
import bcrypt from 'bcrypt' 

const student = new Hono<{
    Bindings : {
        DATABASE_URL : string
        JWT_KEY : string
        SALT_ROUNDS: number
      };
}>();

student.use('/protected', async(c,next)=>{
    try{
        // this automatically gets the (token) authorization header from header
        const tokenVerified = jwt({secret : c.env.JWT_KEY});
        await tokenVerified(c,next);
    }
    catch(e){
        c.status(401)
        c.json({msg:'unauthorized user'});
    }
})

student.post('/signup',async(c)=>{
    const body : any= await c.req.json();
    const hashedPassword = await bcrypt.hash(body.password, c.env.SALT_ROUNDS);
    // zod validation required*****************
    const prisma = new PrismaClient({
		datasourceUrl: c.env.DATABASE_URL	
	}).$extends(withAccelerate())
    
    try{
        const user = await prisma.student.create({
            data :{
              firstname : body.firstname,
              lastname : body.lastname,
              email : body.email,
              password : hashedPassword
            }
        })

       const token = await sign({id:user.id},c.env.JWT_KEY)
       return c.json({token : token})
    }
    catch(e){
        c.status(403);
        return c.json({err:'one student account already assosiated with email'})
    }
    finally {
        await prisma.$disconnect();
    }
})

student.post('/signin', async (c)=>{
    const body: any = await c.req.json();
    
    //zod validation required*****************
    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

    try{
        const user = await prisma.student.findUnique({
            where :{
                email : body.email
            }
        })

        if(!user) {
            c.status(403)
            return c.json({msg:'user not exists'})
        }

        const hashedPassword : string  = user?.password === undefined ?'default':user.password;
        const isMatch = await bcrypt.compare(body.password, hashedPassword);

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

student.put('/update/protected',async (c)=>{
   
    // this function checks completeness of profile 
    function checkCompletedProfile(user : {[key:string]:any}) : string[] {
        const requiredFields = ['mobile_number','profilePicture','college','course','major','grad_year','skills','resume','projects','linkedinProfile','githubProfile','portfolio','about'];
        return requiredFields.filter(field => !user[field]);
    }
    
    const jwtpayload = c.get('jwtPayload');
    const id : string = jwtpayload.id;
    
     //zod validation required*****************
    const updatedData: any = await c.req.json()
    
    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

    try{
      const user = await prisma.student.update({
         where :{
            id : id
         },
         data: updatedData
       })
      
       const isComplete = checkCompletedProfile(user) === null ? true : false;
       
       return c.json({msg:'updated', complete_status : isComplete})
    }
    catch(e){
        c.status(403);
        return c.json({err:'error'})
    }
    finally{
        await prisma.$disconnect();
    }
})




export default student