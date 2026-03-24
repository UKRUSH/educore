// Zod schemas for materials API bodies

import { z } from "zod";

export const materialCreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  fileUrl: z.string().min(1),
  fileType: z.enum(["pdf", "doc", "ppt"]),
  subject: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
});

export const materialUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  fileUrl: z.string().optional(),
  fileType: z.enum(["pdf", "doc", "ppt"]).optional(),
  subject: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
});

export const summarizeBodySchema = z.object({
  summary: z.string(),
});

export const bookmarkBodySchema = z.object({
  materialId: z.string(),
});

export type MaterialCreateBody = z.infer<typeof materialCreateSchema>;
export type MaterialUpdateBody = z.infer<typeof materialUpdateSchema>;
export type SummarizeBody = z.infer<typeof summarizeBodySchema>;
export type BookmarkBody = z.infer<typeof bookmarkBodySchema>;
