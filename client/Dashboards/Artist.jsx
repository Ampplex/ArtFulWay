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
} from "lucide-react";
import { useSelector } from "react-redux";

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
  const artist_id = useSelector((state) => state.auth.user_id);
  const isRehydrated = useSelector((state) => state._persist?.rehydrated);
  const [matchedProjects, setMatchedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log("Current artist_id:", artist_id);
  console.log("Is rehydrated:", isRehydrated);
  console.log("Loading state:", loading);

  const getMatchedProjects = async () => {
    try {
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

  useEffect(() => {
    // Only fetch if we're rehydrated AND have an artist_id
    if (isRehydrated && artist_id) {
      getMatchedProjects();
    } else if (isRehydrated) {
      // If rehydrated but no artist_id, stop loading
      setLoading(false);
    }
  }, [isRehydrated, artist_id]);

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

  if (!artist_id) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Artist not authenticated</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black p-6">
      <div className="max-w-7xl mx-auto space-y-6">
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
        <div className="grid grid-cols-1 lg:grid-cols-2">
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
                {matchedProjects.map((project) => (
                  <div
                    key={project._id}
                    className="p-4 bg-gray-700/30 rounded-lg"
                    onClick={() => console.log("Project clicked:", project._id)}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-white font-medium">
                        {project.project_title}
                      </h4>
                      <span className="text-purple-400 font-medium">
                        {project.project_status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">
                      Client name {project.client_name}
                    </p>
                  </div>
                ))}
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
