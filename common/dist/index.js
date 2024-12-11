"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mentorAvailableTimeSchema = exports.mentorWorkExperienceSchema = exports.mentorEducationSchema = exports.mentorGeographicSchema = exports.mentorSchema = exports.day = exports.userSchema = exports.signinSchema = exports.signupSchema = void 0;
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
    skill: zod_1.default.array(zod_1.default.string()).optional(),
    currentlyWorking: zod_1.default.boolean().optional(),
    yearsofExperience: zod_1.default.number().optional(),
    domain: zod_1.default.string().optional(),
    linkedin: zod_1.default.string().url().optional(),
    about: zod_1.default.string().optional()
});
exports.mentorGeographicSchema = zod_1.default.object({
    city: zod_1.default.string(),
    state: zod_1.default.string(),
    country: zod_1.default.string(),
    timezone: zod_1.default.string()
});
exports.mentorEducationSchema = zod_1.default.array(zod_1.default.object({
    degree: zod_1.default.string(),
    college: zod_1.default.string(),
    course: zod_1.default.string(),
    startYear: zod_1.default.string(),
    endYear: zod_1.default.string()
}));
exports.mentorWorkExperienceSchema = zod_1.default.array(zod_1.default.object({
    company: zod_1.default.string(),
    role: zod_1.default.string(),
    startYear: zod_1.default.string(),
    endYear: zod_1.default.string()
}));
exports.mentorAvailableTimeSchema = zod_1.default.array(zod_1.default.object({
    day: zod_1.default.number().min(0).max(6),
    isAvailable: zod_1.default.boolean(),
    startTime: zod_1.default.string(),
    endTime: zod_1.default.string(),
})).refine((arr) => {
    const groupedByDay = {};
    const timeRegex = /^\d{2}:\d{2}$/;
    for (const time of arr) {
        if (time.isAvailable) {
            if (!timeRegex.test(time.startTime) || !timeRegex.test(time.endTime)) {
                return false;
            }
            const startTimeInMinutes = parseTime(time.startTime);
            const endTimeInMinutes = parseTime(time.endTime);
            if (startTimeInMinutes === null || endTimeInMinutes === null || startTimeInMinutes >= endTimeInMinutes) {
                return false;
            }
            if (!groupedByDay[time.day]) {
                groupedByDay[time.day] = [];
            }
            groupedByDay[time.day].push({
                startTime: startTimeInMinutes,
                endTime: endTimeInMinutes
            });
        }
    }
    for (const day in groupedByDay) {
        const intervals = groupedByDay[day];
        intervals.sort((a, b) => a.startTime - b.startTime);
        for (let i = 1; i < intervals.length; i++) {
            if (intervals[i].startTime < intervals[i - 1].endTime)
                return false;
        }
    }
    return true;
}, {
    message: 'Invalid time slots: overlapping or improperly ordered times. Time slots'
});
function parseTime(time) {
    const [hours, minutes] = time.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        return null;
    }
    return hours * 60 + minutes;
}
