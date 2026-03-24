// Profile service: CRUD, scores, and rule-based suggestions

import { prisma } from "../prisma";

export interface Scores {
  academic: number;
  sports: number;
  society: number;
  overall: number;
  /** Raw totals (for display on Skill points page) */
  rawSportPoints?: number;
  rawClubPoints?: number;
}

export interface Suggestion {
  type: string;
  message: string;
}

/** Academic Score (0–100): average of all subject marks */
/** Sports Score (0–100): min(total sport points, 100) */
/** Society Score (0–100): min(total club points, 100) */
/** Overall Score: (academic * 0.6) + (sports * 0.2) + (society * 0.2) */
export async function calculateScores(profileId: string): Promise<Scores> {
  const profile = await prisma.studentProfile.findUnique({
    where: { id: profileId },
    include: {
      semesters: { include: { subjects: true } },
      clubs: true,
      sports: true,
    },
  });
  if (!profile) return { academic: 0, sports: 0, society: 0, overall: 0 };

  const allMarks = profile.semesters.flatMap((s) => s.subjects.map((sub) => sub.mark));
  const academicScore = allMarks.length ? allMarks.reduce((a, b) => a + b, 0) / allMarks.length : 0;

  const totalSportPoints = profile.sports.reduce((sum, s) => sum + s.points, 0);
  const sportsScore = Math.min(totalSportPoints, 100);

  const totalClubPoints = profile.clubs.reduce((sum, c) => sum + c.points, 0);
  const societyScore = Math.min(totalClubPoints, 100);

  const overall =
    academicScore * 0.6 + sportsScore * 0.2 + societyScore * 0.2;

  return {
    academic: Math.round(academicScore * 100) / 100,
    sports: Math.min(100, totalSportPoints),
    society: Math.min(100, totalClubPoints),
    overall: Math.round(overall * 100) / 100,
    rawSportPoints: totalSportPoints,
    rawClubPoints: totalClubPoints,
  };
}

/**
 * Rule-based suggestions:
 * 1. Find 3 subjects with lowest marks
 * 2. If latest semester GPA < previous → GPA drop warning
 * 3. If no club membership → suggest joining a club
 * 4. For each weak subject: academic suggestion
 * 5. Append resource and session suggestions
 */
export async function getSuggestions(profileId: string): Promise<Suggestion[]> {
  const suggestions: Suggestion[] = [];
  const profile = await prisma.studentProfile.findUnique({
    where: { id: profileId },
    include: {
      semesters: { include: { subjects: true }, orderBy: { semesterNo: "desc" } },
      clubs: true,
    },
  });
  if (!profile) return suggestions;

  // 1. All subjects with marks, sort by mark ascending, take 3 lowest
  const allSubjects = profile.semesters.flatMap((s) =>
    s.subjects.map((sub) => ({ ...sub, semesterNo: s.semesterNo }))
  );
  const sortedByMark = [...allSubjects].sort((a, b) => a.mark - b.mark);
  const weakSubjects = sortedByMark.slice(0, 3);

  for (const sub of weakSubjects) {
    suggestions.push({
      type: "academic",
      message: `Your marks in ${sub.name} are low. Consider joining a lecturer session.`,
    });
  }

  // 2. GPA drop
  if (profile.semesters.length >= 2) {
    const [latest, prev] = profile.semesters;
    if (latest.gpa < prev.gpa) {
      suggestions.push({
        type: "academic",
        message: "Your GPA dropped compared to the previous semester. Consider using the PDF summarizer and lecturer sessions.",
      });
    }
  }

  // 3. No club
  if (profile.clubs.length === 0) {
    suggestions.push({
      type: "society",
      message: "You have no club membership. Consider joining a club to boost your society score.",
    });
  }

  // 4 & 5. Always append
  suggestions.push({
    type: "resource",
    message: "Use the PDF summarizer for your weak modules.",
  });
  suggestions.push({
    type: "session",
    message: "Book a lecturer session to get help.",
  });

  return suggestions;
}
