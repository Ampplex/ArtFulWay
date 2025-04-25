import React, { useState } from 'react';
import { Mail, Linkedin, Instagram, Award, Calendar, Star, CheckCircle, XCircle } from 'lucide-react';

function ArtistProfile({ artist }) {
  const [showFullBio, setShowFullBio] = useState(false);
  
  // If no artist data is provided, show a placeholder or loading state
  if (!artist) {
    return (
      <div className="p-6 max-w-3xl mx-auto bg-gray-100 rounded-lg shadow-md">
        <p className="text-center text-gray-500">Loading artist profile...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Profile Image Placeholder */}
        <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-3xl font-bold text-gray-400">
            {artist.artist_name ? artist.artist_name.charAt(0) : "A"}
          </span>
        </div>
        
        {/* Artist Basic Info */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{artist.artist_name}</h1>
              <h2 className="text-lg text-gray-600">{artist.work_title}</h2>
            </div>
            <div className="flex items-center">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="ml-1 font-medium">{artist.score}</span>
            </div>
          </div>
          
          <div className="mt-1 flex items-center text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            <span className="text-sm">{artist.experience} years experience</span>
            <span className="mx-2">•</span>
            <span className={`flex items-center text-sm ${artist.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
              {artist.isAvailable ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Available for work
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 mr-1" />
                  Not available
                </>
              )}
            </span>
          </div>
          
          {/* Skills */}
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700">Skills:</h3>
            <div className="mt-1 flex flex-wrap gap-2">
              {artist.skillSets.split(',').map((skill, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Bio Section */}
      <div className="mt-6">
        <h3 className="text-lg font-medium">About</h3>
        <div className="mt-2 text-gray-600">
          {artist.bio && (
            <>
              <p>
                {showFullBio ? artist.bio : `${artist.bio.substring(0, 200)}${artist.bio.length > 200 ? '...' : ''}`}
              </p>
              {artist.bio.length > 200 && (
                <button 
                  className="mt-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  onClick={() => setShowFullBio(!showFullBio)}
                >
                  {showFullBio ? 'Show less' : 'Read more'}
                </button>
              )}
            </>
          )}
          {!artist.bio && <p className="text-gray-400 italic">No bio provided</p>}
        </div>
      </div>
      
      {/* Description/Work Section */}
      {artist.description && (
        <div className="mt-6">
          <h3 className="text-lg font-medium">Work</h3>
          <p className="mt-2 text-gray-600">{artist.description}</p>
        </div>
      )}
      
      {/* Projects */}
      <div className="mt-6">
        <h3 className="text-lg font-medium">Projects</h3>
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700">Matched Projects ({artist.matched_project_ids.length})</h4>
            {artist.matched_project_ids.length > 0 ? (
              <ul className="mt-1 list-disc list-inside text-gray-600 text-sm">
                {artist.matched_project_ids.map((id, index) => (
                  <li key={index}>Project ID: {id.toString().substring(0, 8)}...</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400 italic">No matched projects</p>
            )}
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700">Allotted Projects ({artist.alloted_project_ids.length})</h4>
            {artist.alloted_project_ids.length > 0 ? (
              <ul className="mt-1 list-disc list-inside text-gray-600 text-sm">
                {artist.alloted_project_ids.map((id, index) => (
                  <li key={index}>Project ID: {id.toString().substring(0, 8)}...</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400 italic">No allotted projects</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Contact Information */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-medium">Contact</h3>
        <div className="mt-3 flex flex-col space-y-2">
          <a href={`mailto:${artist.email}`} className="flex items-center text-gray-600 hover:text-blue-600">
            <Mail className="w-5 h-5 mr-2" />
            {artist.email}
          </a>
          
          <a href={artist.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 hover:text-blue-600">
            <Linkedin className="w-5 h-5 mr-2" />
            LinkedIn Profile
          </a>
          
          <a href={artist.instagram_url} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 hover:text-blue-600">
            <Instagram className="w-5 h-5 mr-2" />
            Instagram Profile
          </a>
        </div>
      </div>
    </div>
  );
}

export default ArtistProfile;