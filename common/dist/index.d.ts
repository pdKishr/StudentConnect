import zod from 'zod';
export declare const signupSchema: zod.ZodObject<{
    email: zod.ZodString;
    password: zod.ZodString;
    mobile_number: zod.ZodString;
}, "strip", zod.ZodTypeAny, {
    email: string;
    password: string;
    mobile_number: string;
}, {
    email: string;
    password: string;
    mobile_number: string;
}>;
export type Signup = zod.infer<typeof signupSchema>;
export declare const signinSchema: zod.ZodObject<{
    email: zod.ZodString;
    password: zod.ZodString;
}, "strip", zod.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type Signin = zod.infer<typeof signinSchema>;
export declare const userSchema: zod.ZodObject<{
    name: zod.ZodOptional<zod.ZodString>;
    language: zod.ZodOptional<zod.ZodArray<zod.ZodString, "many">>;
    city: zod.ZodOptional<zod.ZodString>;
    state: zod.ZodOptional<zod.ZodString>;
    country: zod.ZodOptional<zod.ZodString>;
    profilePicture: zod.ZodOptional<zod.ZodString>;
    linkedin: zod.ZodOptional<zod.ZodString>;
    Instagram: zod.ZodOptional<zod.ZodString>;
    resume: zod.ZodOptional<zod.ZodString>;
    highestDegree: zod.ZodOptional<zod.ZodString>;
    course: zod.ZodOptional<zod.ZodString>;
    collage: zod.ZodOptional<zod.ZodString>;
}, "strip", zod.ZodTypeAny, {
    name?: string | undefined;
    language?: string[] | undefined;
    city?: string | undefined;
    state?: string | undefined;
    country?: string | undefined;
    profilePicture?: string | undefined;
    linkedin?: string | undefined;
    Instagram?: string | undefined;
    resume?: string | undefined;
    highestDegree?: string | undefined;
    course?: string | undefined;
    collage?: string | undefined;
}, {
    name?: string | undefined;
    language?: string[] | undefined;
    city?: string | undefined;
    state?: string | undefined;
    country?: string | undefined;
    profilePicture?: string | undefined;
    linkedin?: string | undefined;
    Instagram?: string | undefined;
    resume?: string | undefined;
    highestDegree?: string | undefined;
    course?: string | undefined;
    collage?: string | undefined;
}>;
export type User = zod.infer<typeof userSchema>;
export declare const day: zod.ZodEnum<["mon", "tue", "wed", "thu", "fri", "sat", "sun"]>;
export declare const mentorSchema: zod.ZodObject<{
    name: zod.ZodOptional<zod.ZodString>;
    language: zod.ZodOptional<zod.ZodArray<zod.ZodString, "many">>;
    profilePicture: zod.ZodOptional<zod.ZodString>;
    city: zod.ZodOptional<zod.ZodString>;
    state: zod.ZodOptional<zod.ZodString>;
    country: zod.ZodOptional<zod.ZodString>;
    skill: zod.ZodOptional<zod.ZodArray<zod.ZodString, "many">>;
    currentlyWorking: zod.ZodOptional<zod.ZodBoolean>;
    yearsofExperience: zod.ZodOptional<zod.ZodNumber>;
    domain: zod.ZodOptional<zod.ZodString>;
    tools: zod.ZodOptional<zod.ZodArray<zod.ZodString, "many">>;
    linkedin: zod.ZodOptional<zod.ZodString>;
    Instagram: zod.ZodOptional<zod.ZodString>;
    price_1month: zod.ZodOptional<zod.ZodNumber>;
    price_3month: zod.ZodOptional<zod.ZodNumber>;
    price_6month: zod.ZodOptional<zod.ZodNumber>;
    sessionsPerMonth: zod.ZodOptional<zod.ZodNumber>;
}, "strip", zod.ZodTypeAny, {
    name?: string | undefined;
    language?: string[] | undefined;
    city?: string | undefined;
    state?: string | undefined;
    country?: string | undefined;
    profilePicture?: string | undefined;
    linkedin?: string | undefined;
    Instagram?: string | undefined;
    skill?: string[] | undefined;
    currentlyWorking?: boolean | undefined;
    yearsofExperience?: number | undefined;
    domain?: string | undefined;
    tools?: string[] | undefined;
    price_1month?: number | undefined;
    price_3month?: number | undefined;
    price_6month?: number | undefined;
    sessionsPerMonth?: number | undefined;
}, {
    name?: string | undefined;
    language?: string[] | undefined;
    city?: string | undefined;
    state?: string | undefined;
    country?: string | undefined;
    profilePicture?: string | undefined;
    linkedin?: string | undefined;
    Instagram?: string | undefined;
    skill?: string[] | undefined;
    currentlyWorking?: boolean | undefined;
    yearsofExperience?: number | undefined;
    domain?: string | undefined;
    tools?: string[] | undefined;
    price_1month?: number | undefined;
    price_3month?: number | undefined;
    price_6month?: number | undefined;
    sessionsPerMonth?: number | undefined;
}>;
export type Mentor = zod.infer<typeof mentorSchema>;
export declare const mentorEducationSchema: zod.ZodObject<{
    degree: zod.ZodString;
    college: zod.ZodString;
    course: zod.ZodString;
    startYear: zod.ZodString;
    endYear: zod.ZodString;
}, "strip", zod.ZodTypeAny, {
    course: string;
    degree: string;
    college: string;
    startYear: string;
    endYear: string;
}, {
    course: string;
    degree: string;
    college: string;
    startYear: string;
    endYear: string;
}>;
export type MentorEducation = zod.infer<typeof mentorEducationSchema>;
export declare const mentorWorkExperienceSchema: zod.ZodObject<{
    company: zod.ZodString;
    role: zod.ZodString;
    startYear: zod.ZodString;
    endYear: zod.ZodString;
}, "strip", zod.ZodTypeAny, {
    startYear: string;
    endYear: string;
    company: string;
    role: string;
}, {
    startYear: string;
    endYear: string;
    company: string;
    role: string;
}>;
export type mentorWorkExperience = zod.infer<typeof mentorWorkExperienceSchema>;
export declare const mentorAvailableTimeSchema: zod.ZodObject<{
    availableTime: zod.ZodEffects<zod.ZodArray<zod.ZodObject<{
        day: zod.ZodNumber;
        availability: zod.ZodBoolean;
        startTime: zod.ZodOptional<zod.ZodString>;
        endTime: zod.ZodOptional<zod.ZodString>;
    }, "strip", zod.ZodTypeAny, {
        day: number;
        availability: boolean;
        startTime?: string | undefined;
        endTime?: string | undefined;
    }, {
        day: number;
        availability: boolean;
        startTime?: string | undefined;
        endTime?: string | undefined;
    }>, "many">, {
        day: number;
        availability: boolean;
        startTime?: string | undefined;
        endTime?: string | undefined;
    }[], {
        day: number;
        availability: boolean;
        startTime?: string | undefined;
        endTime?: string | undefined;
    }[]>;
}, "strip", zod.ZodTypeAny, {
    availableTime: {
        day: number;
        availability: boolean;
        startTime?: string | undefined;
        endTime?: string | undefined;
    }[];
}, {
    availableTime: {
        day: number;
        availability: boolean;
        startTime?: string | undefined;
        endTime?: string | undefined;
    }[];
}>;
export type mentorAvailableTime = zod.infer<typeof mentorAvailableTimeSchema>;
