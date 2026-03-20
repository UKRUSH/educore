"use client";
// Multi-step profile setup wizard (4 steps)

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SemesterForm } from "@/components/profile/SemesterForm";

const STEPS = 4;

export default function ProfileSetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [basic, setBasic] = useState({
    name: "",
    faculty: "",
    degree: "",
    intakeYear: new Date().getFullYear(),
  });
  const [semester] = useState<{
    semesterNo: number;
    gpa: number;
    subjects?: { code: string; name: string; credits: number; mark: number; grade: string }[];
  } | null>(null);
  const [, setProfileId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/profile/me")
      .then((r) => r.ok ? r.json() : null)
      .then((p) => p && setProfileId(p.id));
  }, []);

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/profile/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(basic),
      });
      if (!res.ok) throw new Error();
      setStep(2);
    } catch {
      // show error
    }
    setLoading(false);
  };

  const handleStep2 = async (data: { semesterNo: number; gpa: number; subjects?: { code: string; name: string; credits: number; mark: number; grade: string }[] }) => {
    setLoading(true);
    try {
      const res = await fetch("/api/profile/semesters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStep(3);
    } catch {
      // show error
    }
    setLoading(false);
  };

  const handleStep3 = () => setStep(4);
  const handleStep4 = () => router.push("/profile");

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Profile setup</h1>
      <p className="text-muted-foreground">Step {step} of {STEPS}</p>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Basic info</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleStep1} className="space-y-4">
              <label className="block text-sm font-medium">
                Name
                <Input
                  value={basic.name}
                  onChange={(e) => setBasic((b) => ({ ...b, name: e.target.value }))}
                  required
                  className="mt-1"
                />
              </label>
              <label className="block text-sm font-medium">
                Faculty
                <Input
                  value={basic.faculty}
                  onChange={(e) => setBasic((b) => ({ ...b, faculty: e.target.value }))}
                  required
                  className="mt-1"
                />
              </label>
              <label className="block text-sm font-medium">
                Degree
                <Input
                  value={basic.degree}
                  onChange={(e) => setBasic((b) => ({ ...b, degree: e.target.value }))}
                  required
                  className="mt-1"
                />
              </label>
              <label className="block text-sm font-medium">
                Intake year
                <Input
                  type="number"
                  value={basic.intakeYear}
                  onChange={(e) => setBasic((b) => ({ ...b, intakeYear: Number(e.target.value) }))}
                  className="mt-1"
                />
              </label>
              <Button type="submit" disabled={loading}>Next</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <SemesterForm
          semesterNo={semester?.semesterNo ?? 1}
          gpa={semester?.gpa ?? 0}
          subjects={semester?.subjects}
          onSubmit={handleStep2}
        />
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Clubs joined</CardTitle>
            <p className="text-sm text-muted-foreground">You can add clubs later from your profile.</p>
          </CardHeader>
          <CardContent>
            <Button onClick={handleStep3}>Next</Button>
          </CardContent>
        </Card>
      )}

      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Sports achievements</CardTitle>
            <p className="text-sm text-muted-foreground">You can add sports later from your profile.</p>
          </CardHeader>
          <CardContent>
            <Button onClick={handleStep4}>Finish</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
