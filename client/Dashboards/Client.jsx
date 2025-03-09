import React, { useState } from 'react';
import { 
  Wallet, 
  BriefcaseIcon, 
  Zap, 
  Trophy,
  Bell,
  Target,
  TrendingUp,
  Star,
  Clock,
  Award,
  Plus,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Components
const Card = ({ children, className = '' }) => (
  <div className={`rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm transition-all duration-300 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div className="p-6 pb-2">{children}</div>
);

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold text-white ${className}`}>{children}</h3>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const StatCard = ({ icon, title, value, change }) => (
  <Card className="overflow-hidden group">
    <CardContent>
      <div className="flex items-center justify-between">
        <div className="w-12 h-12 rounded-full bg-purple-900/30 flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:bg-purple-800/50">
          <span className="text-purple-400 transition-colors group-hover:text-purple-200">{icon}</span>
        </div>
        <span className={`text-sm font-medium px-2 py-1 rounded-full ${change.startsWith('+') ? 'text-green-300 bg-green-900/20' : 'text-red-300 bg-red-900/20'}`}>
          {change}
        </span>
      </div>
      <h3 className="text-2xl font-bold text-white mt-4 transition-all duration-300 group-hover:translate-x-1">{value}</h3>
      <p className="text-gray-400 text-sm">{title}</p>
    </CardContent>
  </Card>
);

const Client = () => {
  // Mock API data - in production, this would come from an actual API call
  const [dashboardData] = useState({
    user: {
      name: "Client",
      message: "Your creative journey continues"
    },
    stats: [
      { title: "Monthly Earnings", value: "$2,450", icon: "wallet", change: "+12.5%" },
      { title: "Completed Projects", value: "24", icon: "briefcase", change: "+3" },
      { title: "Success Rate", value: "94%", icon: "zap", change: "+2.1%" },
      { title: "Profile Views", value: "1.2K", icon: "trendingUp", change: "+15.3%" }
    ],
    activeProjects: [
      // { id: 1, title: "Brand Logo Design", deadline: "2 days", status: "In Progress", payment: "$500" },
      // { id: 2, title: "Social Media Assets", deadline: "5 days", status: "Review", payment: "$350" }
    ],
    matchedProjects: [
      { id: 1, title: "Website Illustration", budget: "$800", match: "95%" },
      { id: 2, title: "Video Thumbnails", budget: "$400", match: "88%" },
      { id: 3, title: "App Icon Design", budget: "$600", match: "82%" }
    ],
    clientRewards: [
      { name: "Loyalty Discount", description: "10% off next project", icon: "star", expiry: "30 days" },
      { name: "Priority Support", description: "24/7 dedicated assistance", icon: "zap", expiry: "Ongoing" },
      { name: "Premium Templates", description: "Access to exclusive templates", icon: "award", expiry: "60 days" }
    ]
  });

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
      award: <Award />
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
            <p className="text-gray-400 text-lg">{dashboardData.user.message}</p>
          </div>
          <button className="p-3 relative bg-gray-800 rounded-full hover:bg-gray-700 transition-colors duration-300 group">
            <Bell className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Projects */}
          <Card className="lg:col-span-2 group">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Active Projects</span>
                <span className="text-sm text-gray-400 group-hover:text-purple-400 transition-colors">View all</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardData.activeProjects && dashboardData.activeProjects.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.activeProjects.map(project => (
                    <div key={project.id} className="p-4 bg-gray-700/30 rounded-lg flex justify-between items-center hover:bg-gray-700/50 transition-colors cursor-pointer group">
                      <div>
                        <h4 className="text-white font-medium group-hover:text-purple-200 transition-colors">{project.title}</h4>
                        <p className="text-sm text-gray-400">Due in {project.deadline}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="px-3 py-1 rounded-full bg-purple-900/30 text-purple-400 text-sm">
                          {project.status}
                        </span>
                        <span className="text-green-400 font-medium">{project.payment}</span>
                        <ChevronRight className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 group-hover:text-purple-400 transition-all" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 px-6">
                  <div className="w-16 h-16 rounded-full bg-gray-800/70 mx-auto mb-4 flex items-center justify-center group-hover:bg-purple-900/30 transition-all duration-500 transform group-hover:scale-110">
                    <BriefcaseIcon className="w-8 h-8 text-gray-600 group-hover:text-purple-400 transition-colors" />
                  </div>
                  <p className="text-gray-400 text-lg mb-3">No active projects at the moment</p>
                  <p className="text-gray-500 text-sm mb-6">Start a new project to showcase your creativity</p>
                  <Link to="/add_proj">
                    <button className="px-6 py-3 bg-purple-900/50 text-purple-300 rounded-lg hover:bg-purple-800/70 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 flex items-center gap-2 mx-auto"
                    >
                      <Plus className="w-4 h-4" />
                      Create a new project
                    </button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI-Matched Projects */}
          <Card className="group">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
                <span className="group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-300 transition-all duration-500">AI-Matched Projects</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardData.matchedProjects && dashboardData.matchedProjects.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.matchedProjects.map(project => (
                    <div key={project.id} className="p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-all duration-300 cursor-pointer group/item">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-white font-medium group-hover/item:text-purple-200 transition-colors">{project.title}</h4>
                        <span className="text-purple-400 font-medium px-2 py-1 rounded-full bg-purple-900/30 group-hover/item:bg-purple-900/50 transition-colors">
                          {project.match}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-400">Budget: {project.budget}</p>
                        <ArrowRight className="w-4 h-4 text-gray-500 opacity-0 group-hover/item:opacity-100 group-hover/item:text-purple-400 transition-all" />
                      </div>
                    </div>
                  ))}
                  <button className="w-full py-2 mt-2 text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center justify-center gap-1">
                    <span>View more matches</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No matched projects yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Bottom Card - Client Rewards */}
        <div>
          <Card className="group">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
                  Your Rewards
                </div>
                <span className="text-sm text-gray-400 group-hover:text-purple-400 transition-colors">All rewards</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardData.clientRewards && dashboardData.clientRewards.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {dashboardData.clientRewards.map((reward, index) => (
                    <div key={index} className="p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-all duration-300 hover:shadow-md hover:shadow-purple-500/10 cursor-pointer group/reward">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-purple-900/30 flex items-center justify-center mb-3 transition-all duration-500 group-hover/reward:scale-110 group-hover/reward:bg-purple-800/50">
                          <span className="text-purple-400 transition-colors group-hover/reward:text-purple-300">
                            {renderIcon(reward.icon)}
                          </span>
                        </div>
                        <h4 className="text-white font-medium mb-1 group-hover/reward:text-purple-200 transition-colors">{reward.name}</h4>
                        <p className="text-sm text-gray-400 mb-3">{reward.description}</p>
                        <span className="text-xs text-gray-400 px-3 py-1 rounded-full bg-gray-800/70 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          Expires: {reward.expiry}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No rewards available yet</p>
                  <p className="text-sm text-gray-500 mt-2">Complete projects to earn exclusive rewards</p>
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