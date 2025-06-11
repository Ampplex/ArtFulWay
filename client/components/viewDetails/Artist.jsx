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
  Briefcase,
  Zap,
  Trophy,
  TrendingUp,
  Wallet,
} from "lucide-react";

// Reusable components with light theme
const Card = ({ children, className = "" }) => (
  <div
    className={`rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:border-purple-300 hover:shadow-md ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({ children }) => <div className="p-6 pb-4">{children}</div>;

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 pt-2 ${className}`}>{children}</div>
);

const Artist = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { project_id: urlProjectId } = useParams();
  const { project_id: stateProjectId, project: projectData } =
    location.state || {};
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
    createdAt: new Date().toISOString(),
  };

  const handleSubmitProject = () => {
    navigate("/submit_proj", { state: { project_id } });
  };

  const handleBackToDashboard = () => {
    navigate("/artist_dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-8 mt-20">
          <button
            onClick={handleBackToDashboard}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-2">
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                project.project_status === "In Progress"
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : project.project_status === "Completed"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-purple-50 text-purple-700 border border-purple-200"
              }`}
            >
              {project.project_status}
            </span>
          </div>
        </div>

        {/* Project Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {project.project_title}
          </h1>
          <p className="text-gray-500 text-lg">Project ID: {project._id}</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Project Details (Left Column) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-purple-600" />
                  </div>
                  Project Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-gray-500 text-sm font-medium mb-2 uppercase tracking-wide">Description</h4>
                    <p className="text-gray-900 leading-relaxed">
                      {project.description || "No description provided"}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-gray-500 text-sm font-medium mb-2 uppercase tracking-wide">Project Type</h4>
                    <p className="text-gray-900 font-medium">
                      {project.project_type || "Not specified"}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-gray-500 text-sm font-medium mb-2 uppercase tracking-wide">
                      Required Skills
                    </h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.required_skills ? (
                        project.required_skills
                          .split(",")
                          .map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded-full border border-purple-200 font-medium"
                            >
                              {skill.trim()}
                            </span>
                          ))
                      ) : (
                        <span className="text-gray-400 text-sm">
                          No specific skills required
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-purple-600" />
                  </div>
                  Project Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="text-gray-900 font-semibold">Deadline</h4>
                        <p className="text-gray-500">
                          {project.deadline
                            ? new Date(project.deadline).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )
                            : "Not specified"}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        new Date(project.deadline) < new Date()
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : "bg-green-50 text-green-700 border border-green-200"
                      }`}
                    >
                      {new Date(project.deadline) < new Date()
                        ? "Overdue"
                        : "Active"}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-gray-900 font-medium">Estimated Time</h4>
                        <p className="text-gray-500 text-sm">
                          {project.estimated_time || "Not specified"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="text-gray-900 font-medium">Budget</h4>
                        <p className="text-gray-500 text-sm">
                          ₹{project.project_budget || "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-purple-600" />
                  </div>
                  Project Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-gray-500 text-sm font-medium mb-2 uppercase tracking-wide">
                      Experience Required
                    </h4>
                    <p className="text-gray-900">
                      {project.experience_required || "Not specified"}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-gray-500 text-sm font-medium mb-2 uppercase tracking-wide">
                      Additional Notes
                    </h4>
                    <p className="text-gray-900 leading-relaxed">
                      {project.additional_notes ||
                        "No additional notes provided"}
                    </p>
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
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <User className="w-4 h-4 text-purple-600" />
                  </div>
                  Client Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <User className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="text-gray-900 font-semibold">
                        {project.client_name || "Anonymous Client"}
                      </h4>
                      <p className="text-gray-500 text-sm">
                        Client ID: {project.client_id || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Activity className="w-4 h-4 text-purple-600" />
                  </div>
                  Project Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">Status</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        project.project_status === "In Progress"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : project.project_status === "Completed"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-purple-50 text-purple-700 border border-purple-200"
                      }`}
                    >
                      {project.project_status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">Payment Status</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        project.payment_status === "Paid"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : project.payment_status === "Pending"
                          ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {project.payment_status || "Not specified"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">Created On</span>
                    <span className="text-gray-900 text-sm font-medium">
                      {project.createdAt
                        ? new Date(project.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )
                        : "Unknown"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => navigate("/artist_assistant", {state: {project_description: project.description}})}
                className="w-full py-4 text-white rounded-xl bg-purple-600 hover:bg-purple-700 font-semibold transition-all duration-200 flex items-center justify-center gap-3 shadow-md hover:shadow-lg"
              >
                <ChevronRight className="w-5 h-5" />
                Start Project
              </button>

              <button
                onClick={handleSubmitProject}
                className="w-full py-4 bg-white border-2 border-gray-200 hover:border-purple-300 text-gray-700 hover:text-purple-700 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 hover:shadow-md"
              >
                <FileText className="w-5 h-5" />
                Submit Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Artist;