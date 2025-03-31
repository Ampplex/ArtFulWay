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
  const [artist_id, setArtistId] = useState(useSelector((state) => state.auth.user_id));
  const isRehydrated = useSelector((state) => state._persist?.rehydrated);
  const [matchedProjects, setMatchedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptingProject, setAcceptingProject] = useState(null);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const {user_id} = location.state || {};
  const [acceptedProjects, setAcceptedProjects] = useState([]);
  const [loadingAccepted, setLoadingAccepted] = useState(true);

  console.log("Current artist_id:", user_id);
  console.log("Is rehydrated:", isRehydrated);
  console.log("Loading state:", loading);

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
    }
  }, [artist_id]);

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
      setAcceptedProjects(data.acceptedProjects || []);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
      setAcceptedProjects([]);
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
      await Promise.all([
        getMatchedProjects(),
        getAcceptedProjects()
      ]);

      // Navigate to the project details page

    } catch (error) {
      console.error("Error accepting project:", error);
      setError(error.message);
      // Show error in UI
      alert(error.message);
    } finally {
      setAcceptingProject(null);
    }
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
          <div className={`fixed top-4 right-4 max-w-md py-3 px-4 rounded-lg shadow-lg z-50 flex items-center gap-2 bg-red-500/90 text-white`}>
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}
      
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-pink-100 mt-15">
              Welcome back, Artist
            </h1>
            <p className="text-gray-400">Your creative journey continues</p>
          </div>
          <button className="p-2 relative bg-gray-800 rounded-full">
            <Bell className="w-5 h-5 text-gray-400" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-purple-500 rounded-full"></span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Monthly Earnings",
              value: "$2,450",
              icon: <Wallet />,
              change: "+12.5%",
            },
            {
              title: "Completed Projects",
              value: "24",
              icon: <BriefcaseIcon />,
              change: "+3",
            },
            {
              title: "Success Rate",
              value: "94%",
              icon: <Zap />,
              change: "+2.1%",
            },
            {
              title: "Profile Views",
              value: "1.2K",
              icon: <TrendingUp />,
              change: "+15.3%",
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
                  <div className="text-gray-400">Loading matched projects...</div>
                ) : matchedProjects.length === 0 ? (
                  <div className="text-gray-400">No matched projects available</div>
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
                        <span className={`font-medium ${
                          project.project_status === "Accepted" 
                            ? "text-green-400" 
                            : "text-purple-400"
                        }`}>
                          {project.project_status}
                        </span>
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
                  <div className="text-red-400 text-sm mt-2">
                    {error}
                  </div>
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
                  <div className="text-gray-400">Loading active projects...</div>
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
                        <span className="text-green-400 font-medium">
                          {project.project_status}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-400">
                          Client: {project.client_name}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-300">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-purple-400" />
                            <span>Due: {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'Not specified'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-purple-400" />
                            <span>{project.estimated_time || 'Not specified'}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {project.required_skills ? project.required_skills.split(',').map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-purple-900/30 text-purple-200 text-xs rounded-full"
                            >
                              {skill.trim()}
                            </span>
                          )) : (
                            <span className="text-gray-400 text-sm">No skills specified</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/matched_artist_page/${project._id}`)}
                        className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white font-medium bg-purple-600 hover:bg-purple-700 transition-all duration-200"
                      >
                        View Details
                        <ArrowRight className="w-4 h-4" />
                      </button>
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