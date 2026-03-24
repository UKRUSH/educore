// Zod schemas for profile API bodies

import { z } from "zod";

export const profileUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  intakeYear: z.number().int().min(2000).max(2030).optional(),
  faculty: z.string().optional(),
  degree: z.string().optional(),
  bio: z.string().optional().nullable(),
  avatarUrl: z.string().url().optional().nullable(),
});

export const semesterSchema = z.object({
  semesterNo: z.number().int().min(1).max(20),
  gpa: z.number().min(0).max(4),
  subjects: z.array(z.object({
    code: z.string(),
    name: z.string(),
    credits: z.number().int().min(0),
    mark: z.number().min(0).max(100),
    grade: z.string(),
  })).optional(),
});

export const subjectSchema = z.object({
  semesterId: z.string(),
  code: z.string(),
  name: z.string(),
  credits: z.number().int().min(0),
  mark: z.number().min(0).max(100),
  grade: z.string(),
});

export const studentClubSchema = z.object({
  clubId: z.string(),
  role: z.enum(["Member", "Secretary", "President"]).optional(),
  joinedDate: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
});

export const sportAchievementSchema = z.object({
  sportName: z.string(),
  type: z.enum(["Trophy", "Certificate", "Medal"]),
  place: z.string().optional().nullable(),
  date: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  points: z.number().int().min(0).optional(),
  fileUrl: z.string().url().optional().nullable(),
});

export type ProfileUpdateBody = z.infer<typeof profileUpdateSchema>;
export type SemesterBody = z.infer<typeof semesterSchema>;
export type SubjectBody = z.infer<typeof subjectSchema>;
export type StudentClubBody = z.infer<typeof studentClubSchema>;
export type SportAchievementBody = z.infer<typeof sportAchievementSchema>;
