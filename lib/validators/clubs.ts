// Zod schemas for clubs API bodies

import { z } from "zod";

export const clubCreateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  category: z.enum(["Academic", "Sports", "Arts", "Cultural"]),
  capacity: z.number().int().min(1).optional(),
});

export const clubUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  category: z.enum(["Academic", "Sports", "Arts", "Cultural"]).optional(),
  capacity: z.number().int().min(1).optional(),
});

export const clubApplySchema = z.object({
  reason: z.string().optional(),
});

export const applicationStatusSchema = z.object({
  applicationId: z.string(),
  status: z.enum(["APPROVED", "REJECTED"]),
  feedback: z.string().optional(),
});

export type ClubCreateBody = z.infer<typeof clubCreateSchema>;
export type ClubUpdateBody = z.infer<typeof clubUpdateSchema>;
export type ClubApplyBody = z.infer<typeof clubApplySchema>;
export type ApplicationStatusBody = z.infer<typeof applicationStatusSchema>;
