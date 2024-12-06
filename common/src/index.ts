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
      profilePicture     : zod.string().url().optional(),
      city               : zod.string().optional(),
      state              : zod.string().optional(),
      country            : zod.string().optional(),
      skill              : zod.array(zod.string()).optional(),
      currentlyWorking   : zod.boolean().optional(),
      yearsofExperience  : zod.number().optional(),
      domain             : zod.string().optional(),
      tools              : zod.array(zod.string()).optional(),
      linkedin           : zod.string().url().optional(),
      Instagram          : zod.string().url().optional(),
      price_1month       : zod.number().min(1000).max(50000).optional(),
      price_3month       : zod.number().min(1000).max(50000).optional(),
      price_6month       : zod.number().min(1000).max(50000).optional(),
      sessionsPerMonth   : zod.number().min(1).optional(),       
})

export type Mentor = zod.infer<typeof mentorSchema>

export const mentorEducationSchema = zod.object({
    
        degree    : zod.string(),
        college   : zod.string(),
        course    : zod.string(),
        startYear : zod.string(),
        endYear   : zod.string()
 
})

export type MentorEducation = zod.infer<typeof mentorEducationSchema>

export const mentorWorkExperienceSchema = zod.object({
        company   : zod.string(),
        role      : zod.string(),
        startYear : zod.string(),
        endYear   : zod.string()
})

export type mentorWorkExperience = zod.infer<typeof mentorWorkExperienceSchema>

export const mentorAvailableTimeSchema = zod.object({
    availableTime  : zod.array(zod.object({
        day          : zod.number().min(0).min(6),
        availability : zod.boolean(),
        startTime    : zod.string().optional(),
        endTime      : zod.string().optional(),
        })).refine((arr)=>{
            return arr.length===7 && arr.every((time)=>{
                if(time.availability){
                    return time.startTime !==null && time.startTime !== undefined && time.endTime !==null && time.endTime !==null
                }

                return true;
            })
        },
        {message:'if availability is true, startTime and endTime must be present'})
})

export type mentorAvailableTime = zod.infer<typeof mentorAvailableTimeSchema>

