"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Users, 
  Calendar, 
  Award, 
  Sparkles, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Star,
  Shield,
  Heart,
  Mail,
  MapPin,
  ExternalLink,
  Loader2
} from "lucide-react";

interface Club {
  id: string;
  name: string;
  description?: string | null;
  category: string;
  capacity: number;
  memberCount: number;
}

interface ApplicationStatus {
  hasApplied: boolean;
  isMember: boolean;
  applicationStatus?: string;
}

const categoryColors: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
  "Academic": {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    gradient: "from-blue-500 to-cyan-500"
  },
  "Arts": {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    gradient: "from-purple-500 to-pink-500"
  },
  "Sports": {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    gradient: "from-green-500 to-emerald-500"
  },
  "Recreation": {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
    gradient: "from-orange-500 to-amber-500"
  },
  "Technology": {
    bg: "bg-cyan-50",
    text: "text-cyan-700",
    border: "border-cyan-200",
    gradient: "from-cyan-500 to-blue-500"
  },
  "default": {
    bg: "bg-gray-50",
    text: "text-gray-700",
    border: "border-gray-200",
    gradient: "from-gray-500 to-gray-600"
  }
};

export default function ClubDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [applicationStatus, setApplicationStatus] = useState<ApplicationStatus>({
    hasApplied: false,
    isMember: false,
  });
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    fetch(`/api/clubs/${id}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data) setClub({ ...data, memberCount: data.memberCount ?? data._count?.members ?? 0 });
      })
      .finally(() => setLoading(false));
      
    fetch(`/api/clubs/${id}/apply-status`)
      .then((r) => r.json())
      .then((data) => {
        setApplicationStatus(data);
      })
      .catch(() => {});
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin h-12 w-12 text-blue-600 mb-4" />
        <p className="text-gray-500">Loading club details...</p>
      </div>
    );
  }
  
  if (!club) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4 animate-bounce">🔍</div>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Club not found</h2>
        <p className="text-gray-500 mb-6">The club you're looking for doesn't exist</p>
        <Link href="/clubs">
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            Browse Clubs
          </Button>
        </Link>
      </div>
    );
  }

  const spotsLeft = club.capacity - club.memberCount;
  const isFull = spotsLeft <= 0;
  const colors = categoryColors[club.category] || categoryColors.default;
  const occupancyPercentage = (club.memberCount / club.capacity) * 100;

  const getActionButton = () => {
    if (applicationStatus.isMember) {
      return {
        text: "You're a Member! 🎉",
        icon: <Heart className="h-5 w-5" />,
        color: "bg-green-500 hover:bg-green-600",
        disabled: true
      };
    }
    if (applicationStatus.hasApplied) {
      return {
        text: "Application Pending",
        icon: <Clock className="h-5 w-5 animate-pulse" />,
        color: "bg-yellow-500 hover:bg-yellow-600",
        disabled: true
      };
    }
    if (isFull) {
      return {
        text: "Club is Full",
        icon: <Users className="h-5 w-5" />,
        color: "bg-gray-400",
        disabled: true
      };
    }
    return {
      text: "Join This Club",
      icon: <Sparkles className="h-5 w-5" />,
      color: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
      disabled: false
    };
  };

  const actionButton = getActionButton();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Back Button */}
      <Link href="/clubs">
        <Button variant="ghost" className="gap-2 hover:bg-gray-100 transition-all">
          <ArrowLeft className="h-4 w-4" />
          Back to Clubs
        </Button>
      </Link>

      {/* Hero Section with Image Placeholder */}
      <div className="relative overflow-hidden rounded-2xl shadow-2xl">
        <div className={`absolute inset-0 bg-gradient-to-r ${colors.gradient} opacity-90`}></div>
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative z-10 p-8 md:p-12 text-white">
          <div className="flex flex-wrap gap-4 justify-between items-start">
            <div className="space-y-4">
              <Badge className={`${colors.bg} ${colors.text} border-0 text-sm px-3 py-1`}>
                {club.category}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                {club.name}
              </h1>
              <p className="text-lg md:text-xl opacity-90 max-w-2xl leading-relaxed">
                {club.description || "Join us and be part of an amazing community!"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Detailed Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* About Section */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Sparkles className="h-6 w-6 text-blue-500" />
                About This Club
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-700 leading-relaxed text-lg">
                {club.description || "No description available. This club is waiting for you to join and make it amazing!"}
              </p>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${colors.bg}`}>
                    <Users className={`h-5 w-5 ${colors.text}`} />
                  </div>
                  <h3 className="font-semibold text-gray-700">Membership</h3>
                </div>
                <p className="text-3xl font-bold text-white">{club.memberCount}</p>
                <p className="text-sm text-gray-500 mt-1">Active Members</p>
                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Capacity</span>
                    <span className="font-medium text-white">{club.capacity} total</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${colors.gradient} rounded-full transition-all duration-1000`}
                      style={{ width: `${occupancyPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${colors.bg}`}>
                    <Award className={`h-5 w-5 ${colors.text}`} />
                  </div>
                  <h3 className="font-semibold text-gray-700">Benefits</h3>
                </div>
                <ul className="space-y-2 mt-2">
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>Networking opportunities</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>Exclusive events & workshops</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>Leadership development</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>Certificates & recognition</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                Club Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Location</p>
                    <p className="text-sm text-gray-500">University Campus, Room 101</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Contact</p>
                    <p className="text-sm text-gray-500">{club.name.toLowerCase().replace(/\s/g, '')}@club.edu</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Meeting Schedule</p>
                    <p className="text-sm text-gray-500">Every Friday, 4:00 PM - 6:00 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <Shield className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Membership Fee</p>
                    <p className="text-sm text-gray-500">Free for all students</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Join Card */}
        <div>
          <Card className="sticky top-6 border-0 shadow-xl overflow-hidden">
            <div className={`h-2 bg-gradient-to-r ${colors.gradient}`}></div>
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl text-center">Ready to Join?</CardTitle>
              <p className="text-center text-gray-500 text-sm mt-1">
                Become part of our amazing community
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Availability Status */}
              <div className="text-center">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${spotsLeft > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  <div className={`w-2 h-2 rounded-full ${spotsLeft > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                  <span className="text-sm font-medium">
                    {spotsLeft > 0 ? `${spotsLeft} spots available` : 'No spots available'}
                  </span>
                </div>
              </div>

              {/* Progress Ring */}
              <div className="relative flex justify-center">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="58"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-gray-200"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="58"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 58}`}
                      strokeDashoffset={`${2 * Math.PI * 58 * (1 - occupancyPercentage / 100)}`}
                      className={`text-blue-600 transition-all duration-1000 stroke-current`}
                      style={{ stroke: `url(#gradient)` }}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-gray-800">{occupancyPercentage.toFixed(0)}%</span>
                    <span className="text-xs text-gray-500">Full</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <Button 
                className={`w-full ${actionButton.color} text-white font-semibold py-6 text-lg gap-2 transform transition-all duration-200 hover:scale-105`}
                onClick={() => !actionButton.disabled && router.push(`/clubs/${club.id}/apply`)}
                disabled={actionButton.disabled}
              >
                {actionButton.icon}
                {actionButton.text}
              </Button>

              {/* Benefits Checklist */}
              <div className="border-t pt-4">
                <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  What You'll Get
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                    <span>Access to exclusive events</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                    <span>Networking with industry experts</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                    <span>Skill development workshops</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                    <span>Certificate upon completion</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}