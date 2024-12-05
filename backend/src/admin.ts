import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {jwt,sign} from 'hono/jwt'


const admin = new Hono<{
    Bindings : {
        DATABASE_URL : string
        JWT_KEY : string
        SALT_ROUNDS: number
      };
}>();

admin.use('/auth/*', async(c,next)=>{
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

admin.post('/signin' , async(c)=>{
     const body = await c.req.json()
     
     const prisma = new PrismaClient({
        datasourceUrl : c.env?.DATABASE_URL
     }).$extends(withAccelerate())
    
     try{
        const mentor = await prisma.mentor.findUnique({
             where :{id:body.id ,password:body.password}
        })

        if(!mentor) return c.json({err:'admin not exists'})
        
        const token = await sign({id:mentor.id},c.env.JWT_KEY)
        return c.json({token});
     }
     catch(e){
        c.status(403)
        return c.json({err:'error'});
     }
     finally{
        await prisma.$disconnect()
     }
     

})

admin.get('/auth/new-mentors', async(c)=>{

     const prisma = new PrismaClient({
        datasourceUrl : c.env?.DATABASE_URL
     }).$extends(withAccelerate())

     try{
         const mentors = await prisma.mentor.findMany({
            where : {verified:false},
            select: {
                 id : true,
                 name : true         
            }
         })
    
         return c.json({mentors:mentors})
     }
     catch(e){
        c.status(403)
        return c.json({err:'error'});
     }
     finally{
        await prisma.$disconnect()
     }

})

admin.get('/auth/view-mentor-profile', async(c)=>{
    const mentorId    = c.req.header('mentorId')
    const mentorEmail = c.req.header('mentorEmail')
    
     const prisma = new PrismaClient({
        datasourceUrl : c.env?.DATABASE_URL
     }).$extends(withAccelerate())
    
     try{
         const mentor = await prisma.mentor.findMany({
            where : { OR:[{id:mentorId,email:mentorEmail}]},
            select: {
                 id : true,
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
        return c.json({err:'error'});
     }
     finally{
        await prisma.$disconnect()
     }
})

admin.post('/auth/approve-new-mentor', async(c)=>{
    const mentorId = c.req.header('mentorId')

    const prisma = new PrismaClient({
        datasourceUrl : c.env?.DATABASE_URL
     }).$extends(withAccelerate())
    
     try{
         await prisma.mentor.update({
             where: { id: mentorId },
             data: {verified: true}
         })
         return c.json({msg:'approved mentor'});
     }
     catch(e){
        c.status(403)
        return c.json({err:'error'});
     }
     finally{
        await prisma.$disconnect()
     }

})

export default admin