import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {jwt,sign} from 'hono/jwt'
import bcrypt from 'bcryptjs' 

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

    const body : any= await c.req.json();
    const hashedPassword = await bcrypt.hash(body.password, c.env.SALT_ROUNDS);
   
    // zod validation required*****************
    const prisma = new PrismaClient({
		datasourceUrl: c.env.DATABASE_URL	
	}).$extends(withAccelerate())
    
    try{
        const user = await prisma.user.create({
            data :{
              name  : body.name,
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
        return c.json({err:'one user account already assosiated with email'})
    }
    finally {
        await prisma.$disconnect();
    }
})

user.post('/signin', async (c)=>{
    const body: any = await c.req.json();
    
    //zod validation required*****************
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
        //user?.password === undefined ?'default':
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

user.put('/auth/myProfile',async (c)=>{

    // this function checks completeness of profile 
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
     
    const jwtpayload = c.get('jwtPayload');
    const id : string = jwtpayload.id;
    
    //zod validation required*****************
    const updatedData: any = await c.req.json()
    
    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());
    
    try{
      const user = await prisma.user.update({
         where :{
            id : id
         },
         data: updatedData
       })
      
       const completePercentage = completePercentageFunction(user);    
       return c.json({msg:'updated', completePercentage : completePercentage});
    }
    catch(e){
        c.status(403);
        return c.json({err:'error'})
    }
    finally{
        await prisma.$disconnect();
    }
})

user.get('/auth/search-mentors/', async(c)=>{
    const searchKey  = c.req.header('searchKey');
    const filters = await c.req.json();

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
                                        { college : {contains : searchKey , mode :"insensitive"} },
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

                    { yearsofExperience :{gte: filters.minExperience , lte: filters.maxExperience}},
                    {
                        OR:[
                            {price_1month :{gte : filters.priceRange[0] , lte: filters.priceRange[1]}},
                            {price_3month :{gte : filters.priceRange[0] , lte: filters.priceRange[1]}},
                            {price_6month :{gte : filters.priceRange[0] , lte: filters.priceRange[1]}},
                        ]
                    },
                    { language : {hasSome: filters.languages }}
                
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
                   tools             : true,
                   about             : true,
                   price_1month      : true,
                   price_3month      : true,
                   price_6month      : true,
                   sessionsPerMonth  : true,
                   menteeMinutes     : true,
                   sessionsCount     : true                
            },
            include :{
                  education      :{select : { college : true ,degree: true, course: true}},
                  workExperience :{ select :{company:true , role:true}}
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

user.get('/auth/mentor-profile', async(c)=>{
     const mentorId = c.req.query('mentorId');
     
     const prisma = new PrismaClient({
        datasourceUrl : c.env?.DATABASE_URL
    }).$extends(withAccelerate())

    try{
        const mentor = await prisma.mentor.findUnique({
               where :{
                  id : mentorId
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
                price_1month      : true,
                price_3month      : true,
                price_6month      : true,
                sessionsPerMonth  : true,
               },
               include :{
                education      :{select : { college : true ,degree: true, course: true, startYear: true, endYear: true}},
                workExperience :{ select: {company:true , role:true}}
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

// filters 

export default user