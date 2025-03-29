import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Phone,
  Mail,
  Star,
  Calendar,
  Clock,
  Award,
  CheckCircle,
  User,
  AlertCircle,
  MapPin,
  Briefcase,
  MessageSquare
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

// Reusing the same card components from the Add Project page
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

// Button component
const Button = ({ children, onClick, className = '', icon }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 flex items-center justify-center ${className}`}
  >
    {icon && <span className="mr-2">{icon}</span>}
    {children}
  </button>
);

const MatchedArtist = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const auth = useSelector(state => state.auth);
  
  // States for the page
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [project, setProject] = useState(null);
  const [confirmationStatus, setConfirmationStatus] = useState(null);

  // Fetch artist data when component mounts
  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        setLoading(true);
        
        // Get the artist data
        const response = await fetch(`http://localhost:8000/api/getArtist?project_id=${projectId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch artist data');
        }
        
        const data = await response.json();
        setArtist(data.artist);
        setProject(data.project);
      } catch (err) {
        console.error('Error fetching artist:', err);
        setError(err.message || 'An error occurred while fetching artist data');
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchArtistData();
    }
  }, [projectId]);

  // Function to go back to dashboard
  const handleBack = () => {
    navigate('/dashboard');
  };

  // Function to confirm the artist
  const handleConfirmArtist = async () => {
    try {
      setConfirmationStatus('loading');
      
      // Make API call to confirm artist
      const response = await fetch('http://localhost:8000/api/confirmArtist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_id: projectId,
          artist_id: artist.id,
          client_id: auth.user_id
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to confirm artist');
      }
      
      setConfirmationStatus('success');
      
      // Reset status after 3 seconds and redirect
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
      
    } catch (err) {
      console.error('Error confirming artist:', err);
      setConfirmationStatus('error');
    }
  };

  // If user is not logged in
  if (!auth.user_id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black">
        <p className="text-white text-lg font-medium">
          You need to be logged in to view matched artists.
        </p>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-10 w-10 text-purple-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-white text-lg">Finding your perfect artist match...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black p-6">
        <div className="max-w-4xl mx-auto space-y-6 mt-15">
          <div className="flex items-center mb-6">
            <button 
              className="p-2 mr-4 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors group"
              onClick={handleBack}
            >
              <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            </button>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-pink-100">
                Matched Artist
              </h1>
            </div>
          </div>

          <Card>
            <CardContent>
              <div className="flex items-center text-red-300">
                <AlertCircle className="w-6 h-6 mr-3" />
                <p>{error}</p>
              </div>
              <Button className="mt-6 mx-auto" onClick={handleBack}>
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // If artist data is not found
  if (!artist) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black p-6">
        <div className="max-w-4xl mx-auto space-y-6 mt-15">
          <div className="flex items-center mb-6">
            <button 
              className="p-2 mr-4 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors group"
              onClick={handleBack}
            >
              <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            </button>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-pink-100">
                Matched Artist
              </h1>
            </div>
          </div>

          <Card>
            <CardContent>
              <div className="text-center py-8">
                <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl text-white mb-2">No Artist Match Found</h3>
                <p className="text-gray-400 mb-6">We couldn't find a matched artist for this project yet. Please check back later.</p>
                <Button onClick={handleBack}>
                  Return to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Main content when artist is found
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black p-6">
      <div className="max-w-4xl mx-auto space-y-6 mt-15">
        {/* Header Section */}
        <div className="flex items-center mb-6">
          <button 
            className="p-2 mr-4 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors group"
            onClick={handleBack}
          >
            <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          </button>
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-pink-100">
              Matched Artist
            </h1>
            <p className="text-gray-400">We've found the perfect artist for your project</p>
          </div>
        </div>

        {/* Project Info Card */}
        {project && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Project: {project.project_name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Type</p>
                  <p className="text-white mb-4 flex items-center">
                    <Briefcase className="w-4 h-4 mr-2 text-purple-400" />
                    {project.project_type}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Deadline</p>
                  <p className="text-white mb-4 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-purple-400" />
                    {new Date(project.deadline).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Artist Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Artist Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center md:items-start">
              {/* Artist avatar */}
              <div className="mb-6 md:mb-0 md:mr-6">
                <div className="w-32 h-32 rounded-full bg-purple-900/30 flex items-center justify-center">
                  <User className="w-16 h-16 text-purple-400" />
                </div>
                <div className="mt-3 flex justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 text-yellow-400" fill={star <= artist.rating ? "currentColor" : "none"} />
                  ))}
                </div>
                <p className="text-center text-gray-400 text-sm mt-1">{artist.rating} out of 5</p>
              </div>

              {/* Artist details */}
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">{artist.name}</h3>
                <p className="text-gray-300 mb-4 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                  {artist.location || 'Location not specified'}
                </p>
                
                <p className="text-gray-300 mb-6">{artist.bio || 'No bio available for this artist.'}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Specialization</p>
                    <p className="text-white mb-4 flex items-center">
                      <Award className="w-4 h-4 mr-2 text-purple-400" />
                      {artist.specialization || 'General'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Experience</p>
                    <p className="text-white mb-4 flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-purple-400" />
                      {artist.experience ? `${artist.experience} years` : 'Not specified'}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Contact</p>
                    <p className="text-white mb-2 flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-purple-400" />
                      {artist.email || 'Email not available'}
                    </p>
                    <p className="text-white flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-purple-400" />
                      {artist.phone || 'Phone not available'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Skills</p>
                    <div className="flex flex-wrap">
                      {artist.skills ? artist.skills.split(',').map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-purple-900/30 text-purple-300 rounded-full text-sm mr-2 mb-2">
                          {skill.trim()}
                        </span>
                      )) : (
                        <span className="text-gray-400">No skills listed</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Samples Card (if available) */}
        {artist.portfolio && artist.portfolio.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Samples</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {artist.portfolio.map((item, index) => (
                  <div key={index} className="bg-gray-900/70 rounded-lg overflow-hidden">
                    <div className="h-48 bg-gray-800 flex items-center justify-center">
                      {/* Placeholder for portfolio images */}
                      <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="p-4">
                      <h4 className="text-white font-medium mb-1">{item.title || `Project ${index + 1}`}</h4>
                      <p className="text-gray-400 text-sm">{item.description || 'No description available'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Confirmation Section */}
        <div className="mt-8 flex flex-col items-center justify-center">
          <div className="flex gap-4">
            <Button
              onClick={handleBack}
              className="bg-gray-700 hover:bg-gray-600"
            >
              Return to Dashboard
            </Button>
            <Button
              onClick={handleConfirmArtist}
              disabled={confirmationStatus === 'loading'}
              icon={confirmationStatus === 'loading' ? (
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : <CheckCircle className="w-4 h-4" />}
            >
              {confirmationStatus === 'loading' ? 'Processing...' : 'Confirm Artist Match'}
            </Button>
          </div>
          <Button
            className="mt-4 bg-transparent border border-gray-700 text-gray-300 hover:bg-gray-800"
            icon={<MessageSquare className="w-4 h-4" />}
          >
            Message Artist
          </Button>
        </div>
        
        {/* Confirmation Status Message */}
        {confirmationStatus === 'success' && (
          <div className="mt-4 p-4 rounded-lg bg-green-900/30 text-green-300 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Artist confirmed successfully! Redirecting to dashboard...
          </div>
        )}
        
        {confirmationStatus === 'error' && (
          <div className="mt-4 p-4 rounded-lg bg-red-900/30 text-red-300 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            There was an error confirming the artist. Please try again.
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchedArtist;