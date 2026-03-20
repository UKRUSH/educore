"use client";
// Single subject result row for display

interface SubjectRowProps {
  code: string;
  name: string;
  credits: number;
  mark: number;
  grade: string;
}

export function SubjectRow({ code, name, credits, mark, grade }: SubjectRowProps) {
  return (
    <tr className="border-b">
      <td className="py-2 pr-4 font-mono text-sm">{code}</td>
      <td className="py-2 pr-4">{name}</td>
      <td className="py-2 pr-4 text-right">{credits}</td>
      <td className="py-2 pr-4 text-right">{mark}</td>
      <td className="py-2 font-medium">{grade}</td>
    </tr>
  );
}
