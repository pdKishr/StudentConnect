import zod from 'zod';

export const signupInput = zod.object({
    email : zod.string().email(),
    password : zod.string().min(8),
    firstname : zod.string(),
    lastname : zod.string()
})

export type SignupInput = zod.infer<typeof signupInput>

export const signinInput = zod.object({
    email : zod.string().email(),
    
})