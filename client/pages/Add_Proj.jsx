import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Upload,
  Calendar,
  DollarSign,
  Clock,
  Tag,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// Reusing the same card components from the dashboard
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

// Form input component
const FormInput = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  icon,
  className = "",
}) => (
  <div className="mb-6">
    <label className="block text-gray-300 mb-2 text-sm font-medium">
      {label}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full bg-gray-900/70 border border-gray-700 rounded-lg py-3 px-4 ${
          icon ? "pl-10" : ""
        } text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300 ${className}`}
      />
    </div>
  </div>
);

// TextArea component
const TextArea = ({ label, placeholder, value, onChange, rows = 4 }) => (
  <div className="mb-6">
    <label className="block text-gray-300 mb-2 text-sm font-medium">
      {label}
    </label>
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows={rows}
      className="w-full bg-gray-900/70 border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300"
    ></textarea>
  </div>
);

// Select component
const Select = ({ label, options, value, onChange, icon }) => (
  <div className="mb-6">
    <label className="block text-gray-300 mb-2 text-sm font-medium">
      {label}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      <select
        value={value}
        onChange={onChange}
        className={`w-full bg-gray-900/70 border border-gray-700 rounded-lg py-3 px-4 ${
          icon ? "pl-10" : ""
        } text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300 appearance-none`}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <svg
          className="w-4 h-4 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  </div>
);

const Add_Proj = () => {
  // Get client data from Redux
  const client_id = useSelector((state) => state.auth.user_id);
  const navigate = useNavigate();

  // State for form fields
  const [formData, setFormData] = useState({
    client_id: client_id || "",
    project_name: "",
    project_description: "",
    project_type: "design",
    project_budget: "",
    estimated_time: "",
    required_skills: "",
    deadline: "",
    project_status: "Open",
    experience_required: "",
    files: [],
  });

  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [matchedArtists, setMatchedArtists] = useState([]);
  const [projectId, setProjectId] = useState("");

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleFileChange = (e) => {
    const fileList = Array.from(e.target.files);
    setFormData({
      ...formData,
      files: [...formData.files, ...fileList],
    });
  };

  const removeFile = (index) => {
    const updatedFiles = [...formData.files];
    updatedFiles.splice(index, 1);
    setFormData({
      ...formData,
      files: updatedFiles,
    });
  };

  // Enhanced pushMatchedArtistsToProject function with better debugging and error handling

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage("");
  
    const payload = { 
      client_id: formData.client_id, 
      project_name: formData.project_name, 
      project_description: formData.project_description, 
      project_type: formData.project_type, 
      project_budget: formData.project_budget, 
      estimated_time: formData.estimated_time, 
      project_status: formData.project_status, 
      required_skills: formData.required_skills, 
      deadline: formData.deadline, 
      experience_required: formData.experience_required || "Intermediate"
    };
  
    try {
      console.log("Creating project with payload:", payload);
      const response = await fetch("http://localhost:8080/api/client/add_project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
      console.log("Project creation response:", data);
  
      if (!response.ok || !data.project_id) {
        throw new Error(data.message || "Failed to create project");
      }
  
      setProjectId(data.project_id);
      console.log("Project ID received:", data.project_id);
  
      const matchedArtistsList = await matchArtists(data.project_id);
  
      if (matchedArtistsList.length > 0) {
        console.log("Pushing matched artists for project:", data.project_id);
        await pushMatchedArtistsToProject(data.project_id, matchedArtistsList);
      }
  
      setSubmitStatus("success");
      // clear form after success
      setTimeout(() => {
        setFormData({
          client_id: client_id || "",
          project_name: "",
          project_description: "",
          project_type: "design",
          project_budget: "",
          estimated_time: "",
          required_skills: "",
          deadline: "",
          project_status: "Open",
          experience_required: "",
          files: [],
        });

        navigate("/client_dashboard");
      }, 200);


    } catch (error) {
      console.error("Project creation error:", error);
      setErrorMessage(error.message);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const matchArtists = async (project_id) => {
    console.log("Matching artists for project ID:", project_id);
    const url = `http://localhost:5050/match_artists?client_id=${client_id}&project_id=${project_id}`;
  
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
  
      const data = await response.json();
      console.log("Raw matchArtists response:", data);
  
      if (response.ok && data && Array.isArray(data.artist_ids)) {
        console.log("Matched artists:", data.artist_ids);
        return data.artist_ids;
      } else {
        console.error("Unexpected response format from matchArtists:", data);
        return [];
      }
    } catch (error) {
      console.error("Error matching artists:", error);
      setErrorMessage("Error matching artists. Please try again.");
      return [];
    }
  };

  const pushMatchedArtistsToProject = async (project_id, matchedArtistsList) => {
    console.log("Function Called with:", { project_id, matchedArtistsList });
  
    if (!project_id) {
      console.error("Project ID is undefined in pushMatchedArtistsToProject.");
      return;
    }
  
    if (!matchedArtistsList || matchedArtistsList.length === 0) {
      console.log("No matched artists found to push.");
      return;
    }
  
    console.log("Pushing matched artists to project:", project_id, matchedArtistsList);
  
    const pushPromises = matchedArtistsList.map((artist_id) => {
      if (!artist_id) {
        console.error("Skipping undefined artist_id.");
        return Promise.resolve();
      }
  
      const requestBody = {
        artistId: artist_id,  // Use dynamic value
        projectId: project_id, // Use dynamic value
      };
  
      console.log("Sending Request:", requestBody);
  
      return fetch("http://localhost:8080/api/artist/notify_matchArtist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })
        .then((res) => res.json())
        .then((data) => console.log("Response:", data))
        .catch((error) => console.error("Fetch error:", error));
    });
  
    await Promise.all(pushPromises);
  };

  const categoryOptions = [
    { value: "design", label: "Design" },
    { value: "development", label: "Development" },
    { value: "marketing", label: "Marketing" },
    { value: "writing", label: "Writing" },
    { value: "video", label: "Video Production" },
    { value: "web", label: "Web" },
  ];

  // Conditional rendering for login check
  if (!client_id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black">
        <p className="text-white text-lg font-medium">
          You need to be logged in to create a project.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black p-6">
      <div className="max-w-4xl mx-auto space-y-6 mt-15">
        {/* Header Section */}
        <div className="flex items-center mb-6">
          <button onClick={() => navigate("/client_dashboard")} className="p-2 mr-4 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors group">
            <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          </button>
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-pink-100">
              Create New Project
            </h1>
            <p className="text-gray-400">Fill in the details to get started</p>
          </div>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Project title */}
              <FormInput
                label="Project Title"
                placeholder="Enter a clear title for your project"
                value={formData.project_name}
                onChange={(e) => handleChange("project_name", e.target.value)}
              />

              {/* Project description */}
              <TextArea
                label="Project Description"
                placeholder="Describe your project, goals, and requirements"
                value={formData.project_description}
                onChange={(e) =>
                  handleChange("project_description", e.target.value)
                }
                rows={6}
              />

              {/* Two column layout for some fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Project category/type */}
                <Select
                  label="Project Type"
                  options={categoryOptions}
                  value={formData.project_type}
                  onChange={(e) => handleChange("project_type", e.target.value)}
                  icon={<Tag className="w-4 h-4" />}
                />

                {/* Deadline */}
                <FormInput
                  label="Deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => handleChange("deadline", e.target.value)}
                  icon={<Calendar className="w-4 h-4" />}
                />
              </div>

              {/* Another two column layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Budget */}
                <FormInput
                  label="Budget"
                  placeholder="$5000"
                  value={formData.project_budget}
                  onChange={(e) =>
                    handleChange("project_budget", e.target.value)
                  }
                  icon={<DollarSign className="w-4 h-4" />}
                />

                {/* Time estimate */}
                <FormInput
                  label="Estimated Timeline"
                  placeholder="e.g., 5 days"
                  value={formData.estimated_time}
                  onChange={(e) =>
                    handleChange("estimated_time", e.target.value)
                  }
                  icon={<Clock className="w-4 h-4" />}
                />
              </div>

              {/* Skills required */}
              <FormInput
                label="Required Skills"
                placeholder="Enter skills separated by commas (e.g., Figma, Adobe Illustrator, MERN)"
                value={formData.required_skills}
                onChange={(e) =>
                  handleChange("required_skills", e.target.value)
                }
              />
            </CardContent>
          </Card>

          {/* File Upload Card */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Project Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-purple-500/50 transition-colors">
                <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-300 mb-2">
                  Drag and drop files here or click to browse
                </p>
                <p className="text-gray-500 text-sm mb-4">
                  Upload any reference images, documents, or assets
                </p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="px-6 py-3 bg-purple-900/50 text-purple-300 rounded-lg hover:bg-purple-800/70 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer inline-block"
                >
                  Select Files
                </label>
              </div>

              {/* File list */}
              {formData.files.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-gray-300 text-sm font-medium mb-3">
                    Uploaded Files ({formData.files.length})
                  </h4>
                  <div className="space-y-2">
                    {formData.files.map((file, index) => (
                      <div
                        key={index}
                        className="bg-gray-900/70 rounded-lg p-3 flex justify-between items-center"
                      >
                        <div className="flex items-center">
                          <div className="bg-purple-900/30 rounded p-2 mr-3">
                            <Upload className="w-4 h-4 text-purple-400" />
                          </div>
                          <div>
                            <p className="text-white text-sm">{file.name}</p>
                            <p className="text-gray-500 text-xs">
                              {(file.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Section */}
          <div className="mt-8 flex items-center justify-center">
            <button
              type="submit"
              className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Create Project"
              )}
            </button>
          </div>

          {/* Success/Error Message */}
          {submitStatus && (
            <div
              className={`mt-4 p-4 rounded-lg ${
                submitStatus === "success"
                  ? "bg-green-900/30 text-green-300"
                  : "bg-red-900/30 text-red-300"
              } flex items-center`}
            >
              {submitStatus === "success" ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Project created successfully! Redirecting to dashboard...
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 mr-2" />
                  {errorMessage ||
                    "There was an error creating your project. Please try again."}
                </>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Add_Proj;
