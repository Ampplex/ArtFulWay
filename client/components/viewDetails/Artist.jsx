import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  DollarSign,
  User,
  FileText,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Activity,
  BriefcaseIcon,
  Zap,
  Trophy,
  TrendingUp,
  Wallet,
} from "lucide-react";

// Reusable components
const Card = ({ children, className = "" }) => (
  <div
    className={`rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm transition-all duration-300 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({ children }) => <div className="p-6 pb-2">{children}</div>;

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-lg font-semibold text-white ${className}`}>{children}</h3>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const Artist = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { project_id: urlProjectId } = useParams();
  const { project_id: stateProjectId, project: projectData } = location.state || {};
  const artist_id = useSelector((state) => state.auth.user_id);
  
  // Use project_id from URL params or from state
  const project_id = urlProjectId || stateProjectId;
  
  // Use project data from props or state
  const project = projectData || {
    _id: project_id,
    project_title: "Project Title",
    description: "Project description",
    project_type: "Project type",
    required_skills: "Required skills",
    deadline: new Date().toISOString(),
    estimated_time: "Estimated time",
    project_budget: 0,
    experience_required: "Experience required",
    additional_notes: "Additional notes",
    client_name: "Client name",
    client_id: "Client ID",
    business_name: "Business name",
    project_status: "Project status",
    payment_status: "Payment status",
    createdAt: new Date().toISOString()
  };

  const handleSubmitProject = () => {
    navigate("/submit_proj", { state: { project_id } });
  };

  const handleBackToDashboard = () => {
    navigate("/artist/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleBackToDashboard}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              project.project_status === "In Progress" 
                ? "bg-blue-900/30 text-blue-400" 
                : project.project_status === "Completed" 
                  ? "bg-green-900/30 text-green-400" 
                  : "bg-purple-900/30 text-purple-400"
            }`}>
              {project.project_status}
            </span>
          </div>
        </div>

        {/* Project Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{project.project_title}</h1>
          <p className="text-gray-400">Project ID: {project._id}</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Project Details (Left Column) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-400" />
                  Project Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-gray-400 text-sm mb-1">Description</h4>
                    <p className="text-white">{project.description || "No description provided"}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-gray-400 text-sm mb-1">Project Type</h4>
                    <p className="text-white">{project.project_type || "Not specified"}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-gray-400 text-sm mb-1">Required Skills</h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {project.required_skills ? (
                        project.required_skills.split(',').map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-purple-900/30 text-purple-200 text-xs rounded-full"
                          >
                            {skill.trim()}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 text-sm">No specific skills required</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  Project Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">Deadline</h4>
                        <p className="text-gray-400 text-sm">
                          {project.deadline 
                            ? new Date(project.deadline).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })
                            : "Not specified"}
                        </p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      new Date(project.deadline) < new Date() 
                        ? "bg-red-900/30 text-red-400" 
                        : "bg-green-900/30 text-green-400"
                    }`}>
                      {new Date(project.deadline) < new Date() ? "Overdue" : "Active"}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Estimated Time</h4>
                      <p className="text-gray-400 text-sm">{project.estimated_time || "Not specified"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Budget</h4>
                      <p className="text-gray-400 text-sm">₹{project.project_budget || "Not specified"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-purple-400" />
                  Project Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-gray-400 text-sm mb-1">Experience Required</h4>
                    <p className="text-white">{project.experience_required || "Not specified"}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-gray-400 text-sm mb-1">Additional Notes</h4>
                    <p className="text-white">{project.additional_notes || "No additional notes provided"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Client Info & Actions (Right Column) */}
          <div className="space-y-6">
            {/* Client Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-400" />
                  Client Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center">
                      <User className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{project.client_name || "Anonymous Client"}</h4>
                      <p className="text-gray-400 text-sm">Client ID: {project.client_id || "N/A"}</p>
                    </div>
                  </div>
                  
                </div>
              </CardContent>
            </Card>

            {/* Project Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-400" />
                  Project Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.project_status === "In Progress" 
                        ? "bg-blue-900/30 text-blue-400" 
                        : project.project_status === "Completed" 
                          ? "bg-green-900/30 text-green-400" 
                          : "bg-purple-900/30 text-purple-400"
                    }`}>
                      {project.project_status}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Payment Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.payment_status === "Paid" 
                        ? "bg-green-900/30 text-green-400" 
                        : project.payment_status === "Pending" 
                          ? "bg-yellow-900/30 text-yellow-400" 
                          : "bg-red-900/30 text-red-400"
                    }`}>
                      {project.payment_status || "Not specified"}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Created On</span>
                    <span className="text-white text-sm">
                      {project.createdAt 
                        ? new Date(project.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })
                        : "Unknown"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleSubmitProject}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Submit Project
              </button>
              
              <button
                className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <ChevronRight className="w-4 h-4" />
                Contact Client
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Artist;