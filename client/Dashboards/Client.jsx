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
} from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

// Components
const Card = ({ children, className = "" }) => (
  <div
    className={`rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm transition-all duration-300 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 ${className}`}
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

const StatCard = ({ icon, title, value, change }) => (
  <Card className="overflow-hidden group">
    <CardContent>
      <div className="flex items-center justify-between">
        <div className="w-12 h-12 rounded-full bg-purple-900/30 flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:bg-purple-800/50">
          <span className="text-purple-400 transition-colors group-hover:text-purple-200">
            {icon}
          </span>
        </div>
        <span
          className={`text-sm font-medium px-2 py-1 rounded-full ${
            change.startsWith("+")
              ? "text-green-300 bg-green-900/20"
              : "text-red-300 bg-red-900/20"
          }`}
        >
          {change}
        </span>
      </div>
      <h3 className="text-2xl font-bold text-white mt-4 transition-all duration-300 group-hover:translate-x-1">
        {value}
      </h3>
      <p className="text-gray-400 text-sm">{title}</p>
    </CardContent>
  </Card>
);

const Client = () => {
  // Fetch client_id from Redux state with fallback to localStorage
  const check_client_id = useSelector((state) => state.auth.user_id);
  const [client_id, setClientId] = useState(
    useSelector((state) => state.auth.user_id)
  );
  const location = useLocation();
  const { user_id } = location.state || {};

  useEffect(() => {
    if (check_client_id) {
      setClientId(check_client_id);
    } else if (user_id) {
      setClientId(user_id);
    }
  }, [check_client_id, user_id]);

  // State for dashboard data
  const [dashboardData, setDashboardData] = useState({
    user: {
      name: "Client",
      message: "Your creative journey continues",
    },
    stats: [
      {
        title: "Monthly Earnings",
        value: "$2,450",
        icon: "wallet",
        change: "+12.5%",
      },
      {
        title: "Completed Projects",
        value: "24",
        icon: "briefcase",
        change: "+3",
      },
      { title: "Success Rate", value: "94%", icon: "zap", change: "+2.1%" },
      {
        title: "Profile Views",
        value: "1.2K",
        icon: "trendingUp",
        change: "+15.3%",
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
            payment: `$${project.project_budget}`,
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
      wallet: <Wallet />,
      briefcase: <BriefcaseIcon />,
      zap: <Zap />,
      trophy: <Trophy />,
      trendingUp: <TrendingUp />,
      star: <Star />,
      clock: <Clock />,
      award: <Award />,
    };

    return iconMap[iconName] || <Award />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-pink-100 mt-15">
              Welcome back, {dashboardData.user.name}
            </h1>
            <p className="text-gray-400 text-lg">
              {dashboardData.user.message}
            </p>
          </div>
          <button className="p-3 relative bg-gray-800 rounded-full hover:bg-gray-700 transition-colors duration-300 group">
            <Bell className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {dashboardData.stats.map((stat, index) => (
            <StatCard
              key={index}
              icon={renderIcon(stat.icon)}
              title={stat.title}
              value={stat.value}
              change={stat.change}
            />
          ))}
        </div>

        {/* Two-column layout for main content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Projects (Left Column) */}
          <Card className="group h-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Active Projects</span>
                <div className="flex items-center space-x-4">
                  <Link to="/add_proj">
                    <button className="px-3 py-1 bg-purple-900/50 text-purple-300 rounded-lg text-sm hover:bg-purple-800/70 transition-all duration-300 flex items-center gap-1">
                      <Plus className="w-3 h-3" />
                      <span>Add Project</span>
                    </button>
                  </Link>
                  <span className="text-sm text-gray-400 group-hover:text-purple-400 transition-colors">
                    View all
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!client_id ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 border-4 border-gray-600 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-400">
                    Initializing your dashboard...
                  </p>
                </div>
              ) : loading ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 border-4 border-gray-600 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading your projects...</p>
                </div>
              ) : error ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 rounded-full bg-red-900/30 mx-auto mb-4 flex items-center justify-center">
                    <BriefcaseIcon className="w-6 h-6 text-red-400" />
                  </div>
                  <p className="text-gray-400 mb-3">{error}</p>
                  <div className="flex justify-center gap-4">
                    <button
                      className="px-4 py-2 bg-purple-900/50 text-purple-300 rounded-lg hover:bg-purple-800/70 transition-all duration-300 text-sm"
                      onClick={() => window.location.reload()}
                    >
                      Try Again
                    </button>
                    <Link to="/add_proj">
                      <button className="px-4 py-2 bg-purple-900/50 text-purple-300 rounded-lg hover:bg-purple-800/70 transition-all duration-300 flex items-center gap-2 text-sm">
                        <Plus className="w-3 h-3" />
                        Add Project
                      </button>
                    </Link>
                  </div>
                </div>
              ) : dashboardData.activeProjects &&
                dashboardData.activeProjects.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {dashboardData.activeProjects.map((project) => (
                    <div
                      key={project.id}
                      className="p-3 bg-gray-700/30 rounded-lg flex justify-between items-center hover:bg-gray-700/50 transition-colors cursor-pointer group/item"
                    >
                      <div>
                        <h4 className="text-white font-medium group-hover/item:text-purple-200 transition-colors">
                          {project.title}
                        </h4>
                        <p className="text-sm text-gray-400">
                          Due in {project.deadline}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="px-2 py-1 rounded-full bg-purple-900/30 text-purple-400 text-xs">
                          {project.status}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-500 opacity-0 group-hover/item:opacity-100 group-hover/item:text-purple-400 transition-all" />
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-center mt-4">
                    <Link to="/add_proj">
                      <button className="px-4 py-2 bg-purple-900/50 text-purple-300 rounded-lg hover:bg-purple-800/70 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 flex items-center gap-2 text-sm">
                        <Plus className="w-3 h-3" />
                        Add new project
                      </button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-full bg-gray-800/70 mx-auto mb-4 flex items-center justify-center group-hover:bg-purple-900/30 transition-all duration-500 transform group-hover:scale-110">
                    <BriefcaseIcon className="w-6 h-6 text-gray-600 group-hover:text-purple-400 transition-colors" />
                  </div>
                  <p className="text-gray-400 mb-2">
                    No active projects at the moment
                  </p>
                  <p className="text-gray-500 text-sm mb-4">
                    Start a new project to showcase your creativity
                  </p>
                  <Link to="/add_proj">
                    <button className="px-4 py-2 bg-purple-900/50 text-purple-300 rounded-lg hover:bg-purple-800/70 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 flex items-center gap-2 mx-auto text-sm">
                      <Plus className="w-3 h-3" />
                      Create a new project
                    </button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Client Rewards (Right Column) */}
          <Card className="group h-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
                  Your Rewards
                </div>
                <span className="text-sm text-gray-400 group-hover:text-purple-400 transition-colors">
                  All rewards
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardData.clientRewards &&
              dashboardData.clientRewards.length > 0 ? (
                <div className="grid gap-4">
                  {dashboardData.clientRewards.map((reward, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-all duration-300 hover:shadow-md hover:shadow-purple-500/10 cursor-pointer group/reward"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center transition-all duration-500 group-hover/reward:scale-110 group-hover/reward:bg-purple-800/50 flex-shrink-0">
                          <span className="text-purple-400 transition-colors group-hover/reward:text-purple-300">
                            {renderIcon(reward.icon)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-medium group-hover/reward:text-purple-200 transition-colors">
                            {reward.name}
                          </h4>
                          <p className="text-sm text-gray-400">
                            {reward.description}
                          </p>
                          <div className="flex items-center mt-1">
                            <Clock className="w-3 h-3 text-gray-500 mr-1" />
                            <span className="text-xs text-gray-400">
                              Expires: {reward.expiry}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No rewards available yet</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Complete projects to earn exclusive rewards
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Client;
