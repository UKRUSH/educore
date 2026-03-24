"use client";
// Form to add/edit a semester with GPA and optional subjects

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface SubjectRow {
  code: string;
  name: string;
  credits: number;
  mark: number;
  grade: string;
}

interface SemesterFormProps {
  semesterNo: number;
  gpa: number;
  subjects?: SubjectRow[];
  onSubmit: (data: { semesterNo: number; gpa: number; subjects?: SubjectRow[] }) => void;
  onCancel?: () => void;
}

export function SemesterForm({
  semesterNo: initialNo,
  gpa: initialGpa,
  subjects = [],
  onSubmit,
  onCancel,
}: SemesterFormProps) {
  const [semesterNo, setSemesterNo] = useState(initialNo);
  const [gpa, setGpa] = useState(initialGpa);
  const [subjectRows, setSubjectRows] = useState<SubjectRow[]>(
    subjects.length ? subjects : [{ code: "", name: "", credits: 0, mark: 0, grade: "" }]
  );

  const addRow = () => {
    setSubjectRows((r) => [...r, { code: "", name: "", credits: 0, mark: 0, grade: "" }]);
  };

  const updateRow = (i: number, field: keyof SubjectRow, value: string | number) => {
    setSubjectRows((r) => {
      const next = [...r];
      next[i] = { ...next[i], [field]: value };
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const valid = subjectRows.filter(
      (s) => s.code.trim() && s.name.trim() && s.credits >= 0 && s.mark >= 0
    );
    onSubmit({
      semesterNo,
      gpa,
      subjects: valid.length ? valid : undefined,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Semester {semesterNo}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <label className="text-sm font-medium">
              Semester number
              <Input
                type="number"
                min={1}
                value={semesterNo}
                onChange={(e) => setSemesterNo(Number(e.target.value))}
                className="mt-1"
              />
            </label>
            <label className="text-sm font-medium">
              GPA
              <Input
                type="number"
                step={0.01}
                min={0}
                max={4}
                value={gpa}
                onChange={(e) => setGpa(Number(e.target.value))}
                className="mt-1"
              />
            </label>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Subjects</span>
              <Button type="button" variant="outline" size="sm" onClick={addRow}>
                Add subject
              </Button>
            </div>
            <div className="space-y-2">
              {subjectRows.map((row, i) => (
                <div key={i} className="grid grid-cols-5 gap-2 items-center">
                  <Input
                    placeholder="Code"
                    value={row.code}
                    onChange={(e) => updateRow(i, "code", e.target.value)}
                  />
                  <Input
                    placeholder="Name"
                    value={row.name}
                    onChange={(e) => updateRow(i, "name", e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Credits"
                    value={row.credits || ""}
                    onChange={(e) => updateRow(i, "credits", Number(e.target.value) || 0)}
                  />
                  <Input
                    type="number"
                    placeholder="Mark"
                    value={row.mark || ""}
                    onChange={(e) => updateRow(i, "mark", Number(e.target.value) || 0)}
                  />
                  <Input
                    placeholder="Grade"
                    value={row.grade}
                    onChange={(e) => updateRow(i, "grade", e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit">Save</Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
