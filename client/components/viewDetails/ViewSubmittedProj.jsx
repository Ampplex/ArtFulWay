import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FileText, Link as LinkIcon, Clock, DollarSign, Calendar, Code, Award } from "lucide-react";

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-white mt-4 text-lg font-medium">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!projectDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="bg-gray-800 rounded-xl p-8 shadow-xl max-w-md mx-auto">
          <h2 className="text-xl font-bold text-white mb-2">Project Not Found</h2>
          <p className="text-gray-300">Unable to load project details. Please check the project ID and try again.</p>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12 px-4">
      <div className="max-w-5xl mx-auto mt-20">
        {/* Header Section with animated underline */}
        <div className="text-center mb-12 relative">
          <h1 className="text-4xl font-bold text-white mb-3 inline-block">
            {project_title}
            <div className="h-1 w-full bg-gradient-to-r from-purple-400 to-pink-500 mt-1 rounded-full"></div>
          </h1>
          <p className="text-gray-300 mt-4 max-w-2xl mx-auto leading-relaxed text-lg">{description}</p>
        </div>

        {/* Project Details Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm shadow-xl border border-gray-700 hover:border-purple-500 transition-all duration-300">
            <div className="flex items-start mb-4">
              <Calendar className="w-6 h-6 text-purple-400 mr-3" />
              <h3 className="text-xl font-semibold text-white">Timeline</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-gray-400 text-sm">Deadline</p>
                <p className="text-white font-medium">{formatDate(deadline)}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Estimated Time</p>
                <p className="text-white font-medium">{estimated_time || "Not specified"}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm shadow-xl border border-gray-700 hover:border-purple-500 transition-all duration-300">
            <div className="flex items-start mb-4">
              <DollarSign className="w-6 h-6 text-purple-400 mr-3" />
              <h3 className="text-xl font-semibold text-white">Budget</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-gray-400 text-sm">Project Budget</p>
                <p className="text-white font-semibold text-2xl">${project_budget}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm shadow-xl border border-gray-700 hover:border-purple-500 transition-all duration-300">
            <div className="flex items-start mb-4">
              <Code className="w-6 h-6 text-purple-400 mr-3" />
              <h3 className="text-xl font-semibold text-white">Skills</h3>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {required_skills ? 
                required_skills.split(',').map((skill, index) => (
                  <span key={index} className="bg-purple-900 bg-opacity-60 text-purple-200 px-3 py-1 rounded-full text-sm">
                    {skill.trim()}
                  </span>
                )) : 
                <span className="text-gray-400">No specific skills required</span>
              }
            </div>
          </div>
        </div>

        {/* Submission Details */}
        <div className="bg-gray-800 bg-opacity-50 rounded-xl p-8 backdrop-blur-sm shadow-xl border border-gray-700 mb-8">
          <div className="flex items-center mb-6">
            <Award className="w-6 h-6 text-purple-400 mr-3" />
            <h2 className="text-2xl font-semibold text-white">Submission Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-purple-300 mb-2">Submission Notes</h3>
                <p className="text-gray-300 leading-relaxed">{submission_notes || "No notes provided"}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-purple-300 mb-2">Challenges Faced</h3>
                <p className="text-gray-300 leading-relaxed">{challenges_faced || "No challenges described"}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-purple-300 mb-2">Improvements Made</h3>
                <p className="text-gray-300 leading-relaxed">{improvements_made || "No improvements described"}</p>
              </div>
              
              {demo_link && (
                <div>
                  <h3 className="text-lg font-medium text-purple-300 mb-2">Demo Link</h3>
                  <a
                    href={demo_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors duration-200"
                  >
                    <LinkIcon className="w-4 h-4 mr-2" />
                    View Demo
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submitted Files */}
        {submitted_files && submitted_files.length > 0 && (
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-8 backdrop-blur-sm shadow-xl border border-gray-700">
            <div className="flex items-center mb-6">
              <FileText className="w-6 h-6 text-purple-400 mr-3" />
              <h2 className="text-2xl font-semibold text-white">Submitted Files</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {submitted_files.map((file, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-700 bg-opacity-30 rounded-lg flex items-center justify-between hover:bg-opacity-50 transition-all duration-200 border border-gray-700 hover:border-purple-500"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 bg-purple-900 bg-opacity-50 rounded-lg">
                      <FileText className="w-5 h-5 text-purple-300" />
                    </div>
                    <p className="text-gray-200 truncate">{file.name}</p>
                  </div>
                  {fileUrls[file.key] ? (
                    <a
                      href={fileUrls[file.key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-purple-400 hover:text-purple-300 transition px-3 py-1 bg-purple-900 bg-opacity-20 rounded-lg"
                    >
                      <span>View</span>
                      <LinkIcon className="w-4 h-4" />
                    </a>
                  ) : (
                    <span className="text-gray-400 flex items-center gap-2">
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