// Clubs and applications types

export interface ClubWithMemberCount {
  id: string;
  name: string;
  description: string | null;
  category: string;
  capacity: number;
  memberCount: number;
}

export interface ApplicationWithClub {
  id: string;
  clubId: string;
  clubName: string;
  applicantId: string;
  status: string;
  reason: string | null;
  feedback: string | null;
  appliedAt: Date;
}
