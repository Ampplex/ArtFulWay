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
} from "lucide-react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const Card = ({ children, className = "" }) => (
  <div
    className={`rounded-lg border border-gray-700 bg-gray-800/50 ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({ children }) => <div className="p-6 pb-2">{children}</div>;

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-lg font-semibold text-white ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const Artist = () => {
  const check_artist_id = useSelector((state) => state.auth.user_id);
  const [artist_id, setArtistId] = useState(
    
  );
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
  // Add new state for profile picture (if available)
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
    navigate("/edit-profile", {
      state: { artist_id },
    });
  };

  const navigateToProfile = () => {
    navigate('artist_profile', {
      state: { artist_id },
    });
  };

  if (!isRehydrated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Initializing application...</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading artist data...</div>
      </div>
    );
  }

  if (!artist_id && !user_id) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Artist not authenticated</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Notification */}
        {error && (
          <div
            className={`fixed top-4 right-4 max-w-md py-3 px-4 rounded-lg shadow-lg z-50 flex items-center gap-2 bg-red-500/90 text-white`}
          >
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}

        {/* Header Section with Profile */}
        <div className="flex justify-between items-center mt-15">
          <div className="flex items-center gap-4">
            {/* Profile Icon and Info */}
            <div className="flex-shrink-0" onClick={navigateToProfile}>
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 p-0.5">
                <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                  {profilePicture ? (
                    <img
                      src={profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-gray-400" />
                  )}
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-pink-100">
                Welcome back,{" "}
                {loadingName ? "Artist" : artistName.split(" ")[0]}!
              </h1>
              <p className="text-gray-400">Your creative journey continues</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Improved Edit Profile Button */}
            <button
              onClick={navigateToEditProfile}
              className="group relative px-4 py-2 overflow-hidden rounded-lg transition-all duration-300 ease-out bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 opacity-30 group-hover:opacity-40 transition-opacity duration-300 ease-out"></span>
              <span className="relative flex items-center justify-center gap-2 text-sm font-medium text-white">
                <Edit className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                <span>Edit Profile</span>
              </span>
            </button>

            {/* Notification Bell */}
            <button className="p-2 relative bg-gray-800 rounded-full">
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-purple-500 rounded-full"></span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              title: "Monthly Earnings",
              value: "$2,450",
              icon: <Wallet />,
              change: "+12.5%",
            },
            {
              title: "Completed Projects",
              value: completedProjects.toString(),
              icon: <BriefcaseIcon />,
              change: "",
            },
            {
              title: "Projects in Progress",
              value: (acceptedProjects.length - completedProjects).toString(),
              icon: <Activity />,
              change: "",
            },
            {
              title: "Success Rate",
              value:
                completedProjects > 0
                  ? `${Math.round(
                      (completedProjects / acceptedProjects.length) * 100
                    )}%`
                  : "0%",
              icon: <Zap />,
              change: "",
            },
          ].map((stat, index) => (
            <Card key={index}>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-full bg-purple-900/30 flex items-center justify-center">
                    <span className="text-purple-400">{stat.icon}</span>
                  </div>
                  <span className="text-green-400 text-sm">{stat.change}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mt-4">
                  {stat.value}
                </h3>
                <p className="text-gray-400 text-sm">{stat.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI-Matched Projects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-400" />
                AI-Matched Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-700 hover:scrollbar-thumb-purple-500">
                {loading ? (
                  <div className="text-gray-400">
                    Loading matched projects...
                  </div>
                ) : matchedProjects.length === 0 ? (
                  <div className="text-gray-400">
                    No matched projects available
                  </div>
                ) : (
                  matchedProjects.map((project) => (
                    <div
                      key={project._id}
                      className="p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors duration-200"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-white font-medium">
                          {project.project_title}
                        </h4>
                        <div className="flex items-center gap-3">
                          <span className="text-purple-400 text-sm">
                            Budget: ₹{project.project_budget}
                          </span>
                          <span
                            className={`font-medium ${
                              project.project_status === "Accepted"
                                ? "text-green-400"
                                : "text-purple-400"
                            }`}
                          >
                            {project.project_status}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">
                        Client name: {project.client_name}
                      </p>
                      {project.project_status !== "Accepted" && (
                        <button
                          onClick={() => handleAcceptProject(project._id)}
                          disabled={acceptingProject === project._id}
                          className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 ${
                            acceptingProject === project._id
                              ? "bg-purple-700 cursor-not-allowed"
                              : "bg-purple-600 hover:bg-purple-700"
                          }`}
                        >
                          {acceptingProject === project._id ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Accepting...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Accept Project
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  ))
                )}
                {error && (
                  <div className="text-red-400 text-sm mt-2">{error}</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Active Projects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-400" />
                Active Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-700 hover:scrollbar-thumb-purple-500">
                {loadingAccepted ? (
                  <div className="text-gray-400">
                    Loading active projects...
                  </div>
                ) : acceptedProjects.length === 0 ? (
                  <div className="text-gray-400">No active projects</div>
                ) : (
                  acceptedProjects.map((project) => (
                    <div
                      key={project._id}
                      className="p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors duration-200"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-white font-medium">
                          {project.project_title}
                        </h4>
                        <div className="flex items-center gap-3">
                          <span className="text-purple-400 text-sm">
                            Budget: ₹{project.project_budget}
                          </span>
                          <span
                            className={`font-medium ${
                              project.project_status === "Submitted"
                                ? "text-green-400"
                                : project.project_status === "Accepted"
                                ? "text-blue-400"
                                : "text-purple-400"
                            }`}
                          >
                            {project.project_status}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-400">
                          Client: {project.client_name}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-300">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-purple-400" />
                            <span>
                              Due:{" "}
                              {project.deadline
                                ? new Date(
                                    project.deadline
                                  ).toLocaleDateString()
                                : "Not specified"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-purple-400" />
                            <span>
                              {project.estimated_time || "Not specified"}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {project.required_skills ? (
                            project.required_skills
                              .split(",")
                              .map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-purple-900/30 text-purple-200 text-xs rounded-full"
                                >
                                  {skill.trim()}
                                </span>
                              ))
                          ) : (
                            <span className="text-gray-400 text-sm">
                              No skills specified
                            </span>
                          )}
                        </div>
                      </div>
                      {project.project_status === "Accepted" && (
                        <div className="mt-4 flex flex-col gap-4">
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
                            className="group relative w-full overflow-hidden rounded-lg bg-gray-900/80 p-0.5 shadow-xl transition-all duration-300 hover:shadow-purple-500/20"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/40 via-indigo-600/40 to-purple-600/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                            <div className="relative flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-3 text-white transition-all duration-300 group-hover:bg-gray-800">
                              <FileText className="h-5 w-5 text-purple-400 transition-transform duration-300 group-hover:scale-110" />
                              <span className="font-medium">View Details</span>
                              <ArrowRight className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                            </div>
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
                            className="group relative w-full overflow-hidden rounded-lg bg-gray-900/80 p-0.5 shadow-xl transition-all duration-300 hover:shadow-green-500/20"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-green-600/40 via-emerald-600/40 to-green-600/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                            <div className="relative flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-3 text-white transition-all duration-300 group-hover:bg-gray-800">
                              <Send className="h-5 w-5 text-green-400 transition-transform duration-300 group-hover:scale-110" />
                              <span className="font-medium">
                                Submit Project
                              </span>
                              <ArrowRight className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                            </div>
                          </button>
                        </div>
                      )}
                      {project.project_status === "Submitted" && (
                        <div className="mt-3 p-3 bg-green-900/20 border border-green-500/20 rounded-lg">
                          <div className="flex items-center gap-2 text-green-400">
                            <CheckCircle className="w-4 h-4" />
                            <span>Project Submitted</span>
                          </div>
                          {project.submission_date && (
                            <p className="text-sm text-gray-400 mt-1">
                              Submitted on:{" "}
                              {new Date(
                                project.submission_date
                              ).toLocaleDateString()}
                            </p>
                          )}

                          {/* Improved View Submission Details button with complete animations */}
                          <button
                            onClick={() =>
                              navigate("/view_submitted_proj", {
                                state: {
                                  project_id: project._id,
                                },
                              })
                            }
                            className="mt-3 relative w-full overflow-hidden rounded-lg bg-gray-900 shadow-md transition-all duration-300 hover:shadow-purple-500/20 group focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative py-3 px-4 flex items-center justify-center">
                              <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-purple-500 to-indigo-500 transform origin-left transition-all duration-300 group-hover:w-2"></div>
                              <div className="flex items-center justify-center gap-3">
                                <FileText className="h-5 w-5 text-purple-300 transition-transform duration-300 group-hover:scale-110" />
                                <span className="font-medium text-white transition-all duration-300 group-hover:translate-x-1">
                                  View Submission Details
                                </span>
                              </div>
                            </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Learning Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-400" />
                Learning Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">UI/UX Fundamentals</span>
                  <span className="text-white">85%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
                    style={{ width: "85%" }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievement Tracker */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-purple-400" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {["Fast Response", "Top Rated", "Client Favorite"].map(
                  (achievement, index) => (
                    <div
                      key={index}
                      className="text-center p-3 bg-gray-700/30 rounded-lg"
                    >
                      <div className="text-white font-medium">
                        {achievement}
                      </div>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Artist;
