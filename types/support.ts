// Support: lecturers, sessions, community types

export interface LecturerPublic {
  id: string;
  bio: string | null;
  expertise: string[];
  isVerified: boolean;
  email?: string;
}

export interface SessionWithLecturer {
  id: string;
  title: string;
  description: string | null;
  scheduledAt: Date;
  capacity: number;
  meetLink: string | null;
  lecturerId: string;
}
