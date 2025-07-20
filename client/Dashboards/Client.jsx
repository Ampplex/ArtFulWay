import React, { useState, useEffect } from "react";
import {
  Wallet,
  BriefcaseIcon,
  Zap,
  Trophy,
  Bell,
  TrendingUp,
  Star,
  Clock,
  Award,
  Plus,
  ChevronRight,
  Eye,
  User,
  Edit,
  Activity,
  Sparkles,
  AlertCircle,
  Megaphone, // New icon for Ad Generation
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

// Components
const Card = ({ children, className = "", onClick }) => (
  <div
    className={`rounded-2xl border border-gray-100 bg-white shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
    onClick={onClick}
    style={onClick ? { cursor: "pointer" } : {}}
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

const StatCard = ({ icon, title, value, change, iconBg, iconColor, onClick, isClickable = false }) => (
  <Card className={`group hover:scale-105 transform transition-all duration-300 ${isClickable ? 'cursor-pointer hover:shadow-2xl' : ''}`} onClick={onClick}>
    <CardContent className="space-y-4">
      <div className="flex items-center justify-between">
        <div className={`w-14 h-14 rounded-xl ${iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <span className={`${iconColor}`}>{icon}</span>
        </div>
        {change && (
          <span className={`text-sm font-medium px-3 py-1 rounded-full ${
            change.startsWith("+")
              ? "text-green-600 bg-green-50"
              : change === "0%" 
              ? "text-gray-600 bg-gray-50"
              : change === "New!"
              ? "text-purple-600 bg-purple-50"
              : "text-red-600 bg-red-50"
          }`}>
            {change}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-3xl font-bold text-gray-900 mb-1">
          {value}
        </h3>
        <p className="text-gray-600 font-medium">{title}</p>
      </div>
    </CardContent>
  </Card>
);

const Client = () => {
  // Fetch client_id from Redux state
  const check_client_id = useSelector((state) => state.auth.user_id);
  const [client_id, setClientId] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user_id: locationUserId } = location.state || {}; // Renamed to avoid conflict
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    if (check_client_id) {
      setClientId(check_client_id);
    } else if (locationUserId) {
      setClientId(locationUserId);
    } else {
      // If client_id is still not found, it might be an issue with initial load or persistence.
      console.warn("Client ID not found in Redux or location state in Client.jsx.");
      // Optionally, you might want to redirect to login or show an error here
    }
  }, [check_client_id, locationUserId]);

  // State for dashboard data
  const [dashboardData, setDashboardData] = useState({
    user: {
      name: "Client",
      message: "Your creative journey continues to flourish",
    },
    stats: [
      {
        title: "Completed Projects",
        value: "24",
        icon: "briefcase",
        change: "+3",
      },
    ],
    activeProjects: [],
    clientRewards: [
      {
        name: "Loyalty Discount",
        description: "10% off next project",
        icon: "star",
        expiry: "30 days",
      },
      {
        name: "Priority Support",
        description: "24/7 dedicated assistance",
        icon: "zap",
        expiry: "Ongoing",
      },
      {
        name: "Premium Templates",
        description: "Access to exclusive templates",
        icon: "award",
        expiry: "60 days",
      },
    ],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Handle view submission click
  const handleViewSubmission = (project_id) => {
    navigate("/view_submitted_proj", { state: { project_id } });
  };

  // Navigate to edit profile
  const navigateToEditProfile = () => {
    navigate("/client_profile", {
      state: { client_id, editProfile: true },
    });
  };

  // Navigate to profile
  const navigateToProfile = () => {
    navigate('/client_profile', {
      state: { client_id },
    });
  };

  // Navigate to Ad Generation Tool
  const navigateToAdGenerator = () => {
    console.log("Navigating to Ad Generator", client_id);
    if (!client_id) {
      alert("Client ID not set. Please wait for dashboard to load.");
      return;
    }
    navigate('/ad_generation', {
      state: { client_id },
    });
  };

  // Fetch projects data only when client ID is ready
  useEffect(() => {
    const fetchProjects = async () => {
      // Don't proceed if client ID isn't ready
      if (!client_id) {
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `http://localhost:8080/api/client/get_projects?client_id=${client_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          // Handle different HTTP error status codes
          switch (response.status) {
            case 404:
              throw new Error(
                "Projects endpoint not found. Please check API URL or contact support."
              );
            case 400:
              throw new Error(
                "Invalid request. Please check client ID format."
              );
            case 401:
              throw new Error("Authentication required. Please log in again.");
            case 403:
              throw new Error(
                "You don't have permission to access these projects."
              );
            default:
              throw new Error(
                `Server error (${response.status}). Please try again later.`
              );
          }
        }

        const data = await response.json();

        if (data.success) {
          console.log("Projects fetched successfully:", data);

          // Transform API data to match our component's expected format
          const formattedProjects = data.data.map((project) => ({
            id: project._id,
            title:
              project.project_title ||
              project.project_name ||
              "Untitled Project",
            deadline: calculateDeadlineDays(project.deadline),
            status: project.project_status,
            payment: `${project.project_budget}`,
          }));

          // Update the dashboard data with the fetched projects
          setDashboardData((prevData) => ({
            ...prevData,
            activeProjects: formattedProjects,
            user: {
              ...prevData.user,
              name: data.client_name || prevData.user.name,
            },
          }));
        } else {
          // Handle case where success is false
          throw new Error(data.message || "Failed to fetch projects");
        }
      } catch (err) {
        console.error("Error fetching projects:", err.message || err);

        // Set error state for user-friendly error display
        setError(
          err.message || "Failed to load projects. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };
    if (client_id) {
      fetchProjects();
    }
  }, [client_id]);

  // Helper function to calculate days until deadline
  const calculateDeadlineDays = (deadlineDate) => {
    const deadline = new Date(deadlineDate);
    const today = new Date();
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays <= 0 ? "Overdue" : `${diffDays} days`;
  };

  // Icon mapping function
  const renderIcon = (iconName) => {
    const iconMap = {
      wallet: <Wallet className="w-7 h-7" />,
      briefcase: <BriefcaseIcon className="w-7 h-7" />,
      zap: <Zap className="w-7 h-7" />,
      trophy: <Trophy className="w-7 h-7" />,
      trendingUp: <TrendingUp className="w-7 h-7" />,
      star: <Star className="w-7 h-7" />,
      clock: <Clock className="w-7 h-7" />,
      award: <Award className="w-7 h-7" />,
      activity: <Activity className="w-7 h-7" />,
      megaphone: <Megaphone className="w-7 h-7" />, // New icon for Ad Generation
    };

    return iconMap[iconName] || <Award className="w-7 h-7" />;
  };

  // DEBUG: Print client_id in render
  // Remove this after debugging
  console.log("client_id in render:", client_id);

  if (loading && !client_id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-gray-600 text-lg">Initializing your dashboard...</div>
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
                <div className="inline-flex items-center px-3 py-1 bg-purple-50 text-purple-700 rounded-full border border-purple-200 mb-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-sm font-semibold">PREMIUM CLIENT</span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  Welcome back, {dashboardData.user.name.split(" ")[0]}!
                </h1>
                <p className="text-gray-600 text-lg">
                  {dashboardData.user.message}
                </p>
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
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                </span>
              </button>
            </div>
          </div>

          {/* Stats Grid - Updated to include 5 cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              {
                title: "Total Investment",
                value: "$0",
                icon: "wallet",
                change: "0%",
                iconBg: "bg-green-100",
                iconColor: "text-green-600",
                isClickable: false,
              },
              {
                title: "Completed Projects",
                value: "24",
                icon: "briefcase",
                change: "+3",
                iconBg: "bg-blue-100",
                iconColor: "text-blue-600",
                isClickable: false,
              },
              {
                title: "Projects in Progress",
                value: dashboardData.activeProjects.length.toString(),
                icon: "activity",
                change: "Active",
                iconBg: "bg-purple-100",
                iconColor: "text-purple-600",
                isClickable: false,
              },
              {
                title: "Success Rate",
                value: "98%",
                icon: "trophy",
                change: "Excellent!",
                iconBg: "bg-yellow-100",
                iconColor: "text-yellow-600",
                isClickable: false,
              },
              {
                title: "Ad Generation Tool",
                value: "Create",
                icon: "megaphone",
                change: "New!",
                iconBg: "bg-orange-100",
                iconColor: "text-orange-600",
                isClickable: true, // Force clickable for debugging
                onClick: navigateToAdGenerator, // Force handler for debugging
              },
            ].map((stat, index) => (
              <StatCard
                key={index}
                icon={renderIcon(stat.icon)}
                title={stat.title}
                value={stat.value}
                change={stat.change}
                iconBg={stat.iconBg}
                iconColor={stat.iconColor}
                isClickable={stat.isClickable}
                onClick={stat.onClick}
              />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Active Projects (Left Column) */}
            <Card className="transform hover:scale-[1.02] transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <BriefcaseIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    Active Projects
                  </CardTitle>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
                      <span className="text-sm font-medium text-blue-700">
                        {dashboardData.activeProjects.length} Active
                      </span>
                    </div>
                    <Link to="/add_proj">
                      <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center gap-2 shadow-lg hover:shadow-xl">
                        <Plus className="w-4 h-4" />
                        <span>Add Project</span>
                      </button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {!client_id ? (
                    <div className="text-center py-12">
                      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-500">Initializing your dashboard...</p>
                    </div>
                  ) : loading ? (
                    <div className="text-center py-12">
                      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-500">Loading your projects...</p>
                    </div>
                  ) : error ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 text-red-400 mx-auto mb-4">
                        <AlertCircle className="w-full h-full" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load projects</h3>
                      <p className="text-gray-500 mb-4">{error}</p>
                      <div className="flex justify-center gap-4">
                        <button
                          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                          onClick={() => window.location.reload()}
                        >
                          Try Again
                        </button>
                        <Link to="/add_proj">
                          <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Add Project
                          </button>
                        </Link>
                      </div>
                    </div>
                  ) : dashboardData.activeProjects &&
                    dashboardData.activeProjects.length > 0 ? (
                    <>
                      {dashboardData.activeProjects.map((project) => {
                        // Check if the project has a submitted status
                        const isSubmitted =
                          project.status &&
                          project.status.toLowerCase() === "submitted";

                        return (
                          <div
                            key={project.id}
                            className={`p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer group ${
                              isSubmitted
                                ? "hover:border-green-300 hover:bg-green-50/30"
                                : ""
                            }`}
                            onClick={() => {
                              // Only navigate if the project is submitted
                              if (isSubmitted) {
                                handleViewSubmission(project.id);
                              }
                            }}
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex-1">
                                <h4 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                  {project.title}
                                </h4>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <span>Due in {project.deadline}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Wallet className="w-4 h-4 text-green-500" />
                                    <span className="text-green-600 font-semibold">₹{project.payment}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                {/* Status badge with view indicator for submitted projects */}
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                      isSubmitted
                                        ? "bg-green-50 text-green-700 border border-green-200"
                                        : "bg-blue-50 text-blue-700 border border-blue-200"
                                    }`}
                                  >
                                    {project.status}
                                  </span>

                                  {/* Visual indicator for submitted projects */}
                                  {isSubmitted && (
                                    <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                      <Eye className="w-4 h-4" />
                                      <span className="hidden sm:inline">View</span>
                                    </div>
                                  )}
                                </div>

                                <ChevronRight className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:text-blue-500 transition-all transform group-hover:translate-x-1" />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div className="flex justify-center mt-6">
                        <Link to="/add_proj">
                          <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center gap-2 shadow-lg hover:shadow-xl">
                            <Plus className="w-4 h-4" />
                            Add new project
                          </button>
                        </Link>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-2xl bg-blue-50 mx-auto mb-4 flex items-center justify-center">
                        <BriefcaseIcon className="w-8 h-8 text-blue-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No active projects</h3>
                      <p className="text-gray-500 mb-6">
                        Start a new project to bring your creative vision to life
                      </p>
                      <Link to="/add_proj">
                        <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl">
                          <Plus className="w-4 h-4" />
                          Create your first project
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Client Rewards (Right Column) */}
            <Card className="transform hover:scale-[1.02] transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-yellow-600" />
                    </div>
                    Your Rewards
                  </CardTitle>
                  <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-700">Premium Benefits</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {dashboardData.clientRewards &&
                  dashboardData.clientRewards.length > 0 ? (
                    dashboardData.clientRewards.map((reward, index) => (
                      <div
                        key={index}
                        className="p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 hover:border-yellow-200 cursor-pointer group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-yellow-200 flex-shrink-0">
                            <span className="text-yellow-600 transition-colors group-hover:text-yellow-700">
                              {renderIcon(reward.icon)}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-yellow-700 transition-colors">
                              {reward.name}
                            </h4>
                            <p className="text-gray-600 mb-2">
                              {reward.description}
                            </p>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-500">
                                Expires: {reward.expiry}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-2xl bg-yellow-50 mx-auto mb-4 flex items-center justify-center">
                        <Award className="w-8 h-8 text-yellow-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No rewards available yet</h3>
                      <p className="text-gray-500">
                        Complete projects to earn exclusive rewards and benefits
                      </p>
                    </div>
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

export default Client;