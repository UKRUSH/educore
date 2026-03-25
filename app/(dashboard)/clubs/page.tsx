"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Users, Sparkles, Music, Palette, Code, Dumbbell, BookOpen, ChevronRight, Loader2 } from "lucide-react";

interface Club {
  id: string;
  name: string;
  description: string;
  category: string;
  capacity: number;
  memberCount: number;
}

interface UserClubStatus {
  memberClubs: string[];
  appliedClubs: string[];
}

const categoryIcons: Record<string, any> = {
  "Academic": BookOpen,
  "Arts": Palette,
  "Sports": Dumbbell,
  "Recreation": Music,
  "Technology": Code,
  "default": Sparkles
};

const categoryColors: Record<string, string> = {
  "Academic": "bg-blue-100 text-blue-800 border-blue-200",
  "Arts": "bg-purple-100 text-purple-800 border-purple-200",
  "Sports": "bg-green-100 text-green-800 border-green-200",
  "Recreation": "bg-orange-100 text-orange-800 border-orange-200",
  "Technology": "bg-cyan-100 text-cyan-800 border-cyan-200",
  "default": "bg-gray-100 text-gray-800 border-gray-200"
};

export default function ClubsPage() {
  const router = useRouter();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [filteredClubs, setFilteredClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [userStatus, setUserStatus] = useState<UserClubStatus>({ memberClubs: [], appliedClubs: [] });

  const fetchUserStatus = async () => {
    try {
      const res = await fetch("/api/user/clubs");
      if (res.ok) {
        const data = await res.json();
        setUserStatus(data);
      }
    } catch (error) {
      console.error("Error fetching user status:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    // Fetch clubs
    fetch("/api/clubs")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch clubs");
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setClubs(data);
          setFilteredClubs(data);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching clubs:", error);
        if (isMounted) {
          setLoading(false);
        }
      });
    
    fetchUserStatus();
    
    // Listen for club status changes
    const handleStatusChange = () => {
      fetchUserStatus();
    };
    
    window.addEventListener('clubStatusChanged', handleStatusChange);
    
    return () => {
      isMounted = false;
      window.removeEventListener('clubStatusChanged', handleStatusChange);
    };
  }, []);

  useEffect(() => {
    let filtered = clubs;
    if (search) {
      filtered = filtered.filter(club => 
        club.name.toLowerCase().includes(search.toLowerCase()) ||
        club.description?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (category !== "all") {
      filtered = filtered.filter(club => club.category === category);
    }
    setFilteredClubs(filtered);
  }, [search, category, clubs]);

  const categories = ["all", ...new Set(clubs.map(club => club.category))];

  const handleCardClick = (clubId: string) => {
    router.push(`/clubs/${clubId}`);
  };

  const handleApplyClick = (e: React.MouseEvent, clubId: string) => {
    e.stopPropagation();
    router.push(`/clubs/${clubId}/apply`);
  };

  const getButtonStatus = (clubId: string) => {
    if (userStatus.memberClubs.includes(clubId)) {
      return { text: "✓ Member", disabled: true, color: "bg-green-600 hover:bg-green-700 text-white" };
    }
    if (userStatus.appliedClubs.includes(clubId)) {
      return { text: "⏳ Pending", disabled: true, color: "bg-yellow-600 hover:bg-yellow-700 text-white" };
    }
    return { text: "Join Club", disabled: false, color: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white" };
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin h-12 w-12 text-blue-600 mb-4" />
        <p className="text-gray-500">Loading amazing clubs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Your Community</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl">
            Join clubs that match your interests, meet like-minded people, and make your university experience unforgettable.
          </p>
          <div className="flex gap-2 mt-6">
            <Badge className="bg-white/20 text-white border-white/30">50+ Active Clubs</Badge>
            <Badge className="bg-white/20 text-white border-white/30">1000+ Members</Badge>
            <Badge className="bg-white/20 text-white border-white/30">New Events Weekly</Badge>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search clubs by name or interest..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                category === cat
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat === "all" ? "All Clubs" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Clubs Grid */}
      {filteredClubs.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No clubs found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredClubs.map((club) => {
            const spotsLeft = club.capacity - club.memberCount;
            const buttonStatus = getButtonStatus(club.id);
            const isFull = spotsLeft <= 0;
            const IconComponent = categoryIcons[club.category] || categoryIcons.default;
            const categoryColorClass = categoryColors[club.category] || categoryColors.default;
            
            return (
              <div 
                key={club.id} 
                onClick={() => handleCardClick(club.id)}
                className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-2"
              >
                <Card className="h-full overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300">
                  <div className={`h-2 bg-gradient-to-r from-blue-500 to-purple-500`}></div>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${categoryColorClass} group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                          {club.name}
                        </CardTitle>
                      </div>
                      <Badge className={`${categoryColorClass} border`}>
                        {club.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px]">
                      {club.description || "No description available."}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm border-t border-gray-100 pt-3">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700 font-medium">
                          <span className="font-bold text-gray-900">{club.memberCount}</span>
                          <span className="text-gray-500"> / {club.capacity}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${spotsLeft > 0 ? "bg-green-500" : "bg-red-500"}`}></div>
                        <span className={`text-sm font-medium ${spotsLeft > 0 ? "text-green-600" : "text-red-600"}`}>
                          {spotsLeft > 0 ? `${spotsLeft} left` : "Full"}
                        </span>
                      </div>
                    </div>
                    
                    <Button 
                      className={`w-full ${buttonStatus.color} transform transition-all duration-200 hover:scale-105 font-medium`}
                      onClick={(e) => handleApplyClick(e, club.id)}
                      disabled={buttonStatus.disabled || isFull}
                    >
                      {buttonStatus.text}
                      {!buttonStatus.disabled && !isFull && <ChevronRight className="ml-2 h-4 w-4" />}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}