import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {jwt,sign} from 'hono/jwt'
import bcrypt from 'bcrypt'

const mentor = new Hono<{
    Bindings : {
        DATABASE_URL : string
        JWT_KEY : string
        saltRounds : string
      };
}>();

mentor.use('/protected', async(c,next)=>{
    try{
        const tokenVerified =  jwt({secret: c.env.JWT_KEY})
        await tokenVerified(c,next);
    }
    catch(e){
        c.status(401)
        c.json({msg:'unauthorized user'});
    }
    
})

mentor.post('/signup', async(c)=>{

    //zod validation required*****************
    const body = await c.req.json();
    const hashedPassword = await bcrypt.hash(body.password,c.env.saltRounds);
    
    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

    try{
        const user = await prisma.mentor.create({
            data : {
                email     : body.email,
                password  : hashedPassword,
                firstname : body.firstname,
                lastname  : body.lastname
            }
        })
        
        const token = sign({id:user.id},c.env.JWT_KEY);
        return c.json({token : token})
      }
      catch(e){
          c.status(403);
          return c.json({err:'error'})
      }
      finally{
          await prisma.$disconnect();
      }

})

mentor.post('/signin',async(c)=>{
    // zod validation required*************
    const body = await c.req.json();
    
    const prisma = new PrismaClient({
        datasourceUrl : c.env?.DATABASE_URL,
    }).$extends(withAccelerate())

    try{
        const user = await prisma.mentor.findUnique({
            where :{email : body.email} 
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

mentor.put('/update/protected', async(c)=>{

     // this function checks completeness of profile 
     function checkCompletedProfile(user : {[key:string]:any}) : string[] {
        const requiredFields = ['mobile_number','profilePicture','currentPosition','company','industry','workExperience','skills','projects','linkedinProfile','githubProfile','portfolio','bio','expertiseAreas','availableTimes'];
        return requiredFields.filter(field => !user[field]);
    }
    
    const jwtPayload = c.get('jwtPayload');
    const id: string = jwtPayload.id;
     
    const updatedData = await c.req.json();
    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

    try{
        const user = await prisma.mentor.update({
            where : {id:id},
            data : updatedData
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



export default mentor;


