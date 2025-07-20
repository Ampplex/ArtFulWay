import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FileText, ExternalLink, Clock, DollarSign, Calendar, Code, Award, ArrowLeft } from "lucide-react";

function ViewSubmittedProj() {
  const location = useLocation();
  const [projectDetails, setProjectDetails] = useState(null);
  const [fileUrls, setFileUrls] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch project details using the project ID from location state
    const fetchProjectDetails = async () => {
      const projectId = location.state?.project_id;
      if (!projectId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/api/artist/getProjectDetails/?project_id=${projectId}`);
        const data = await response.json();
        if (response.ok) {
          setProjectDetails(data);
          
          // If there are submitted files, fetch their URLs
          if (data.submitted_files && data.submitted_files.length > 0) {
            const urls = {};
            for (const file of data.submitted_files) {
              try {
                const urlResponse = await fetch(`http://localhost:8080/api/files/getSignedUrl?key=${file.key}`);
                const urlData = await urlResponse.json();
                if (urlResponse.ok && urlData.success) {
                  urls[file.key] = urlData.url;
                }
              } catch (err) {
                console.error(`Error fetching URL for ${file.key}:`, err);
              }
            }
            setFileUrls(urls);
          }
        } else {
          console.error("Failed to fetch project details:", data.message);
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [location.state]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 mt-4 text-lg font-medium">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!projectDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl p-8 shadow-lg max-w-md mx-auto border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Project Not Found</h2>
          <p className="text-gray-600">Unable to load project details. Please check the project ID and try again.</p>
        </div>
      </div>
    );
  }

  const {
    project_title,
    description,
    required_skills,
    deadline,
    project_budget,
    submission_notes,
    challenges_faced,
    improvements_made,
    demo_link,
    submitted_files,
    estimated_time,
  } = projectDetails;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-8">
          <button className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
          
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{project_title}</h1>
            <p className="text-gray-600 text-lg leading-relaxed">{description}</p>
          </div>
        </div>

        {/* Project Overview Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Timeline</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-gray-500 text-sm font-medium">Deadline</p>
                <p className="text-gray-900 font-medium">{formatDate(deadline)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">Estimated Time</p>
                <p className="text-gray-900 font-medium">{estimated_time || "Not specified"}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Budget</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-gray-500 text-sm font-medium">Project Budget</p>
                <p className="text-gray-900 font-bold text-2xl">₹{project_budget}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <Code className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {required_skills ? 
                required_skills.split(',').map((skill, index) => (
                  <span key={index} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                    {skill.trim()}
                  </span>
                )) : 
                <span className="text-gray-500">No specific skills required</span>
              }
            </div>
          </div>
        </div>

        {/* Submission Details */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-8">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
              <Award className="w-5 h-5 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">Submission Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Submission Notes</h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-700 leading-relaxed">{submission_notes || "No notes provided"}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Challenges Faced</h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-700 leading-relaxed">{challenges_faced || "No challenges described"}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Improvements Made</h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-700 leading-relaxed">{improvements_made || "No improvements described"}</p>
                </div>
              </div>
              
              {demo_link && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Demo Link</h3>
                  <a
                    href={demo_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors duration-200"
                  >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    View Demo
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submitted Files */}
        {submitted_files && submitted_files.length > 0 && (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                <FileText className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Submitted Files</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {submitted_files.map((file, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg flex items-center justify-between hover:bg-gray-100 transition-colors duration-200 border border-gray-200"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-gray-900 font-medium truncate">{file.name}</p>
                  </div>
                  {fileUrls[file.key] ? (
                    <a
                      href={fileUrls[file.key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition px-4 py-2 bg-purple-50 hover:bg-purple-100 rounded-lg font-medium"
                    >
                      <span>View</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <span className="text-gray-500 flex items-center gap-2">
                      Loading...
                      <div className="w-4 h-4 border-2 border-t-transparent border-purple-400 rounded-full animate-spin"></div>
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewSubmittedProj;