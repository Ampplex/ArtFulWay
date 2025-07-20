import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  Megaphone,
  Loader,
  AlertCircle,
  BriefcaseIcon,
  Sparkles,
  ArrowLeft,
  CheckCircle,
  X,
  Target,
  MessageSquare,
  Monitor,
  Edit3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Ad_Generation(props) {
  // Fetch client_id from Redux state
  const check_client_id = useSelector((state) => state.auth.user_id);
  const [client_id, setClientId] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user_id: locationUserId } = location.state || {};

  // State for projects and loading/error handling
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [adFormData, setAdFormData] = useState({
    platform: "",
    product: "",
    tone: "",
    goal: "",
    description: "",
  });

  // Add state for ad generation loading and success
  const [adGenLoading, setAdGenLoading] = useState(false);
  const [adGenError, setAdGenError] = useState(null);
  const [adGenSuccess, setAdGenSuccess] = useState(false);

  // Add state for generated ad output
  const [generatedAd, setGeneratedAd] = useState(null);

  // Platform options
  const platforms = [
    { value: "facebook", label: "Facebook", icon: "📘" },
    { value: "instagram", label: "Instagram", icon: "📸" },
    { value: "google", label: "Google Ads", icon: "🔍" },
    { value: "linkedin", label: "LinkedIn", icon: "💼" },
    { value: "twitter", label: "Twitter/X", icon: "🐦" },
    { value: "youtube", label: "YouTube", icon: "📺" },
  ];

  // Tone options
  const tones = [
    {
      value: "professional",
      label: "Professional",
      description: "Formal and business-oriented",
    },
    {
      value: "friendly",
      label: "Friendly",
      description: "Warm and approachable",
    },
    {
      value: "exciting",
      label: "Exciting",
      description: "Energetic and dynamic",
    },
    {
      value: "trustworthy",
      label: "Trustworthy",
      description: "Reliable and credible",
    },
    { value: "playful", label: "Playful", description: "Fun and creative" },
    {
      value: "urgent",
      label: "Urgent",
      description: "Time-sensitive and compelling",
    },
  ];

  // Goal options
  const goals = [
    {
      value: "awareness",
      label: "Brand Awareness",
      description: "Increase brand visibility",
    },
    {
      value: "leads",
      label: "Lead Generation",
      description: "Generate potential customers",
    },
    {
      value: "sales",
      label: "Drive Sales",
      description: "Convert to purchases",
    },
    {
      value: "engagement",
      label: "Engagement",
      description: "Increase interactions",
    },
    {
      value: "traffic",
      label: "Website Traffic",
      description: "Drive visitors to website",
    },
    {
      value: "app_install",
      label: "App Downloads",
      description: "Promote app installations",
    },
  ];

  // Set client ID from Redux or location state
  useEffect(() => {
    if (check_client_id) {
      setClientId(check_client_id);
    } else if (locationUserId) {
      setClientId(locationUserId);
    } else {
      console.warn(
        "Client ID not found in Redux or location state in Ad_Generation.jsx."
      );
      // Optionally redirect to login or show an error
    }
  }, [check_client_id, locationUserId]);

  // Fetch projects data when client ID is ready
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
          console.log("Projects fetched successfully for Ad Generation:", data);

          // Transform API data to match our component's expected format
          const formattedProjects = data.data.map((project) => ({
            id: project._id,
            title:
              project.project_title ||
              project.project_name ||
              "Untitled Project",
            description: project.description || "No description available",
            budget: project.project_budget,
            status: project.project_status,
            category: project.project_category || "General",
            deadline: project.deadline,
            // Add any other fields you might need for ad generation
            target_audience: project.target_audience || "General audience",
            key_features: project.key_features || [],
          }));

          setProjects(formattedProjects);
        } else {
          throw new Error(data.message || "Failed to fetch projects");
        }
      } catch (err) {
        console.error(
          "Error fetching projects for Ad Generation:",
          err.message || err
        );
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

  // Handle project selection for ad generation
  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    // Here you can add logic to generate ads for the selected project
    console.log("Selected project for ad generation:", project);
  };

  // Handle Generate Ads button click
  const handleGenerateAds = () => {
    if (selectedProject) {
      // Pre-fill form data with selected project info
      setAdFormData({
        platform: "",
        product: selectedProject.title,
        tone: "",
        goal: "",
        description: selectedProject.description,
      });
      setShowModal(true);
    }
  };

  // Handle form input changes
  const handleFormChange = (field, value) => {
    setAdFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle form submission
  const handleSubmitAdGeneration = async () => {
    // Validate required fields
    if (
      !adFormData.platform ||
      !adFormData.product ||
      !adFormData.tone ||
      !adFormData.goal
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setAdGenLoading(true);
    setAdGenError(null);
    setAdGenSuccess(false);

    try {
      const response = await fetch("http://127.0.0.1:8000/ad_generation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          platform: adFormData.platform,
          product: adFormData.product,
          tone: adFormData.tone,
          goal: adFormData.goal,
          description: adFormData.description,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate ad: ${response.status}`);
      }

      const data = await response.json();
      if (data.final_output) {
        setGeneratedAd(data.final_output);
      } else {
        setGeneratedAd(null);
      }
      setAdGenSuccess(true);
      setShowModal(false);
    } catch (err) {
      setAdGenError(err.message || "Failed to generate ad");
    } finally {
      setAdGenLoading(false);
    }
  };

  // Navigate back to dashboard
  const handleGoBack = () => {
    navigate(-1);
  };

  // Add a function to parse title and caption from final_output
  function parseAdOutput(final_output) {
    let title = "";
    let caption = "";
    if (final_output) {
      const titleMatch = final_output.match(/\*\*Title:\*\*[\n\r]*([^\n\r]*)/);
      if (titleMatch) {
        title = titleMatch[1].trim();
      }
      const captionMatch = final_output.match(/\*\*Caption:\*\*[\n\r]*([\s\S]*)/);
      if (captionMatch) {
        caption = captionMatch[1].trim();
      }
    }
    return { title, caption };
  }

  // Add a function to render caption with bold and larger text for **text**
  function renderCaptionWithBold(caption) {
    // Remove 'Reasoning for Changes:' and everything after
    let cleaned = caption.split(/Reasoning for Changes:/i)[0].trim();
    // Remove trailing '**' (and any whitespace/newlines before/after)
    cleaned = cleaned.replace(/(\*\*\s*)+$/g, '').trim();
    // Split by ** and alternate between normal and bold
    const parts = cleaned.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, idx) => {
      const match = part.match(/^\*\*([^*]+)\*\*$/);
      if (match) {
        return (
          <span key={idx} className="font-bold text-lg">{match[1]}</span>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  }

  // Loading state when client ID is not ready
  if (loading && !client_id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-gray-600 text-lg">
            Initializing Ad Generation Tool...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-80 h-80 bg-orange-100 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-100 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-red-100 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between pt-6 mt-10">
            <div className="flex items-center gap-6">
              <button
                onClick={handleGoBack}
                className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border border-gray-200"
              >
                <ArrowLeft className="w-6 h-6 text-gray-500" />
              </button>
              <div>
                <div className="inline-flex items-center px-3 py-1 bg-orange-50 text-orange-700 rounded-full border border-orange-200 mb-2">
                  <Megaphone className="w-4 h-4 mr-2" />
                  <span className="text-sm font-semibold">
                    AD GENERATION TOOL
                  </span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  Generate Ads for Your Projects
                </h1>
                <p className="text-gray-600 text-lg">
                  Select a project to create compelling advertisements
                </p>
              </div>
            </div>
          </div>

          {/* Error Notification */}
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

          {/* Main Content */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-lg">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                    <BriefcaseIcon className="w-5 h-5 text-orange-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Select Project
                  </h2>
                  {projects && projects.length > 0 && (
                    <div className="px-3 py-1 bg-orange-50 text-orange-700 text-sm rounded-full border border-orange-200 font-medium">
                      {projects.length} project
                      {projects.length !== 1 ? "s" : ""}
                    </div>
                  )}
                </div>

                {/* Generate Ads Button - Only show when project is selected */}
                {selectedProject && (
                  <button
                    onClick={handleGenerateAds}
                    className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <Sparkles className="w-4 h-4" />
                    Generate Ads
                  </button>
                )}
              </div>
            </div>

            <div className="p-6">
              {!client_id ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-500">Initializing...</p>
                </div>
              ) : loading ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading your projects...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 text-red-400 mx-auto mb-4">
                    <AlertCircle className="w-full h-full" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Unable to load projects
                  </h3>
                  <p className="text-gray-500 mb-4">{error}</p>
                  <button
                    className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                    onClick={() => window.location.reload()}
                  >
                    Try Again
                  </button>
                </div>
              ) : projects && projects.length > 0 ? (
                <div className="max-h-[600px] overflow-y-auto pr-3 space-y-4 scrollbar-thin scrollbar-thumb-orange-300 scrollbar-track-orange-50 hover:scrollbar-thumb-orange-400 scroll-smooth">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:scale-[1.02] hover:-translate-y-1 ${
                          selectedProject?.id === project.id
                            ? "border-orange-300 bg-gradient-to-br from-orange-50 to-orange-100 shadow-lg ring-2 ring-orange-200 ring-opacity-50"
                            : "border-gray-200 bg-white hover:border-orange-200 hover:shadow-orange-100"
                        }`}
                        onClick={() => handleProjectSelect(project)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-lg font-bold text-gray-900 flex-1 mr-2 leading-tight">
                            {project.title}
                          </h3>
                          {selectedProject?.id === project.id && (
                            <div className="flex-shrink-0 p-1 bg-orange-200 rounded-full">
                              <CheckCircle className="w-5 h-5 text-orange-700" />
                            </div>
                          )}
                        </div>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                          {project.description}
                        </p>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 font-medium">
                              Budget:
                            </span>
                            <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-lg">
                              ₹{project.budget}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 font-medium">
                              Status:
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                project.status === "completed"
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                  : project.status === "in_progress"
                                  ? "bg-blue-100 text-blue-800 border border-blue-200"
                                  : "bg-gray-100 text-gray-800 border border-gray-200"
                              }`}
                            >
                              {project.status.replace("_", " ").toUpperCase()}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 font-medium">
                              Category:
                            </span>
                            <span className="text-gray-800 font-semibold bg-gray-50 px-2 py-1 rounded-lg">
                              {project.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-orange-50 mx-auto mb-4 flex items-center justify-center">
                    <BriefcaseIcon className="w-8 h-8 text-orange-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No projects available
                  </h3>
                  <p className="text-gray-500 mb-6">
                    You need to have projects to generate advertisements
                  </p>
                  <button
                    onClick={handleGoBack}
                    className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                  </button>
                </div>
              )}
            </div>

            {/* Selected Project Info - Only show when project is selected */}
            {selectedProject && (
              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      Selected: {selectedProject.title}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Ready to create compelling advertisements
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ad Generation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-yellow-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Generate Advertisement
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Create compelling ads in seconds
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-180px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-5">
                  {/* Platform Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-orange-500" />
                      Platform <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {platforms.slice(0, 6).map((platform) => (
                        <button
                          key={platform.value}
                          onClick={() =>
                            handleFormChange("platform", platform.value)
                          }
                          className={`p-3 rounded-xl border transition-all duration-200 text-center hover:shadow-sm ${
                            adFormData.platform === platform.value
                              ? "border-orange-500 bg-orange-50 ring-1 ring-orange-200"
                              : "border-gray-200 hover:border-orange-300 hover:bg-orange-25"
                          }`}
                        >
                          <div className="text-lg mb-1">{platform.icon}</div>
                          <div className="text-xs font-medium text-gray-700">
                            {platform.label}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-orange-500" />
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={adFormData.product}
                      onChange={(e) =>
                        handleFormChange("product", e.target.value)
                      }
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                      placeholder="Enter product or service name"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-orange-500" />
                      Description
                    </label>
                    <textarea
                      value={adFormData.description}
                      onChange={(e) =>
                        handleFormChange("description", e.target.value)
                      }
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-none"
                      placeholder="Brief description of your product..."
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-5">
                  {/* Tone Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-orange-500" />
                      Tone <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {tones.map((tone) => (
                        <button
                          key={tone.value}
                          onClick={() => handleFormChange("tone", tone.value)}
                          className={`p-3 rounded-xl border transition-all duration-200 text-left hover:shadow-sm ${
                            adFormData.tone === tone.value
                              ? "border-orange-500 bg-orange-50 ring-1 ring-orange-200"
                              : "border-gray-200 hover:border-orange-300 hover:bg-orange-25"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium text-gray-900 text-sm">
                                {tone.label}
                              </span>
                              <p className="text-xs text-gray-500 mt-0.5 leading-tight">
                                {tone.description}
                              </p>
                            </div>
                            {adFormData.tone === tone.value && (
                              <CheckCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Goal Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Target className="w-4 h-4 text-orange-500" />
                      Campaign Goal <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {goals.map((goal) => (
                        <button
                          key={goal.value}
                          onClick={() => handleFormChange("goal", goal.value)}
                          className={`p-3 rounded-xl border transition-all duration-200 text-left hover:shadow-sm ${
                            adFormData.goal === goal.value
                              ? "border-orange-500 bg-orange-50 ring-1 ring-orange-200"
                              : "border-gray-200 hover:border-orange-300 hover:bg-orange-25"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <span className="font-medium text-gray-900 text-sm">
                                {goal.label}
                              </span>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {goal.description}
                              </p>
                            </div>
                            {adFormData.goal === goal.value && (
                              <CheckCircle className="w-4 h-4 text-orange-500 flex-shrink-0 ml-2" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center gap-3 p-6 border-t border-gray-100 bg-gray-50/50">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 hover:scale-[1.02]"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitAdGeneration}
                disabled={
                  !adFormData.platform ||
                  !adFormData.product ||
                  !adFormData.tone ||
                  !adFormData.goal ||
                  adGenLoading
                }
                className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {adGenLoading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                {adGenLoading ? "Generating..." : "Generate Ads"}
              </button>
            </div>
          </div>
        </div>
      )}
      {adGenError && (
        <div className="fixed top-4 right-4 max-w-md py-4 px-6 rounded-2xl shadow-2xl z-50 flex items-center gap-3 bg-white border-l-4 border-red-500 animate-slide-in">
          <div className="flex-shrink-0">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Error</p>
            <p className="text-gray-600 text-sm">{adGenError}</p>
          </div>
        </div>
      )}
      {adGenSuccess && (
        <div className="fixed top-4 right-4 max-w-md py-4 px-6 rounded-2xl shadow-2xl z-50 flex items-center gap-3 bg-white border-l-4 border-green-500 animate-slide-in">
          <div className="flex-shrink-0">
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Success</p>
            <p className="text-gray-600 text-sm">Ad generated successfully!</p>
          </div>
        </div>
      )}
      {generatedAd && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-auto p-8 relative">
            <button
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
              onClick={() => setGeneratedAd(null)}
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
            <div className="mb-6">
              <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Ad Generated!</h2>
              <p className="text-gray-600 mb-4">Copy and use your ad below.</p>
            </div>
            {(() => {
              const { title, caption } = parseAdOutput(generatedAd);
              return (
                <>
                  <div className="mb-4">
                    <span className="block text-lg font-semibold text-gray-800 mb-1">Title:</span>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 font-medium">{title}</div>
                  </div>
                  <div className="mb-4">
                    <span className="block text-lg font-semibold text-gray-800 mb-1">Caption:</span>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 whitespace-pre-line relative">
                      {renderCaptionWithBold(caption)}
                      <button
                        className="absolute top-2 right-2 px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded hover:bg-orange-200"
                        onClick={() => {
                          // Only copy the cleaned caption, without trailing '**'
                          let cleaned = caption.split(/Reasoning for Changes:/i)[0].trim();
                          cleaned = cleaned.replace(/(\*\*\s*)+$/g, '').trim();
                          navigator.clipboard.writeText(cleaned);
                        }}
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

export default Ad_Generation;
