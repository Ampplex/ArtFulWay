import React, { useEffect, useState } from "react";
import {
  Wallet,
  BriefcaseIcon,
  Zap,
  Trophy,
  Bell,
  BookOpen,
  Target,
  TrendingUp,
  CheckCircle,
  Calendar,
  Clock,
  Tag,
  DollarSign,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  ArrowRight,
  Activity,
  FileText,
  Send,
  User,
  Edit,
  Star,
  Sparkles,
  Users,
  MonitorCheck,
  Workflow,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const Card = ({ children, className = "" }) => (
  <div
    className={`rounded-2xl border border-gray-100 bg-white shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({ children }) => <div className="p-6 pb-2">{children}</div>;

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-xl font-bold text-gray-900 ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>{children}</div>
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

  const getArtistName = async () => {
    try {
      setLoadingName(true);
      const url = `http://localhost:8080/api/artist/getArtistDetails/?artist_id=${artist_id}`;
      console.log("Fetching artist name from:", url);

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

      // Count completed (submitted) projects
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

      // Refresh both matched and accepted projects lists
      await Promise.all([getMatchedProjects(), getAcceptedProjects()]);
    } catch (error) {
      console.error("Error accepting project:", error);
      setError(error.message);
      // Show error in UI
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
    navigate('artist_profile', {
      state: { artist_id },
    });
  };

  if (!isRehydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-gray-600 text-lg">Initializing application...</div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-gray-600 text-lg">Loading artist data...</div>
        </div>
      </div>
    );
  }

  if (!artist_id && !user_id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <div className="text-gray-600 text-lg">Artist not authenticated</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Background Elements - Minimalist */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-pink-100 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Notification */}
          {error && (
            <div className="fixed top-4 right-4 max-w-md py-4 px-6 rounded-2xl shadow-2xl z-50 flex items-center gap-3 bg-white border-l-4 border-red-500 animate-slide-in">
              <div className="flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Error</p>
                <p className="text-gray-600 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Header Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pt-6 mt-10">
            <div className="flex items-center gap-6">
              {/* Profile Section */}
              <div className="flex-shrink-0 cursor-pointer group" onClick={navigateToProfile}>
                <div className="w-20 h-20 rounded-2xl bg-gray-200 p-0.5 shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                  <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center overflow-hidden">
                    {profilePicture ? (
                      <img
                        src={profilePicture}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    ) : (
                      <User className="w-10 h-10 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200 mb-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-sm font-semibold">ACTIVE ARTIST</span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  Welcome back, {loadingName ? "Artist" : artistName.split(" ")[0]}!
                </h1>
                <p className="text-gray-600 text-lg">Your creative journey continues to flourish</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Edit Profile Button */}
              <button
                onClick={navigateToEditProfile}
                className="group px-6 py-3 bg-white border border-gray-300 text-gray-900 font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center gap-2"
              >
                <Edit className="w-5 h-5 text-gray-700 group-hover:text-gray-900 transition-colors" />
                <span>Edit Profile</span>
              </button>

              {/* Notification Bell */}
              <button className="relative p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border border-gray-200">
                <Bell className="w-6 h-6 text-gray-500" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                </span>
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Monthly Earnings",
                value: "$0",
                icon: <Wallet className="w-7 h-7" />,
                change: "0%",
                iconBg: "bg-green-100",
                iconColor: "text-green-600",
              },
              {
                title: "Completed Projects",
                value: completedProjects.toString(),
                icon: <BriefcaseIcon className="w-7 h-7" />,
                change: "New milestone!",
                iconBg: "bg-blue-100",
                iconColor: "text-blue-600",
              },
              {
                title: "Projects in Progress",
                value: (acceptedProjects.length - completedProjects).toString(),
                icon: <Activity className="w-7 h-7" />,
                change: "Stay focused",
                iconBg: "bg-purple-100",
                iconColor: "text-purple-600",
              },
              {
                title: "Success Rate",
                value:
                  completedProjects > 0
                    ? `${Math.round((completedProjects / acceptedProjects.length) * 100)}%`
                    : "0%",
                icon: <Zap className="w-7 h-7" />,
                change: "Excellent!  ",
                iconBg: "bg-yellow-100",
                iconColor: "text-yellow-600",
              },
            ].map((stat, index) => (
              <Card key={index} className="group hover:scale-105 transform transition-all duration-300">
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-14 h-14 rounded-xl ${stat.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <span className={`${stat.iconColor}`}>{stat.icon}</span>
                    </div>
                    {stat.change && (
                      <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {stat.change}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </h3>
                    <p className="text-gray-600 font-medium">{stat.title}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* AI-Matched Projects */}
            <Card className="transform hover:scale-[1.02] transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                    </div>
                    AI-Matched Projects
                  </CardTitle>
                  <div className="flex items-center gap-2 bg-purple-50 px-3 py-1 rounded-full">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-purple-700">Smart Matching</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                      <div className="text-gray-500">Loading matched projects...</div>
                    </div>
                  ) : matchedProjects.length === 0 ? (
                    <div className="text-center py-12">
                      <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No matches yet</h3>
                      <p className="text-gray-500">We're working on finding perfect projects for you!</p>
                    </div>
                  ) : (
                    matchedProjects.map((project) => (
                      <div
                        key={project._id}
                        className="p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-gray-900 mb-1">
                              {project.project_title}
                            </h4>
                            <p className="text-gray-600 mb-2">
                              Client: <span className="font-medium">{project.client_name}</span>
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-green-600 mb-1">
                              ₹{project.project_budget}
                            </div>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              project.project_status === "Accepted"
                                ? "bg-green-50 text-green-700"
                                : "bg-blue-50 text-blue-700"
                            }`}>
                              {project.project_status}
                            </span>
                          </div>
                        </div>
                        
                        {project.project_status !== "Accepted" && (
                          <button
                            onClick={() => handleAcceptProject(project._id)}
                            disabled={acceptingProject === project._id}
                            className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl text-white font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 ${
                              acceptingProject === project._id
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-xl"
                            }`}
                          >
                            {acceptingProject === project._id ? (
                              <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Accepting...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-5 h-5" />
                                Accept Project
                                <ArrowRight className="w-4 h-4" />
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Active Projects */}
            <Card className="transform hover:scale-[1.02] transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-blue-600" />
                    </div>
                    Active Projects
                  </CardTitle>
                  <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
                    <span className="text-sm font-medium text-blue-700">{acceptedProjects.length} Active</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {loadingAccepted ? (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                      <div className="text-gray-500">Loading active projects...</div>
                    </div>
                  ) : acceptedProjects.length === 0 ? (
                    <div className="text-center py-12">
                      <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No active projects</h3>
                      <p className="text-gray-500">Ready to take on new challenges!</p>
                    </div>
                  ) : (
                    acceptedProjects.map((project) => (
                      <div
                        key={project._id}
                        className="p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-gray-900 mb-1">
                              {project.project_title}
                            </h4>
                            <p className="text-gray-600 mb-2">
                              Client: <span className="font-medium">{project.client_name}</span>
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-green-600 mb-1">
                              ₹{project.project_budget}
                            </div>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              project.project_status === "Submitted"
                                ? "bg-green-50 text-green-700"
                                : project.project_status === "Accepted"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-purple-50 text-purple-700"
                            }`}>
                              {project.project_status}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4 text-purple-500" />
                            <span>
                              Due: {project.deadline
                                ? new Date(project.deadline).toLocaleDateString()
                                : "Not specified"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4 text-blue-500" />
                            <span>{project.estimated_time || "Not specified"}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.required_skills ? (
                            project.required_skills.split(",").slice(0, 3).map((skill, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full font-medium"
                              >
                                {skill.trim()}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-400 text-sm">No skills specified</span>
                          )}
                        </div>

                        {project.project_status === "Accepted" && (
                          <div className="flex gap-3">
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
                                      experience_required: project.experience_required,
                                      client_name: project.client_name,
                                      client_id: project.client_id,
                                      project_status: project.project_status,
                                      payment_status: project.payment_status,
                                    },
                                  },
                                })
                              }
                              className="flex-1 group px-4 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center justify-center gap-2"
                            >
                              <FileText className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
                              <span>View Details</span>
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
                              className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center justify-center gap-2"
                            >
                              <Send className="w-4 h-4" />
                              <span>Submit</span>
                            </button>
                          </div>
                        )}

                        {project.project_status === "Submitted" && (
                          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                            <div className="flex items-center gap-3 text-green-700 mb-2">
                              <CheckCircle className="w-5 h-5" />
                              <span className="font-semibold">Project Submitted Successfully!</span>
                            </div>
                            {project.submission_date && (
                              <p className="text-sm text-green-600 mb-3">
                                Submitted on: {new Date(project.submission_date).toLocaleDateString()}
                              </p>
                            )}
                            <button
                              onClick={() =>
                                navigate("/view_submitted_proj", {
                                  state: { project_id: project._id },
                                })
                              }
                              className="w-full px-4 py-3 bg-white border border-green-300 text-green-700 font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center justify-center gap-2"
                            >
                              <FileText className="w-4 h-4 text-green-500 group-hover:text-green-700" />
                              <span>View Submission</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Learning Progress */}
            <Card className="transform hover:scale-[1.02] transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                  </div>
                  Learning Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">UI/UX Fundamentals</span>
                    <span className="text-gray-900 font-bold">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: "85%" }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievement Tracker */}
            <Card className="transform hover:scale-[1.02] transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-yellow-600" />
                  </div>
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {["Fast Response", "Top Rated", "Client Favorite"].map(
                    (achievement, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center shadow-sm hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="text-gray-700 font-medium">{achievement}</div>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Artist;
