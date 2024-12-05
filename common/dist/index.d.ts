import zod from 'zod';
export declare const signupSchema: zod.ZodObject<{
    email: zod.ZodString;
    password: zod.ZodString;
    mobile_number: zod.ZodNumber;
}, "strip", zod.ZodTypeAny, {
    email: string;
    password: string;
    mobile_number: number;
}, {
    email: string;
    password: string;
    mobile_number: number;
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
export declare const day: zod.ZodEnum<["mon", "tues", "wed", "thur", "fri", "sat", "sun"]>;
export declare const mentorSchema: zod.ZodObject<{
    name: zod.ZodString;
    language: zod.ZodArray<zod.ZodString, "many">;
    profilePicture: zod.ZodOptional<zod.ZodString>;
    city: zod.ZodString;
    state: zod.ZodString;
    country: zod.ZodString;
    skill: zod.ZodArray<zod.ZodString, "many">;
    currentlyWorking: zod.ZodBoolean;
    yearsofExperience: zod.ZodNumber;
    domain: zod.ZodString;
    tools: zod.ZodOptional<zod.ZodArray<zod.ZodString, "many">>;
    linkedin: zod.ZodOptional<zod.ZodString>;
    Instagram: zod.ZodOptional<zod.ZodString>;
    price_1month: zod.ZodNumber;
    price_3month: zod.ZodNumber;
    price_6month: zod.ZodNumber;
    sessionsPerMonth: zod.ZodOptional<zod.ZodNumber>;
    education: zod.ZodArray<zod.ZodObject<{
        degree: zod.ZodString;
        college: zod.ZodString;
        startYear: zod.ZodNumber;
        endYear: zod.ZodNullable<zod.ZodNumber>;
    }, "strip", zod.ZodTypeAny, {
        degree: string;
        college: string;
        startYear: number;
        endYear: number | null;
    }, {
        degree: string;
        college: string;
        startYear: number;
        endYear: number | null;
    }>, "many">;
    workExperience: zod.ZodArray<zod.ZodObject<{
        company: zod.ZodString;
        role: zod.ZodString;
        startYear: zod.ZodNumber;
        endYear: zod.ZodNullable<zod.ZodNumber>;
    }, "strip", zod.ZodTypeAny, {
        startYear: number;
        endYear: number | null;
        company: string;
        role: string;
    }, {
        startYear: number;
        endYear: number | null;
        company: string;
        role: string;
    }>, "many">;
    availableTime: zod.ZodEffects<zod.ZodArray<zod.ZodObject<{
        day: zod.ZodEnum<["mon", "tues", "wed", "thur", "fri", "sat", "sun"]>;
        availability: zod.ZodBoolean;
        startTime: zod.ZodOptional<zod.ZodString>;
        endTime: zod.ZodOptional<zod.ZodString>;
    }, "strip", zod.ZodTypeAny, {
        day: "mon" | "tues" | "wed" | "thur" | "fri" | "sat" | "sun";
        availability: boolean;
        startTime?: string | undefined;
        endTime?: string | undefined;
    }, {
        day: "mon" | "tues" | "wed" | "thur" | "fri" | "sat" | "sun";
        availability: boolean;
        startTime?: string | undefined;
        endTime?: string | undefined;
    }>, "many">, {
        day: "mon" | "tues" | "wed" | "thur" | "fri" | "sat" | "sun";
        availability: boolean;
        startTime?: string | undefined;
        endTime?: string | undefined;
    }[], {
        day: "mon" | "tues" | "wed" | "thur" | "fri" | "sat" | "sun";
        availability: boolean;
        startTime?: string | undefined;
        endTime?: string | undefined;
    }[]>;
}, "strip", zod.ZodTypeAny, {
    name: string;
    language: string[];
    city: string;
    state: string;
    country: string;
    skill: string[];
    currentlyWorking: boolean;
    yearsofExperience: number;
    domain: string;
    price_1month: number;
    price_3month: number;
    price_6month: number;
    education: {
        degree: string;
        college: string;
        startYear: number;
        endYear: number | null;
    }[];
    workExperience: {
        startYear: number;
        endYear: number | null;
        company: string;
        role: string;
    }[];
    availableTime: {
        day: "mon" | "tues" | "wed" | "thur" | "fri" | "sat" | "sun";
        availability: boolean;
        startTime?: string | undefined;
        endTime?: string | undefined;
    }[];
    profilePicture?: string | undefined;
    linkedin?: string | undefined;
    Instagram?: string | undefined;
    tools?: string[] | undefined;
    sessionsPerMonth?: number | undefined;
}, {
    name: string;
    language: string[];
    city: string;
    state: string;
    country: string;
    skill: string[];
    currentlyWorking: boolean;
    yearsofExperience: number;
    domain: string;
    price_1month: number;
    price_3month: number;
    price_6month: number;
    education: {
        degree: string;
        college: string;
        startYear: number;
        endYear: number | null;
    }[];
    workExperience: {
        startYear: number;
        endYear: number | null;
        company: string;
        role: string;
    }[];
    availableTime: {
        day: "mon" | "tues" | "wed" | "thur" | "fri" | "sat" | "sun";
        availability: boolean;
        startTime?: string | undefined;
        endTime?: string | undefined;
    }[];
    profilePicture?: string | undefined;
    linkedin?: string | undefined;
    Instagram?: string | undefined;
    tools?: string[] | undefined;
    sessionsPerMonth?: number | undefined;
}>;
export type Mentor = zod.infer<typeof mentorSchema>;
