"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Award, LogOut, ArrowRight, Sparkles, Loader2, AlertCircle } from "lucide-react";

interface JoinedClub {
  id: string;
  role: string;
  joinedDate: string;
  points: number;
  club: {
    id: string;
    name: string;
    category: string;
    description: string;
  };
}

const categoryColors: Record<string, string> = {
  "Academic": "bg-blue-100 text-blue-700",
  "Arts": "bg-purple-100 text-purple-700",
  "Sports": "bg-green-100 text-green-700",
  "Recreation": "bg-orange-100 text-orange-700",
  "Technology": "bg-cyan-100 text-cyan-700",
  "default": "bg-gray-100 text-gray-700"
};

export default function ProfileClubsPage() {
  const router = useRouter();
  const [clubs, setClubs] = useState<JoinedClub[]>([]);
  const [loading, setLoading] = useState(true);
  const [leavingClub, setLeavingClub] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchClubs = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/profile/clubs");
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      setClubs(data);
    } catch (error) {
      console.error("Error fetching clubs:", error);
      setError("Failed to load your clubs. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const handleLeaveClub = async (clubId: string, clubName: string) => {
    if (!confirm(`Are you sure you want to leave ${clubName}? This action cannot be undone.`)) {
      return;
    }
    
    setLeavingClub(clubId);
    setMessage(null);
    setError(null);
    
    try {
      console.log(`Attempting to leave club: ${clubId}`);
      
      const res = await fetch(`/api/user/clubs/leave?clubId=${clubId}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log(`Response status: ${res.status}`);
      
      const data = await res.json();
      console.log("Response data:", data);
      
      if (res.ok && data.success) {
        // Remove the club from local state immediately
        setClubs(prevClubs => prevClubs.filter(club => club.club.id !== clubId));
        
        setMessage({ 
          type: "success", 
          text: `✨ Successfully left ${clubName}` 
        });
        
        // Clear message after 3 seconds
        setTimeout(() => setMessage(null), 3000);
        
        // Notify other components
        window.dispatchEvent(new CustomEvent('clubStatusChanged', { 
          detail: { clubId, action: 'leave' } 
        }));
        
      } else {
        // Show the error message from the server
        setError(data.error || "Failed to leave club. Please try again.");
        setTimeout(() => setError(null), 5000);
      }
    } catch (error) {
      console.error("Error leaving club:", error);
      setError("Network error. Please check your connection and try again.");
      setTimeout(() => setError(null), 5000);
    } finally {
      setLeavingClub(null);
    }
  };

  const getPointsBadgeColor = (points: number) => {
    if (points >= 100) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    if (points >= 50) return "bg-green-100 text-green-700 border-green-200";
    if (points >= 20) return "bg-blue-100 text-blue-700 border-blue-200";
    return "bg-gray-100 text-gray-600 border-gray-200";
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin h-12 w-12 text-blue-600 mb-4" />
        <p className="text-gray-500">Loading your clubs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="relative z-10 flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">My Clubs & Societies</h1>
            <p className="text-lg opacity-90">
              Manage your club memberships and track your engagement
            </p>
            <div className="flex gap-3 mt-4">
              <Badge className="bg-white/20 text-white border-white/30">
                {clubs.length} Active Memberships
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30">
                {clubs.reduce((sum, club) => sum + club.points, 0)} Total Points
              </Badge>
            </div>
          </div>
          <Link href="/clubs">
            <Button variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
              Browse More Clubs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Success Message */}
      {message && (
        <div className={`p-4 rounded-lg animate-in slide-in-from-top duration-300 ${
          message.type === "success" 
            ? "bg-green-50 border border-green-200 text-green-700" 
            : "bg-red-50 border border-red-200 text-red-700"
        }`}>
          <div className="flex items-center gap-2">
            {message.type === "success" ? (
              <Sparkles className="h-5 w-5" />
            ) : (
              <LogOut className="h-5 w-5" />
            )}
            <span className="font-medium">{message.text}</span>
          </div>
        </div>
      )}

      {/* Clubs Grid */}
      {clubs.length === 0 ? (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="text-6xl mb-4">🌟</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No clubs joined yet</h3>
            <p className="text-gray-500 mb-6">Discover and join clubs that match your interests</p>
            <Link href="/clubs">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                Explore Clubs
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {clubs.map((joined) => {
            const categoryColor = categoryColors[joined.club.category] || categoryColors.default;
            
            return (
              <Card key={joined.id} className="overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 group">
                <div className={`h-1 bg-gradient-to-r from-${joined.club.category === "Sports" ? "green" : joined.club.category === "Arts" ? "purple" : "blue"}-500`}></div>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                      {joined.club.name}
                    </CardTitle>
                    <Badge className={categoryColor}>
                      {joined.club.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px]">
                    {joined.club.description || "No description available."}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Your Role</p>
                        <p className="text-sm font-semibold text-gray-700">{joined.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Joined</p>
                        <p className="text-sm font-semibold text-gray-700">
                          {new Date(joined.joinedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getPointsBadgeColor(joined.points)}`}>
                      <Award className="h-4 w-4" />
                      <span className="text-sm font-semibold">{joined.points} points</span>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/clubs/${joined.club.id}`}>
                        <Button variant="outline" size="sm" className="hover:bg-gray-100">
                          View
                        </Button>
                      </Link>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleLeaveClub(joined.club.id, joined.club.name)}
                        disabled={leavingClub === joined.club.id}
                        className="hover:bg-red-700 transition-colors"
                      >
                        {leavingClub === joined.club.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <>
                            <LogOut className="h-3 w-3 mr-1" />
                            Leave
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}