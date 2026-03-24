// Zod schemas for support API bodies (lecturers, sessions, community)

import { z } from "zod";

export const lecturerRegisterSchema = z.object({
  bio: z.string().optional(),
  expertise: z.array(z.string()).optional(),
});

export const sessionCreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  scheduledAt: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/)),
  capacity: z.number().int().min(1).optional(),
  meetLink: z.string().url().optional().nullable(),
});

export const sessionUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  scheduledAt: z.string().optional(),
  capacity: z.number().int().min(1).optional(),
  meetLink: z.string().url().optional().nullable(),
});

export const communityPostSchema = z.object({
  content: z.string().min(1),
  tags: z.array(z.string()).optional(),
});

export type LecturerRegisterBody = z.infer<typeof lecturerRegisterSchema>;
export type SessionCreateBody = z.infer<typeof sessionCreateSchema>;
export type SessionUpdateBody = z.infer<typeof sessionUpdateSchema>;
export type CommunityPostBody = z.infer<typeof communityPostSchema>;
