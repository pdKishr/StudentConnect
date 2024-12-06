"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mentorAvailableTimeSchema = exports.mentorWorkExperienceSchema = exports.mentorEducationSchema = exports.mentorSchema = exports.day = exports.userSchema = exports.signinSchema = exports.signupSchema = void 0;
const zod_1 = __importDefault(require("zod"));
// user & mentor signup validation
exports.signupSchema = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(8),
    mobile_number: zod_1.default.string().min(10).max(15)
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
exports.day = zod_1.default.enum(["mon", "tue", "wed", "thu", "fri", "sat", "sun"]);
exports.mentorSchema = zod_1.default.object({
    name: zod_1.default.string().min(1).optional(),
    language: zod_1.default.array(zod_1.default.string()).optional(),
    profilePicture: zod_1.default.string().url().optional(),
    city: zod_1.default.string().optional(),
    state: zod_1.default.string().optional(),
    country: zod_1.default.string().optional(),
    skill: zod_1.default.array(zod_1.default.string()).optional(),
    currentlyWorking: zod_1.default.boolean().optional(),
    yearsofExperience: zod_1.default.number().optional(),
    domain: zod_1.default.string().optional(),
    tools: zod_1.default.array(zod_1.default.string()).optional(),
    linkedin: zod_1.default.string().url().optional(),
    Instagram: zod_1.default.string().url().optional(),
    price_1month: zod_1.default.number().min(1000).max(50000).optional(),
    price_3month: zod_1.default.number().min(1000).max(50000).optional(),
    price_6month: zod_1.default.number().min(1000).max(50000).optional(),
    sessionsPerMonth: zod_1.default.number().min(1).optional(),
});
exports.mentorEducationSchema = zod_1.default.object({
    degree: zod_1.default.string(),
    college: zod_1.default.string(),
    course: zod_1.default.string(),
    startYear: zod_1.default.string(),
    endYear: zod_1.default.string()
});
exports.mentorWorkExperienceSchema = zod_1.default.object({
    company: zod_1.default.string(),
    role: zod_1.default.string(),
    startYear: zod_1.default.string(),
    endYear: zod_1.default.string()
});
exports.mentorAvailableTimeSchema = zod_1.default.object({
    availableTime: zod_1.default.array(zod_1.default.object({
        day: zod_1.default.number().min(0).min(6),
        availability: zod_1.default.boolean(),
        startTime: zod_1.default.string().optional(),
        endTime: zod_1.default.string().optional(),
    })).refine((arr) => {
        return arr.length === 7 && arr.every((time) => {
            if (time.availability) {
                return time.startTime !== null && time.startTime !== undefined && time.endTime !== null && time.endTime !== null;
            }
            return true;
        });
    }, { message: 'if availability is true, startTime and endTime must be present' })
});
