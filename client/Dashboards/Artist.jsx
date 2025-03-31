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
  const check_artist_id = useSelector((state) => state.auth.user_id); // checks availability
  const [artist_id, setArtistId] = useState(useSelector((state) => state.auth.user_id))
  const isRehydrated = useSelector((state) => state._persist?.rehydrated);
  const [matchedProjects, setMatchedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const location = useLocation();
  const {user_id} = location.state || {};
  const [expandedProject, setExpandedProject] = useState(null);
  const navigate = useNavigate();

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
    }
  }, [artist_id]); // Now waits for artist_id to be set before fetching data
  
  const getMatchedProjects = async () => {
    try {
      setLoading(true)
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
      setMatchedProjects([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const toggleExpandProject = (projectId) => {
    if (expandedProject === projectId) {
      setExpandedProject(null);
    } else {
      setExpandedProject(projectId);
    }
  };

  const handleAcceptProject = async (projectId, e) => {
    // Prevent click from propagating to parent elements (important for the card click handler)
    if (e) e.stopPropagation();
    
    try {
      if (!artist_id) {
        console.error("Artist ID is not available");
        setNotification({
          type: "error",
          message: "Artist ID not available. Please log in again."
        });
        return;
      }

      const url = `http://localhost:8080/api/artist/acceptProject`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artist_id: artist_id,
          project_id: projectId
        }),
      });

      if (!response.ok) throw new Error("Failed to accept project");

      // Refresh the projects list after accepting
      getMatchedProjects();

      // Show success notification
      setNotification({
        type: "success",
        message: "Project accepted successfully!"
      });
      
      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);
      
    } catch (error) {
      console.error("Error accepting project:", error);
      setNotification({
        type: "error",
        message: "Failed to accept project. Please try again."
      });
      
      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);
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
        {notification && (
          <div className={`fixed top-4 right-4 max-w-md py-3 px-4 rounded-lg shadow-lg z-50 flex items-center gap-2 ${
            notification.type === "success" ? "bg-emerald-500/90" : "bg-red-500/90"
          } text-white`}>
            {notification.type === "success" ? 
              <CheckCircle className="w-5 h-5" /> : 
              <AlertCircle className="w-5 h-5" />
            }
            <p>{notification.message}</p>
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
        <div className="grid grid-cols-1">
          {/* AI-Matched Projects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-400" />
                AI-Matched Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {matchedProjects.length === 0 ? (
                  <div className="text-gray-400">No project matches yet</div>
                ) : (
                  matchedProjects.map((project) => (
                    <div
                      key={project._id}
                      className="bg-gradient-to-r from-gray-800/80 to-gray-700/30 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-700/50 hover:border-purple-500/30 transition-all shadow-lg hover:shadow-purple-900/20"
                    >
                      <div 
                        className="p-5 cursor-pointer relative"
                        onClick={() => toggleExpandProject(project._id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center flex-wrap gap-2 mb-2">
                              <h4 className="text-white font-medium text-lg">
                                {project.project_title}
                              </h4>
                              <span className="px-2 py-0.5 text-xs rounded-full bg-purple-900/70 text-purple-200 border border-purple-700/50">
                                {project.project_type}
                              </span>
                              <span className={`px-2 py-0.5 text-xs rounded-full ${
                                project.project_status === "Open" 
                                  ? "bg-green-900/70 text-green-200 border border-green-700/50" 
                                  : "bg-amber-900/70 text-amber-200 border border-amber-700/50"
                              }`}>
                                {project.project_status}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                              <div className="flex items-center text-gray-300">
                                <Tag className="w-4 h-4 text-purple-400 mr-2 flex-shrink-0" />
                                <span className="text-sm truncate">
                                  {project.required_skills.split(',')[0]}{project.required_skills.split(',').length > 1 ? '...' : ''}
                                </span>
                              </div>
                              <div className="flex items-center text-gray-300">
                                <Calendar className="w-4 h-4 text-purple-400 mr-2 flex-shrink-0" />
                                <span className="text-sm">
                                  Due: {new Date(project.deadline).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center text-gray-300">
                                <Clock className="w-4 h-4 text-purple-400 mr-2 flex-shrink-0" />
                                <span className="text-sm">{project.estimated_time}</span>
                              </div>
                            </div>
                            
                            <div className="mt-3 text-gray-400 text-sm">
                              <span className="font-semibold text-gray-300">Client: </span>{project.client_name}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 ml-4">
                            <button
                              onClick={(e) => handleAcceptProject(project._id, e)}
                              className="py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md font-medium hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all shadow-md hover:shadow-lg hover:shadow-purple-500/20 flex items-center gap-1"
                            >
                              <span>Accept</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                            
                            <div className="w-8 h-8 rounded-full bg-gray-700/50 flex items-center justify-center border border-gray-600 hover:bg-gray-600/70 transition-colors">
                              {expandedProject === project._id ? (
                                <ChevronUp className="w-5 h-5 text-gray-300" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-300" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {expandedProject === project._id && (
                        <div className="p-5 border-t border-gray-700/50 bg-gray-800/70 backdrop-blur-sm">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-4">
                              <h5 className="text-gray-200 font-medium text-base flex items-center">
                                <Tag className="w-4 h-4 text-purple-400 mr-2" />
                                Project Details
                              </h5>
                              
                              <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700/50">
                                <div className="space-y-3">
                                  <div>
                                    <p className="text-gray-400 text-xs mb-1">Required Skills</p>
                                    <div className="flex flex-wrap gap-1">
                                      {project.required_skills.split(',').map((skill, index) => (
                                        <span key={index} className="px-2 py-1 bg-gray-700/70 text-white text-xs rounded-md">
                                          {skill.trim()}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-gray-400 text-xs mb-1">Experience Level</p>
                                    <p className="text-white text-sm">{project.experience_required}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-400 text-xs mb-1">Description</p>
                                    <p className="text-white text-sm">{project.description}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <h5 className="text-gray-200 font-medium text-base flex items-center">
                                <Clock className="w-4 h-4 text-purple-400 mr-2" />
                                Timeline & Payment
                              </h5>
                              
                              <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700/50">
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <p className="text-gray-400 text-xs mb-1">Deadline</p>
                                    <p className="text-white text-sm flex items-center">
                                      <Calendar className="w-4 h-4 text-purple-400 mr-1" />
                                      {new Date(project.deadline).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-gray-400 text-xs mb-1">Estimated Time</p>
                                    <p className="text-white text-sm flex items-center">
                                      <Clock className="w-4 h-4 text-purple-400 mr-1" />
                                      {project.estimated_time}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-gray-400 text-xs mb-1">Payment Status</p>
                                    <p className="text-white text-sm flex items-center">
                                      <DollarSign className="w-4 h-4 text-purple-400 mr-1" />
                                      {project.payment_status === "-" ? "Not specified" : project.payment_status}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-gray-400 text-xs mb-1">Project Type</p>
                                    <p className="text-white text-sm flex items-center">
                                      <BriefcaseIcon className="w-4 h-4 text-purple-400 mr-1" />
                                      {project.project_type}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="mt-6 flex justify-end">
                                <button
                                  onClick={(e) => handleAcceptProject(project._id, e)}
                                  className="py-2.5 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md font-medium hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all shadow-md hover:shadow-lg hover:shadow-purple-500/20 flex items-center gap-2"
                                >
                                  <span>Accept Project</span>
                                  <ArrowRight className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          </div>
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
                      className="text-center p-4 bg-gray-700/30 rounded-lg"
                    >
                      <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-purple-900/30 flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-purple-400" />
                      </div>
                      <span className="text-sm text-gray-400">
                        {achievement}
                      </span>
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