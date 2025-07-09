import React, { useEffect, useState } from "react";
import {
  Wallet,
  Briefcase,
  Zap,
  Trophy,
  Bell,
  BookOpen,
  Target,
  CheckCircle,
  Calendar,
  Clock,
  AlertCircle,
  ArrowRight,
  Activity,
  FileText,
  Send,
  User,
  Edit,
  Sparkles,
  Plus,
  Search,
  Filter,
  ExternalLink,
  TrendingUp,
  Award,
  MessageSquare,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Tooltip } from "@mui/material";

const Card = ({ children, className = "" }) => (
  <div className={`bg-white border border-gray-200 rounded-xl ${className}`}>
    {children}
  </div>
);

// MessagePopup component
const MessagePopup = ({ message, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full relative">
      <button
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl font-bold"
        onClick={onClose}
        aria-label="Close"
      >
        ×
      </button>
      <div className="flex items-center mb-2">
        <AlertCircle className="w-6 h-6 text-red-500 mr-2" />
        <span className="text-lg font-semibold text-gray-800">Notice</span>
      </div>
      <div className="text-gray-700 text-base">{message}</div>
    </div>
  </div>
);

const Artist = () => {
  const check_artist_id = useSelector((state) => state.auth.user_id);
  const [artist_id, setArtistId] = useState();
  const isRehydrated = useSelector((state) => state._persist?.rehydrated);
  const [matchedProjects, setMatchedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptingProject, setAcceptingProject] = useState(null);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user_id } = location.state || {};
  const [acceptedProjects, setAcceptedProjects] = useState([]);
  const [loadingAccepted, setLoadingAccepted] = useState(true);
  const [completedProjects, setCompletedProjects] = useState(0);
  const [artistName, setArtistName] = useState("");
  const [loadingName, setLoadingName] = useState(true);
  const [profilePicture, setProfilePicture] = useState(null);
  const [isVerified, setIsVerified] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    if (check_artist_id) {
      setArtistId(check_artist_id);
    } else if (user_id) {
      setArtistId(user_id);
    }
  }, [check_artist_id, user_id]);

  useEffect(() => {
    if (artist_id) {
      getMatchedProjects();
      getAcceptedProjects();
      getArtistName();
    }
  }, [artist_id]);

  useEffect(() => {
    const verify = async () => {
      if (!artist_id) return;
      const url = `http://localhost:8080/api/artist/checkArtistVerification/${artist_id}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          throw new Error("Failed to check verification status");
        }
        const data = await response.json();
        if (!data.isVerified) {
          setPopupMessage(
            "Your account is not verified yet. Please wait for our team to complete the verification process."
          );
          setIsVerified(false);
        } else if (data.isVerified) {
          setIsVerified(true);
        }
      } catch (error) {
        console.error("Error checking verification status:", error);
        setPopupMessage(
          "An error occurred while checking your verification status. Please try again later."
        );
        setIsVerified(false);
      }
    };
    verify();
  }, [artist_id, navigate]);

  useEffect(() => {
    if (isVerified === false && popupMessage) {
      // Redirect after showing popup for 2 seconds
      const timer = setTimeout(() => {
        navigate("/under_review");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVerified, popupMessage, navigate]);

  const getArtistName = async () => {
    try {
      setLoadingName(true);
      const url = `http://localhost:8080/api/artist/getArtistDetails/?artist_id=${artist_id}`;
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch artist name");
      }

      const data = await response.json();
      setArtistName(data.artist_name || "Artist");
    } catch (error) {
      console.error("Error fetching artist name:", error);
      setArtistName("Artist");
    } finally {
      setLoadingName(false);
    }
  };

  const getMatchedProjects = async () => {
    try {
      setLoading(true);
      if (!artist_id) {
        console.error("Artist ID is not available");
        throw new Error("Artist ID not found");
      }

      const url = `http://localhost:8080/api/artist/getMatchedProjects/?artist_id=${artist_id}`;
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      setMatchedProjects(data.matchedProjects || []);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
      setMatchedProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const getAcceptedProjects = async () => {
    try {
      setLoadingAccepted(true);
      if (!artist_id) {
        console.error("Artist ID is not available");
        throw new Error("Artist ID not found");
      }

      const url = `http://localhost:8080/api/artist/getAcceptedProjects/?artist_id=${artist_id}`;
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      const projects = data.acceptedProjects || [];
      setAcceptedProjects(projects);

      const completedCount = projects.filter(
        (project) => project.project_status === "Submitted"
      ).length;
      setCompletedProjects(completedCount);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
      setAcceptedProjects([]);
      setCompletedProjects(0);
    } finally {
      setLoadingAccepted(false);
    }
  };

  const handleAcceptProject = async (projectId) => {
    try {
      setAcceptingProject(projectId);
      setError(null);

      const url = `http://localhost:8080/api/artist/acceptProject?artist_id=${artist_id}&project_id=${projectId}`;
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to accept project");
      }

      await Promise.all([getMatchedProjects(), getAcceptedProjects()]);
    } catch (error) {
      console.error("Error accepting project:", error);
      setError(error.message);
      alert(error.message);
    } finally {
      setAcceptingProject(null);
    }
  };

  const navigateToEditProfile = () => {
    navigate("artist_profile", {
      state: { artist_id, editProfile: true },
    });
  };

  const navigateToProfile = () => {
    navigate("artist_profile", {
      state: { artist_id },
    });
  };

  if (!isRehydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!artist_id && !user_id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-gray-600">Authentication required</p>
        </div>
      </div>
    );
  }

  const inProgressCount = acceptedProjects.length - completedProjects;
  const totalEarnings = acceptedProjects.reduce(
    (sum, project) =>
      project.project_status === "Submitted"
        ? sum + (project.project_budget || 0)
        : sum,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      {popupMessage && (
        <MessagePopup message={popupMessage} onClose={() => setPopupMessage("")} />
      )}
      {isVerified === null ? (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-600">Checking verification...</p>
          </div>
        </div>
      ) : isVerified ? (
        <>
          {/* Add space for navbar */}
          <div className="h-16" />
          {/* Header */}
          <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <div className="flex items-center space-x-4">
                  <div
                    className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={navigateToProfile}
                  >
                    {profilePicture ? (
                      <img
                        src={profilePicture}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <User className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900">
                      {loadingName ? "Loading..." : artistName}
                    </h1>
                    <p className="text-sm text-gray-500">Artist Dashboard</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={navigateToEditProfile}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>

                  <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Error Notification */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-red-800">{error}</span>
                </div>
              </div>
            )}

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Earnings</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{totalEarnings.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Wallet className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {completedProjects}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">In Progress</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {inProgressCount}
                    </p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Activity className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Available</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {matchedProjects.length}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Target className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Available Projects */}
              <div className="bg-white/80 rounded-2xl shadow-md p-4">
                <div className="flex items-center justify-between mb-6 sticky top-0 z-20 bg-white/80 rounded-t-2xl py-2 px-1 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <span className="group relative inline-block">
                      <Target className="w-5 h-5 text-purple-500" />
                      <span className="absolute left-1/2 -translate-x-1/2 -top-8 opacity-0 group-hover:opacity-100 pointer-events-none bg-black text-white text-xs rounded px-2 py-1 transition-opacity z-20 whitespace-nowrap">
                        Projects matched to your skills
                      </span>
                    </span>
                    Available Projects
                  </h2>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                    {matchedProjects.length} matches
                  </span>
                </div>

                {/* Make this section scrollable */}
                <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
                  {loading ? (
                    <Card className="p-6 animate-pulse">
                      <div className="flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-purple-200 border-t-purple-500 rounded-full animate-spin mr-3"></div>
                        <span className="text-purple-600">Loading projects...</span>
                      </div>
                    </Card>
                  ) : matchedProjects.length === 0 ? (
                    <Card className="p-8 text-center bg-gradient-to-br from-purple-50 to-white border-dashed border-2 border-purple-100">
                      <Target className="w-12 h-12 text-purple-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No matches found
                      </h3>
                      <p className="text-gray-600">
                        We'll notify you when new projects match your skills.
                      </p>
                    </Card>
                  ) : (
                    matchedProjects.map((project) => (
                      <Card
                        key={project._id}
                        className="p-6 hover:shadow-lg transition-shadow duration-200 border border-purple-100 bg-white/90"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900 mb-1 group-hover:underline">
                              {project.project_title}
                            </h3>
                            <p className="text-gray-600 mb-2">
                              {project.client_name}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              {project.deadline && (
                                <span className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {new Date(project.deadline).toLocaleDateString()}
                                </span>
                              )}
                              {project.estimated_time && (
                                <span className="flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {project.estimated_time}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-purple-700">
                              ₹{project.project_budget?.toLocaleString()}
                            </p>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                              {project.project_status}
                            </span>
                          </div>
                        </div>

                        {project.required_skills && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.required_skills
                              .split(",")
                              .slice(0, 3)
                              .map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-md border border-purple-100"
                                >
                                  {skill.trim()}
                                </span>
                              ))}
                            {project.required_skills.split(",").length > 3 && (
                              <span className="px-2 py-1 bg-purple-50 text-purple-400 text-xs rounded-md border border-purple-100">
                                +{project.required_skills.split(",").length - 3}{" "}
                                more
                              </span>
                            )}
                          </div>
                        )}

                        <button
                          onClick={() => handleAcceptProject(project._id)}
                          disabled={acceptingProject === project._id}
                          className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm
                            ${
                              acceptingProject === project._id
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-black text-white hover:bg-gray-900 hover:shadow-md border border-black"
                            }
                          `}
                        >
                          {acceptingProject === project._id ? (
                            <span className="flex items-center justify-center">
                              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                              Accepting...
                            </span>
                          ) : (
                            "Accept Project"
                          )}
                        </button>
                      </Card>
                    ))
                  )}
                </div>
              </div>

              {/* Active Projects */}
              <div className="bg-white/80 rounded-2xl shadow-md p-4">
                <div className="flex items-center justify-between mb-6 sticky top-0 z-20 bg-white/80 rounded-t-2xl py-2 px-1 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <span className="group relative inline-block">
                      <Activity className="w-5 h-5 text-purple-500" />
                      <span className="absolute left-1/2 -translate-x-1/2 -top-8 opacity-0 group-hover:opacity-100 pointer-events-none bg-black text-white text-xs rounded px-2 py-1 transition-opacity z-20 whitespace-nowrap">
                        Projects you are working on
                      </span>
                    </span>
                    Active Projects
                  </h2>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                    {acceptedProjects.length} projects
                  </span>
                </div>

                {/* Make this section scrollable */}
                <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
                  {loadingAccepted ? (
                    <Card className="p-6 animate-pulse">
                      <div className="flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-purple-200 border-t-purple-500 rounded-full animate-spin mr-3"></div>
                        <span className="text-purple-600">Loading projects...</span>
                      </div>
                    </Card>
                  ) : acceptedProjects.length === 0 ? (
                    <Card className="p-8 text-center bg-gradient-to-br from-purple-50 to-white border-dashed border-2 border-purple-100">
                      <Activity className="w-12 h-12 text-purple-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No active projects
                      </h3>
                      <p className="text-gray-600">
                        Accept projects to get started.
                      </p>
                    </Card>
                  ) : (
                    acceptedProjects.map((project) => (
                      <Card
                        key={project._id}
                        className="p-6 hover:shadow-lg transition-shadow duration-200 border border-purple-100 bg-white/90"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900 mb-1 group-hover:underline">
                              {project.project_title}
                            </h3>
                            <p className="text-gray-600 mb-2">
                              {project.client_name}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              {project.deadline && (
                                <span className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {new Date(project.deadline).toLocaleDateString()}
                                </span>
                              )}
                              {project.estimated_time && (
                                <span className="flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {project.estimated_time}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-purple-700">
                              ₹{project.project_budget?.toLocaleString()}
                            </p>
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                project.project_status === "Submitted"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-purple-100 text-purple-700"
                              }`}
                            >
                              {project.project_status}
                            </span>
                          </div>
                        </div>

                        {project.required_skills && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.required_skills
                              .split(",")
                              .slice(0, 3)
                              .map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-md border border-purple-100"
                                >
                                  {skill.trim()}
                                </span>
                              ))}
                          </div>
                        )}

                        {project.project_status === "Accepted" && (
                          <div className="flex space-x-3">
                            <button
                              onClick={() =>
                                navigate(`/artist/project/${project._id}`, {
                                  state: {
                                    project_id: project._id,
                                    project: {
                                      _id: project._id,
                                      project_title: project.project_title,
                                      description: project.description,
                                      project_type: project.project_type,
                                      required_skills: project.required_skills,
                                      deadline: project.deadline,
                                      estimated_time: project.estimated_time,
                                      project_budget: project.project_budget,
                                      experience_required:
                                        project.experience_required,
                                      client_name: project.client_name,
                                      client_id: project.client_id,
                                      project_status: project.project_status,
                                      payment_status: project.payment_status,
                                    },
                                  },
                                })
                              }
                              className="flex-1 py-2 px-4 border border-black rounded-lg text-sm font-medium text-white bg-black hover:bg-gray-900 transition-colors shadow-sm"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() =>
                                navigate("/submit_proj", {
                                  state: {
                                    project_id: project._id,
                                    user_id: artist_id,
                                  },
                                })
                              }
                              className="flex-1 py-2 px-4 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors shadow-sm border border-black"
                            >
                              Submit Work
                            </button>
                          </div>
                        )}

                        {project.project_status === "Submitted" && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center mb-2">
                              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                              <span className="text-sm font-medium text-green-800">
                                Project Submitted
                              </span>
                            </div>
                            {project.submission_date && (
                              <p className="text-sm text-green-600 mb-3">
                                Submitted on{" "}
                                {new Date(
                                  project.submission_date
                                ).toLocaleDateString()}
                              </p>
                            )}
                            <button
                              onClick={() =>
                                navigate("/view_submitted_proj", {
                                  state: { project_id: project._id },
                                })
                              }
                              className="w-full py-2 px-4 bg-black text-white border border-black rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors shadow-sm"
                            >
                              View Submission
                            </button>
                          </div>
                        )}
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Artist;
