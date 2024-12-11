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
    skill: zod.ZodOptional<zod.ZodArray<zod.ZodString, "many">>;
    currentlyWorking: zod.ZodOptional<zod.ZodBoolean>;
    yearsofExperience: zod.ZodOptional<zod.ZodNumber>;
    domain: zod.ZodOptional<zod.ZodString>;
    linkedin: zod.ZodOptional<zod.ZodString>;
    about: zod.ZodOptional<zod.ZodString>;
}, "strip", zod.ZodTypeAny, {
    name?: string | undefined;
    language?: string[] | undefined;
    linkedin?: string | undefined;
    skill?: string[] | undefined;
    currentlyWorking?: boolean | undefined;
    yearsofExperience?: number | undefined;
    domain?: string | undefined;
    about?: string | undefined;
}, {
    name?: string | undefined;
    language?: string[] | undefined;
    linkedin?: string | undefined;
    skill?: string[] | undefined;
    currentlyWorking?: boolean | undefined;
    yearsofExperience?: number | undefined;
    domain?: string | undefined;
    about?: string | undefined;
}>;
export type Mentor = zod.infer<typeof mentorSchema>;
export declare const mentorGeographicSchema: zod.ZodObject<{
    city: zod.ZodString;
    state: zod.ZodString;
    country: zod.ZodString;
    timezone: zod.ZodString;
}, "strip", zod.ZodTypeAny, {
    city: string;
    state: string;
    country: string;
    timezone: string;
}, {
    city: string;
    state: string;
    country: string;
    timezone: string;
}>;
export type MentorGeographic = zod.infer<typeof mentorGeographicSchema>;
export declare const mentorEducationSchema: zod.ZodArray<zod.ZodObject<{
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
}>, "many">;
export type MentorEducation = zod.infer<typeof mentorEducationSchema>;
export declare const mentorWorkExperienceSchema: zod.ZodArray<zod.ZodObject<{
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
}>, "many">;
export type mentorWorkExperience = zod.infer<typeof mentorWorkExperienceSchema>;
export declare const mentorAvailableTimeSchema: zod.ZodEffects<zod.ZodArray<zod.ZodObject<{
    day: zod.ZodNumber;
    isAvailable: zod.ZodBoolean;
    startTime: zod.ZodString;
    endTime: zod.ZodString;
}, "strip", zod.ZodTypeAny, {
    day: number;
    isAvailable: boolean;
    startTime: string;
    endTime: string;
}, {
    day: number;
    isAvailable: boolean;
    startTime: string;
    endTime: string;
}>, "many">, {
    day: number;
    isAvailable: boolean;
    startTime: string;
    endTime: string;
}[], {
    day: number;
    isAvailable: boolean;
    startTime: string;
    endTime: string;
}[]>;
export type mentorAvailableTime = zod.infer<typeof mentorAvailableTimeSchema>;
