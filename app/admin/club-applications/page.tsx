"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Users, 
  Mail, 
  Calendar, 
  Loader2,
  Search,
  MessageSquare,
  User,
  Building2,
  AlertCircle,
  Sparkles,
  Trophy,
  Star,
  ChevronRight,
  Eye
} from "lucide-react";

interface App {
  id: string;
  applicantId: string;
  clubId: string;
  club: { name: string };
  status: string;
  reason: string | null;
  feedback: string | null;
  appliedAt: string;
}

export default function AdminClubApplicationsPage() {
  const [applications, setApplications] = useState<App[]>([]);
  const [filteredApps, setFilteredApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejecting, setRejecting] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const load = () => {
    fetch("/api/clubs/applications")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        setApplications(data);
        setFilteredApps(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    let filtered = applications;
    
    if (filter !== "all") {
      filtered = filtered.filter(app => app.status === filter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.applicantId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredApps(filtered);
  }, [filter, searchTerm, applications]);

  const handleApprove = async (applicationId: string) => {
    try {
      const res = await fetch("/api/clubs/applications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, status: "APPROVED" }),
      });
      if (res.ok) load();
    } catch (error) {
      console.error("Error approving application:", error);
    }
  };

  const handleReject = async (applicationId: string) => {
    try {
      const res = await fetch("/api/clubs/applications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, status: "REJECTED", feedback }),
      });
      if (res.ok) {
        setRejecting(null);
        setFeedback("");
        load();
      }
    } catch (error) {
      console.error("Error rejecting application:", error);
    }
  };

  const getStatusBadge = (status: string, feedback: string | null) => {
    switch (status) {
      case "APPROVED":
        return (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
            <CheckCircle className="h-3.5 w-3.5 text-green-600" />
            <span className="text-xs font-semibold text-green-700">Approved</span>
          </div>
        );
      case "REJECTED":
        return (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 rounded-full">
            <XCircle className="h-3.5 w-3.5 text-red-600" />
            <span className="text-xs font-semibold text-red-700">Rejected</span>
          </div>
        );
      case "PENDING":
        return (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded-full animate-pulse">
            <Clock className="h-3.5 w-3.5 text-yellow-600" />
            <span className="text-xs font-semibold text-yellow-700">Pending Review</span>
          </div>
        );
      default:
        return null;
    }
  };

  const getStatusCounts = () => {
    return {
      all: applications.length,
      PENDING: applications.filter(a => a.status === "PENDING").length,
      APPROVED: applications.filter(a => a.status === "APPROVED").length,
      REJECTED: applications.filter(a => a.status === "REJECTED").length,
    };
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin h-12 w-12 text-blue-600 mb-4" />
        <p className="text-gray-500">Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <Trophy className="h-8 w-8" />
            <h1 className="text-3xl md:text-4xl font-bold">Club Applications</h1>
          </div>
          <p className="text-lg opacity-90 max-w-2xl mb-6">
            Review and manage student club applications. Help build a vibrant campus community!
          </p>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-sm opacity-75">Total</p>
              <p className="text-2xl font-bold">{statusCounts.all}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-sm opacity-75">Pending</p>
              <p className="text-2xl font-bold text-yellow-300">{statusCounts.PENDING}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-sm opacity-75">Approved</p>
              <p className="text-2xl font-bold text-green-300">{statusCounts.APPROVED}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <p className="text-sm opacity-75">Rejected</p>
              <p className="text-2xl font-bold text-red-300">{statusCounts.REJECTED}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              filter === "all"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All ({statusCounts.all})
          </button>
          <button
            onClick={() => setFilter("PENDING")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              filter === "PENDING"
                ? "bg-yellow-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Pending ({statusCounts.PENDING})
          </button>
          <button
            onClick={() => setFilter("APPROVED")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              filter === "APPROVED"
                ? "bg-green-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Approved ({statusCounts.APPROVED})
          </button>
          <button
            onClick={() => setFilter("REJECTED")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              filter === "REJECTED"
                ? "bg-red-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Rejected ({statusCounts.REJECTED})
          </button>
        </div>
        
        <div className="relative min-w-[250px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by club or applicant ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Applications Grid */}
      {filteredApps.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No applications found</h3>
          <p className="text-gray-500">
            {searchTerm || filter !== "all" 
              ? "Try adjusting your filters or search terms" 
              : "When students apply to clubs, you'll see them here"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredApps.map((app, index) => (
            <div 
              key={app.id} 
              className="bg-white rounded-xl border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                  {/* Left Section - Application Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Building2 className="h-5 w-5 text-blue-600" />
                          <h3 className="text-lg font-bold text-gray-800">{app.club.name}</h3>
                        </div>
                        {getStatusBadge(app.status, app.feedback)}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600 font-medium">Applicant ID:</span>
                        <code className="text-xs bg-gray-800 text-gray-100 px-2 py-1 rounded font-mono">
                          {app.applicantId}
                        </code>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Applied:</span>
                        <span className="text-gray-700">
                          {new Date(app.appliedAt).toLocaleDateString()} at {new Date(app.appliedAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    
                    {app.reason && (
                      <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                        <p className="text-sm font-semibold text-blue-700 mb-2 flex items-center gap-1">
                          <Sparkles className="h-4 w-4" />
                          Application Reason:
                        </p>
                        <p className="text-sm text-gray-700 leading-relaxed">{app.reason}</p>
                      </div>
                    )}
                    
                    {app.feedback && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          Admin Feedback:
                        </p>
                        <p className="text-sm text-gray-600">{app.feedback}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Right Section - Actions */}
                  {app.status === "PENDING" && (
                    <div className="flex flex-row lg:flex-col gap-2 min-w-[180px]">
                      <Button
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white gap-2 flex-1 shadow-sm"
                        onClick={() => handleApprove(app.id)}
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        className="gap-2 flex-1 shadow-sm"
                        onClick={() => setRejecting(app.id)}
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  )}
                  
                  {app.status !== "PENDING" && (
                    <div className="flex items-center justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 px-3 py-1.5 h-8 text-xs border-gray-300 hover:bg-gray-50"
                        onClick={() => {
                          const newFeedback = prompt("Add or update feedback:", app.feedback || "");
                          if (newFeedback !== null) {
                            console.log("Update feedback:", newFeedback);
                          }
                        }}
                      >
                        <Star className="h-3.5 w-3.5" />
                        Add Feedback
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rejection Modal */}
      <Modal
        open={rejecting !== null}
        onClose={() => { setRejecting(null); setFeedback(""); }}
        title="Reject Application"
      >
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm font-medium">Are you sure you want to reject this application?</p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Feedback (Optional)
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Provide a reason for rejection to help the applicant understand..."
              className="w-full border border-gray-300 rounded-lg p-3 text-sm min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              This feedback will be shared with the applicant
            </p>
          </div>
          
          <div className="flex gap-3 pt-2">
            <Button 
              variant="destructive" 
              onClick={() => rejecting && handleReject(rejecting)}
              className="flex-1 gap-2"
            >
              <XCircle className="h-4 w-4" />
              Confirm Rejection
            </Button>
            <Button 
              variant="outline" 
              onClick={() => { setRejecting(null); setFeedback(""); }}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}