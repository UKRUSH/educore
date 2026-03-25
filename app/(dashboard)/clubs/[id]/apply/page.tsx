"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, Sparkles, CheckCircle } from "lucide-react";

export default function ApplyPage() {
  const { id } = useParams();
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/clubs/${id}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Something went wrong.");
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/clubs"), 2000);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto mt-20">
        <Card className="border-green-200 shadow-lg">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-green-700 mb-2">Application Submitted!</h2>
            <p className="text-gray-600 mb-4">Your application has been sent successfully.</p>
            <div className="animate-pulse">
              <p className="text-sm text-gray-500">Redirecting you back to clubs...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href={`/clubs/${id}`}>
        <Button variant="ghost" className="gap-2 hover:bg-gray-100">
          <ArrowLeft className="h-4 w-4" />
          Back to Club
        </Button>
      </Link>

      <Card className="border-0 shadow-xl overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl md:text-3xl flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-500" />
            Apply to Join
          </CardTitle>
          <p className="text-gray-500 mt-2">
            Tell us why you're interested in joining this club. A strong application increases your chances of being accepted!
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="text-purple-500">✨</span>
              Why do you want to join? (Optional)
            </label>
            <textarea
              className="w-full border border-gray-600 rounded-lg p-4 text-sm min-h-[180px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-700 text-white placeholder:text-gray-400"
              placeholder="I'm passionate about... I want to contribute by... I'm excited to learn..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <p className="text-xs text-gray-400">
              Tip: Share your interests, skills, and what you hope to gain from this experience.
            </p>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          
          <Button 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-6 text-lg gap-2"
            onClick={handleSubmit} 
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Submitting...
              </>
            ) : (
              <>
                Submit Application
                <Send className="h-4 w-4" />
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}