import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Upload,
  Clock,
  AlertCircle,
  CheckCircle,
  FileText,
  Link as LinkIcon,
  Send,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

// Reusing the same card components from other pages
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
  required = false,
}) => (
  <div className="mb-6">
    <label className="block text-gray-300 mb-2 text-sm font-medium">
      {label} {required && <span className="text-red-500">*</span>}
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
        required={required}
        className={`w-full bg-gray-900/70 border border-gray-700 rounded-lg py-3 px-4 ${
          icon ? "pl-10" : ""
        } text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300 ${className}`}
      />
    </div>
  </div>
);

// TextArea component
const TextArea = ({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  rows = 4,
  required = false 
}) => (
  <div className="mb-6">
    <label className="block text-gray-300 mb-2 text-sm font-medium">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows={rows}
      required={required}
      className="w-full bg-gray-900/70 border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300"
    ></textarea>
  </div>
);

const SubmitProj = () => {
  // Get artist data from Redux
  const check_artist_id = useSelector((state) => state.auth.user_id);
  const [artist_id, setArtistId] = useState(null);
  const isRehydrated = useSelector((state) => state._persist?.rehydrated);
  const navigate = useNavigate();
  const location = useLocation();
  const { project_id } = location.state || {};

  // Add debug logging for project ID
  useEffect(() => {
    // console.log('Project ID State:', {
    //   project_id,
    //   locationState: location.state,
    //   pathname: location.pathname
    // });
    console.log('Project ID:', project_id);
    console.log('Artist ID: ',artist_id)
  }, [project_id, location]);

  // Redirect if no project ID
  useEffect(() => {
    if (isRehydrated && !project_id) {
      console.log('No project ID found, redirecting to dashboard');
      navigate('/artist_dashboard', { 
        state: { 
          error: 'Please select a project to submit' 
        }
      });
    }
  }, [isRehydrated, project_id, navigate]);

  useEffect(() => {
    const initializeArtistId = () => {
      // First try to get ID from Redux
      if (check_artist_id) {
        console.log('Setting artist_id from Redux:', check_artist_id);
        setArtistId(check_artist_id);
        return;
      }

      // Then try from location state
      if (location.state?.user_id) {
        console.log('Setting artist_id from location state:', location.state.user_id);
        setArtistId(location.state.user_id);
        return;
      }

      // Finally, try to get from token
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const tokenUserId = decoded.id;
          console.log('Setting artist_id from token:', tokenUserId);
          setArtistId(tokenUserId);
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }
    };

    if (isRehydrated) {
      initializeArtistId();
    }
  }, [isRehydrated, check_artist_id, location.state, project_id, navigate]);

  // State for form fields
  const [formData, setFormData] = useState({
    project_id: project_id || "",
    submission_notes: "",
    completion_time: "",
    challenges_faced: "",
    improvements_made: "",
    files: [],
    links: "",
  });

  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage("");

    // Enhanced project ID validation
    if (!project_id) {
      setErrorMessage("Project ID is missing. Please select a project to submit.");
      setSubmitStatus("error");
      setIsSubmitting(false);
      navigate('/artist_dashboard', { 
        state: { 
          error: 'Please select a project to submit' 
        }
      });
      return;
    }

    if (!artist_id) {
      setErrorMessage("Artist ID is missing. Please log in again.");
      setSubmitStatus("error");
      setIsSubmitting(false);
      return;
    }

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("project_id", project_id);
      formDataToSend.append("artist_id", artist_id);
      formDataToSend.append("submission_notes", formData.submission_notes);
      formDataToSend.append("completion_time", formData.completion_time);
      formDataToSend.append("challenges_faced", formData.challenges_faced);
      formDataToSend.append("improvements_made", formData.improvements_made);
      formDataToSend.append("links", formData.links);

      // Log form data before sending
      console.log("Sending form data:", {
        project_id,
        artist_id,
        submission_notes: formData.submission_notes,
        completion_time: formData.completion_time,
        challenges_faced: formData.challenges_faced,
        improvements_made: formData.improvements_made,
        links: formData.links,
        files: formData.files.length
      });

      // Append each file
      formData.files.forEach((file) => {
        formDataToSend.append("files", file);
      });

      const response = await fetch("http://localhost:8080/api/artist/submitProject", {
        method: "POST",
        body: formDataToSend,
      });

      // Log the raw response
      console.log("Raw response:", response);

      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit project");
      }

      setSubmitStatus("success");
      
      // Clear form and redirect after success
      setTimeout(() => {
        navigate("/artist_dashboard");
      }, 2000);

    } catch (error) {
      console.error("Project submission error:", error);
      setErrorMessage(error.message);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state while waiting for rehydration or initial auth check
  if (!isRehydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black">
        <p className="text-white text-lg font-medium">
          Loading...
        </p>
      </div>
    );
  }

  // Check for authentication using multiple sources
  const token = localStorage.getItem('token');
  const isAuthenticated = artist_id || check_artist_id || location.state?.user_id || token;

  if (!isAuthenticated) {
    console.log('Not authenticated:', { 
      artist_id, 
      check_artist_id, 
      user_id: location.state?.user_id, 
      token,
      isRehydrated 
    });
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="text-center">
          <p className="text-white text-lg font-medium mb-4">
            You need to be logged in to submit a project.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // No project ID provided - Enhanced UI
  if (!project_id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <p className="text-white text-lg font-medium mb-4">
            No project selected for submission.
          </p>
          <p className="text-gray-400 mb-6">
            Please select a project from your dashboard to submit.
          </p>
          <button
            onClick={() => navigate('/artist_dashboard')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black p-6">
      <div className="max-w-4xl mx-auto space-y-6 mt-15">
        {/* Header Section */}
        <div className="flex items-center mb-6">
          <button onClick={() => navigate("/artist_dashboard")} className="p-2 mr-4 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors group">
            <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          </button>
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-pink-100">
              Submit Project
            </h1>
            <p className="text-gray-400">
              Complete the form below to submit your project
            </p>
          </div>
        </div>

        {/* Submission Form Card */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Submission Details</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Submission notes */}
              <TextArea
                label="Submission Notes"
                placeholder="Describe your work, approach, and any important details about your submission"
                value={formData.submission_notes}
                onChange={(e) => handleChange("submission_notes", e.target.value)}
                rows={6}
                required={true}
              />

              {/* Completion time */}
              <FormInput
                label="Actual Completion Time"
                placeholder="e.g., 5 days, 2 weeks"
                value={formData.completion_time}
                onChange={(e) => handleChange("completion_time", e.target.value)}
                icon={<Clock className="w-4 h-4" />}
                required={true}
              />

              {/* Challenges faced */}
              <TextArea
                label="Challenges Faced"
                placeholder="Describe any challenges you encountered during the project and how you overcame them"
                value={formData.challenges_faced}
                onChange={(e) => handleChange("challenges_faced", e.target.value)}
                rows={4}
              />

              {/* Improvements made */}
              <TextArea
                label="Improvements Made"
                placeholder="Describe any improvements or enhancements you made to the original requirements"
                value={formData.improvements_made}
                onChange={(e) => handleChange("improvements_made", e.target.value)}
                rows={4}
              />

              {/* External links */}
              <FormInput
                label="External Links"
                placeholder="e.g., GitHub repository, live demo, documentation"
                value={formData.links}
                onChange={(e) => handleChange("links", e.target.value)}
                icon={<LinkIcon className="w-4 h-4" />}
              />
            </CardContent>
          </Card>

          {/* File Upload Card */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Project Files</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-purple-500/50 transition-colors">
                <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-300 mb-2">
                  Drag and drop files here or click to browse
                </p>
                <p className="text-gray-500 text-sm mb-4">
                  Upload your completed project files, designs, or documentation
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
                            <FileText className="w-4 h-4 text-purple-400" />
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
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Project
                </>
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
                  Project submitted successfully! Redirecting to dashboard...
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 mr-2" />
                  {errorMessage ||
                    "There was an error submitting your project. Please try again."}
                </>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SubmitProj;
