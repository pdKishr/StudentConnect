"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mentorSchema = exports.day = exports.userSchema = exports.signinSchema = exports.signupSchema = void 0;
const zod_1 = __importDefault(require("zod"));
// user & mentor signup validation
exports.signupSchema = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(8),
    mobile_number: zod_1.default.number().min(10).max(15)
});
// user & mentor signin validation
exports.signinSchema = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(8)
});
// user profile update
exports.userSchema = zod_1.default.object({
    name: zod_1.default.string().min(1).optional(),
    language: zod_1.default.array(zod_1.default.string()).optional(),
    city: zod_1.default.string().optional(),
    state: zod_1.default.string().optional(),
    country: zod_1.default.string().optional(),
    profilePicture: zod_1.default.string().url().optional(),
    linkedin: zod_1.default.string().url().optional(),
    Instagram: zod_1.default.string().url().optional(),
    resume: zod_1.default.string().url().optional(),
    highestDegree: zod_1.default.string().optional(),
    course: zod_1.default.string().optional(),
    collage: zod_1.default.string().optional()
});
//  mentor profileupdate validation
exports.day = zod_1.default.enum(["mon", "tues", "wed", "thur", "fri", "sat", "sun"]);
exports.mentorSchema = zod_1.default.object({
    name: zod_1.default.string().min(1),
    language: zod_1.default.array(zod_1.default.string()),
    profilePicture: zod_1.default.string().url().optional(),
    city: zod_1.default.string(),
    state: zod_1.default.string(),
    country: zod_1.default.string(),
    skill: zod_1.default.array(zod_1.default.string()),
    currentlyWorking: zod_1.default.boolean(),
    yearsofExperience: zod_1.default.number(),
    domain: zod_1.default.string(),
    tools: zod_1.default.array(zod_1.default.string()).optional(),
    linkedin: zod_1.default.string().url().optional(),
    Instagram: zod_1.default.string().url().optional(),
    price_1month: zod_1.default.number().min(1000).max(50000),
    price_3month: zod_1.default.number().min(1000).max(50000),
    price_6month: zod_1.default.number().min(1000).max(50000),
    sessionsPerMonth: zod_1.default.number().min(1).optional(),
    education: zod_1.default.array(zod_1.default.object({
        degree: zod_1.default.string(),
        college: zod_1.default.string(),
        startYear: zod_1.default.number(),
        endYear: zod_1.default.number().nullable(),
    })),
    workExperience: zod_1.default.array(zod_1.default.object({
        company: zod_1.default.string(),
        role: zod_1.default.string(),
        startYear: zod_1.default.number(),
        endYear: zod_1.default.number().nullable(),
    })),
    availableTime: zod_1.default.array(zod_1.default.object({
        day: exports.day,
        availability: zod_1.default.boolean(),
        startTime: zod_1.default.string().optional(),
        endTime: zod_1.default.string().optional(),
    })).refine((times) => {
        return times.every((time) => {
            if (time.availability) {
                return time.startTime !== null && time.startTime !== undefined && time.endTime !== null && time.endTime !== null;
            }
            return true;
        });
    }, { message: 'if availability is true, startTime and endTime must be present' })
});
