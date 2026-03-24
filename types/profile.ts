// Profile-related types for Educore

export interface ProfileWithScores {
  id: string;
  name: string;
  intakeYear: number;
  faculty: string;
  degree: string;
  bio: string | null;
  avatarUrl: string | null;
  scores: {
    academic: number;
    sports: number;
    society: number;
    overall: number;
  };
}

export interface SuggestionItem {
  type: string;
  message: string;
}
