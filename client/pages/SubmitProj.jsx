import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Upload,
  Clock,
  AlertCircle,
  CheckCircle,
  FileText,
  ExternalLink,
  Send,
  User,
} from "lucide-react";

// Card components matching the ArtfulWay theme
const Card = ({ children, className = "" }) => (
  <div
    className={`rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md ${className}`}
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
    <label className="block text-gray-700 mb-2 text-sm font-medium">
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
        className={`w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 ${
          icon ? "pl-10" : ""
        } text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${className}`}
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
    <label className="block text-gray-700 mb-2 text-sm font-medium">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows={rows}
      required={required}
      className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
    ></textarea>
  </div>
);

// Status badge component
const StatusBadge = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'Accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Active':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusStyles()}`}>
      {status}
    </span>
  );
};

const SubmitProj = () => {
  // Mock data for demonstration
  const [artist_id, setArtistId] = useState("demo-artist-id");
  const [isRehydrated, setIsRehydrated] = useState(true);
  const project_id = "67d449a0216b280c5f7bb850";
  
  // Mock project data
  const projectData = {
    title: "Upwork 2.0",
    description: "Create this realworld game",
    client: "Amplex",
    status: "Accepted",
    deadline: "June 10, 2026"
  };

  // State for form fields
  const [formData, setFormData] = useState({
    project_id: project_id || "",
    submission_notes: "",
    completion_time: "",
    challenges_faced: "",
    improvements_made: "",
    links: "",
    files: [],
  });

  // State for form validation
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!formData.submission_notes.trim()) {
      errors.submission_notes = "Submission notes are required";
    }
    if (!formData.completion_time.trim()) {
      errors.completion_time = "Completion time is required";
    }
    if (!formData.challenges_faced.trim()) {
      errors.challenges_faced = "Challenges faced are required";
    }
    if (!formData.improvements_made.trim()) {
      errors.improvements_made = "Improvements made are required";
    }
    if (!formData.links.trim()) {
      errors.links = "Demo link is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

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

    // Validate form
    if (!validateForm()) {
      setErrorMessage("Please fill in all required fields");
      setSubmitStatus("error");
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus("success");
      
      // Clear form and redirect after success
      setTimeout(() => {
        console.log("Redirecting to dashboard...");
      }, 2000);

    } catch (error) {
      console.error("Project submission error:", error);
      setErrorMessage(error.message);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    console.log("Going back to dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50">


      <div className="max-w-4xl mx-auto px-6 py-8 pt-30">
        {/* Header Section */}
        <div className="flex items-center mb-8">
          <button 
            onClick={goBack} 
            className="p-2 mr-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
          </button>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {projectData.title}
                </h1>
                <p className="text-gray-600">
                  Project ID: {project_id}
                </p>
              </div>
              <StatusBadge status={projectData.status} />
            </div>
          </div>
        </div>

        {/* Project Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-4 pt-5">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Project Overview</h4>
                  <p className="text-sm text-gray-600">{projectData.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 pt-5">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <User className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Client</h4>
                  <p className="text-sm text-gray-600">{projectData.client}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 pt-5">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Deadline</h4>
                  <p className="text-sm text-gray-600">{projectData.deadline}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submission Form */}
        <div className="space-y-6">
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
                required={true}
              />

              {/* Improvements made */}
              <TextArea
                label="Improvements Made"
                placeholder="Describe any improvements or enhancements you made to the original requirements"
                value={formData.improvements_made}
                onChange={(e) => handleChange("improvements_made", e.target.value)}
                rows={4}
                required={true}
              />

              {/* External links */}
              <FormInput
                label="External Links"
                placeholder="e.g., GitHub repository, live demo, documentation"
                value={formData.links}
                onChange={(e) => handleChange("links", e.target.value)}
                icon={<ExternalLink className="w-4 h-4" />}
                required={true}
              />
            </CardContent>
          </Card>

          {/* File Upload Card */}
          <Card>
            <CardHeader>
              <CardTitle>Project Files</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-700 mb-2">
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
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300 cursor-pointer inline-block"
                >
                  Select Files
                </label>
              </div>

              {/* File list */}
              {formData.files.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-gray-700 text-sm font-medium mb-3">
                    Uploaded Files ({formData.files.length})
                  </h4>
                  <div className="space-y-2">
                    {formData.files.map((file, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-lg p-3 flex justify-between items-center border border-gray-200"
                      >
                        <div className="flex items-center">
                          <div className="bg-purple-100 rounded p-2 mr-3">
                            <FileText className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-gray-900 text-sm font-medium">{file.name}</p>
                            <p className="text-gray-500 text-xs">
                              {(file.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
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
          <div className="flex items-center justify-center pt-4">
            <button
              type="button"
              onClick={handleSubmit}
              className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300 flex items-center shadow-sm hover:shadow-md"
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
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
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
        </div>
      </div>
    </div>
  );
};

export default SubmitProj;