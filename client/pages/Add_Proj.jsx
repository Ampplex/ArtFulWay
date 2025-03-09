import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Upload, 
  Calendar, 
  DollarSign, 
  Clock, 
  Tag, 
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useSelector } from 'react-redux';

// Reusing the same card components from the dashboard
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

// Form input component
const FormInput = ({ label, type = "text", placeholder, value, onChange, icon, className = '' }) => (
  <div className="mb-6">
    <label className="block text-gray-300 mb-2 text-sm font-medium">{label}</label>
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
        className={`w-full bg-gray-900/70 border border-gray-700 rounded-lg py-3 px-4 ${icon ? 'pl-10' : ''} text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300 ${className}`}
      />
    </div>
  </div>
);

// TextArea component
const TextArea = ({ label, placeholder, value, onChange, rows = 4 }) => (
  <div className="mb-6">
    <label className="block text-gray-300 mb-2 text-sm font-medium">{label}</label>
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
    <label className="block text-gray-300 mb-2 text-sm font-medium">{label}</label>
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      <select
        value={value}
        onChange={onChange}
        className={`w-full bg-gray-900/70 border border-gray-700 rounded-lg py-3 px-4 ${icon ? 'pl-10' : ''} text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300 appearance-none`}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>{option.label}</option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  </div>
);

const Add_Proj = () => {

    // Get client data from Redux
    const auth = useSelector(state => state.auth);
    console.log(auth);
    if (!auth.user_id) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black">
                <p className="text-white text-lg font-medium">
                    You need to be logged in to create a project.
                </p>
            </div>
        );
    }

    // State for form fields
    const [projectData, setProjectData] = useState({
        title: '',
        description: '',
        category: 'design',
        deadline: '',
        budget: '',
        timeEstimate: '',
        skills: '',
        files: []
    });

    // State for form submission
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [client_id, setClientID] = useState(auth.user_id);
    const [project_name, setProjectName] = useState('');
    const [project_description, setProjectDescription] = useState('');
    const [project_type, setProjectType] = useState('');
    const [project_budget, setProjectBudget] = useState('');
    const [estimated_time, setEstimatedTime] = useState('');
    const [required_skills, setRequiredSkills] = useState('');
    const [deadline, setDeadline] = useState('');
    const [project_status, setProjectStatus] = useState('');

  const handleChange = (field, value) => {
    setProjectData({
      ...projectData,
      [field]: value
    });
  };

  const handleFileChange = (e) => {
    // In a real app, you'd handle file uploads differently
    // This is just for the UI demonstration
    const fileList = Array.from(e.target.files);
    setProjectData({
      ...projectData,
      files: [...projectData.files, ...fileList]
    });
  };

  const removeFile = (index) => {
    const updatedFiles = [...projectData.files];
    updatedFiles.splice(index, 1);
    setProjectData({
      ...projectData,
      files: updatedFiles
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      
      // Reset form after success
      setTimeout(() => {
        setSubmitStatus(null);
        // In a real app, you might redirect here
      }, 3000);
    }, 1500);
  };

  const categoryOptions = [
    { value: 'design', label: 'Design' },
    { value: 'development', label: 'Development' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'writing', label: 'Writing' },
    { value: 'video', label: 'Video Production' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black p-6">
      <div className="max-w-4xl mx-auto space-y-6 mt-15">

        {/* Header Section */}
        <div className="flex items-center mb-6">
          <button className="p-2 mr-4 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors group">
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
                value={projectData.title}
                onChange={(e) => handleChange('title', e.target.value)}
              />

              {/* Project description */}
              <TextArea
                label="Project Description"
                placeholder="Describe your project, goals, and requirements"
                value={projectData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={6}
              />

              {/* Two column layout for some fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Project category */}
                <Select
                  label="Project Category"
                  options={categoryOptions}
                  value={projectData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  icon={<Tag className="w-4 h-4" />}
                />

                {/* Deadline */}
                <FormInput
                  label="Deadline"
                  type="date"
                  value={projectData.deadline}
                  onChange={(e) => handleChange('deadline', e.target.value)}
                  icon={<Calendar className="w-4 h-4" />}
                />
              </div>

              {/* Another two column layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Budget */}
                <FormInput
                  label="Budget"
                  placeholder="$500"
                  value={projectData.budget}
                  onChange={(e) => handleChange('budget', e.target.value)}
                  icon={<DollarSign className="w-4 h-4" />}
                />

                {/* Time estimate */}
                <FormInput
                  label="Estimated Timeline"
                  placeholder="e.g., 2 weeks"
                  value={projectData.timeEstimate}
                  onChange={(e) => handleChange('timeEstimate', e.target.value)}
                  icon={<Clock className="w-4 h-4" />}
                />
              </div>

              {/* Skills required */}
              <FormInput
                label="Required Skills"
                placeholder="Enter skills separated by commas"
                value={projectData.skills}
                onChange={(e) => handleChange('skills', e.target.value)}
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
                <p className="text-gray-300 mb-2">Drag and drop files here or click to browse</p>
                <p className="text-gray-500 text-sm mb-4">Upload any reference images, documents, or assets</p>
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
              {projectData.files.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-gray-300 text-sm font-medium mb-3">Uploaded Files ({projectData.files.length})</h4>
                  <div className="space-y-2">
                    {projectData.files.map((file, index) => (
                      <div key={index} className="bg-gray-900/70 rounded-lg p-3 flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="bg-purple-900/30 rounded p-2 mr-3">
                            <Upload className="w-4 h-4 text-purple-400" />
                          </div>
                          <div>
                            <p className="text-white text-sm">{file.name}</p>
                            <p className="text-gray-500 text-xs">{(file.size / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Create Project'
              )}
            </button>
          </div>
          
          {/* Success/Error Message */}
          {submitStatus && (
            <div className={`mt-4 p-4 rounded-lg ${submitStatus === 'success' ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'} flex items-center`}>
              {submitStatus === 'success' ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Project created successfully! Redirecting to dashboard...
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 mr-2" />
                  There was an error creating your project. Please try again.
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