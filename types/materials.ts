// Materials-related types

export interface MaterialWithUploader {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string;
  fileType: string;
  subject: string | null;
  summary: string | null;
  tags: string[];
  uploaderId: string;
  createdAt: Date;
}
