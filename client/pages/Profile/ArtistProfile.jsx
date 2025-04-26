import React, { useState, useEffect } from "react";
import {
  Mail,
  Linkedin,
  Instagram,
  Calendar,
  Star,
  CheckCircle,
  XCircle,
  Edit,
  Save,
  X
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

function ArtistProfile() {
  const [showFullBio, setShowFullBio] = useState(false);
  const location = useLocation();
  const artistId = location.state?.artist_id; // Get the artist ID from the state passed by the router
  const [artist, setArtist] = useState(null); // Initialize artist state
  const [loading, setLoading] = useState(true); // Initialize loading state
  const [error, setError] = useState(null); // Initialize error state
  const [isEditing, setIsEditing] = useState(false); // State to track if editing mode is active
  const [editedArtist, setEditedArtist] = useState(null); // State to store edited data

  useEffect(() => {
    const cachedArtist = sessionStorage.getItem(`artist_${artistId}`);

    if (cachedArtist) {
      console.log("Using cached artist data");
      const artistData = JSON.parse(cachedArtist);
      setArtist(artistData);
      setEditedArtist(artistData); // Initialize edit state with current data
      setLoading(false);
    } else {
      console.log("Fetching artist data for ID:", artistId);
      const fetchArtistData = async () => {
        const url = `http://localhost:8080/api/artist/getArtistDetails/?artist_id=${artistId}`;
        try {
          const response = await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (!response.ok) {
            throw new Error("Failed to fetch artist data");
          }
          const data = await response.json();
          setArtist(data);
          setEditedArtist(data); // Initialize edit state with fetched data
          sessionStorage.setItem(`artist_${artistId}`, JSON.stringify(data));
        } catch (error) {
          console.error("Error fetching artist data:", error);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchArtistData();
    }
  }, [artistId]);

  const refreshArtistData = () => {
    sessionStorage.removeItem(`artist_${artistId}`);
    window.location.reload(); // or re-fetch manually
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // If canceling edit, restore to original data
      setEditedArtist(artist);
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedArtist({
      ...editedArtist,
      [name]: value,
    });
  };

  const handleSaveChanges = async () => {
    try {
      const url = `http://localhost:8080/api/artist/updateArtist`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          artist_id: artistId,
          ...editedArtist
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update artist data");
      }

      // Update session storage and state with new data
      sessionStorage.setItem(`artist_${artistId}`, JSON.stringify(editedArtist));
      setArtist(editedArtist);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating artist data:", error);
      alert("Failed to save changes. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="p-6 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl shadow-purple-900/10">
          <p className="text-center text-gray-300">Loading artist profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="p-6 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl shadow-purple-900/10">
          <p className="text-center text-red-400">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="p-6 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl shadow-purple-900/10">
          <p className="text-center text-gray-300">Artist not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100px_100px]" />
      <div className="absolute top-40 right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-40 left-20 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="p-8 max-w-3xl mx-auto backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl shadow-purple-900/10 mt-13"
        >
          {/* Edit/Save Controls */}
          <div className="flex justify-end mb-4">
            {isEditing ? (
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveChanges}
                  className="flex items-center px-4 py-2 bg-green-900/40 text-green-300 rounded-lg border border-green-500/30 hover:bg-green-800/40 transition-all duration-300"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleEditToggle}
                  className="flex items-center px-4 py-2 bg-red-900/40 text-red-300 rounded-lg border border-red-500/30 hover:bg-red-800/40 transition-all duration-300"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </motion.button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleEditToggle}
                className="flex items-center px-4 py-2 bg-purple-900/40 text-purple-300 rounded-lg border border-purple-500/30 hover:bg-purple-800/40 transition-all duration-300"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </motion.button>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Image with glowing effect */}
            <div className="w-32 h-32 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/50 to-pink-600/50 rounded-full blur-md group-hover:blur-xl transition-all duration-300"></div>
              <div className="relative w-full h-full flex items-center justify-center bg-gray-800 rounded-full border border-white/10">
                <span className="text-3xl font-bold text-white">
                  {editedArtist.artist_name ? editedArtist.artist_name.charAt(0) : "A"}
                </span>
              </div>
            </div>

            {/* Artist Basic Info */}
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  {isEditing ? (
                    <input
                      name="artist_name"
                      value={editedArtist.artist_name || ""}
                      onChange={handleInputChange}
                      className="text-2xl font-bold bg-white/10 text-white px-2 py-1 rounded border border-purple-500/30 w-full mb-2"
                    />
                  ) : (
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-pink-100">
                      {artist.artist_name}
                    </h1>
                  )}
                  
                  {isEditing ? (
                    <input
                      name="work_title"
                      value={editedArtist.work_title || ""}
                      onChange={handleInputChange}
                      className="text-lg bg-white/10 text-white px-2 py-1 rounded border border-purple-500/30 w-full"
                    />
                  ) : (
                    <h2 className="text-lg text-gray-300">{artist.work_title}</h2>
                  )}
                </div>
                <div className="flex items-center px-3 py-1 bg-purple-900/30 backdrop-blur-sm rounded-full border border-purple-500/30">
                  <Star className="w-5 h-5 text-yellow-400" />
                  {isEditing ? (
                    <input
                      name="experience"
                      value={editedArtist.experience || ""}
                      onChange={handleInputChange}
                      type="number"
                      className="ml-1 w-12 font-medium bg-transparent text-purple-200 border-b border-purple-500/30"
                    />
                  ) : (
                    <span className="ml-1 font-medium text-purple-200">
                      {artist.experience} years
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-2 flex items-center text-gray-400">
                <Calendar className="w-4 h-4 mr-1" />
                <span className="text-sm">
                  {artist.experience} years experience
                </span>
                <span className="mx-2">•</span>
                {isEditing ? (
                  <div className="flex items-center">
                    <label className="mr-2 text-sm">Available:</label>
                    <select
                      name="isAvailable"
                      value={editedArtist.isAvailable ? "true" : "false"}
                      onChange={(e) => setEditedArtist({
                        ...editedArtist,
                        isAvailable: e.target.value === "true"
                      })}
                      className="bg-white/10 text-sm rounded border border-purple-500/30 text-white"
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                ) : (
                  <span
                    className={`flex items-center text-sm ${
                      artist.isAvailable ? "text-green-400" : "text-red-400"
                    }`}
                  >
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
                )}
              </div>

              {/* Skills */}
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-300">Skills:</h3>
                {isEditing ? (
                  <input
                    name="skillSets"
                    value={editedArtist.skillSets || ""}
                    onChange={handleInputChange}
                    placeholder="Comma separated skills (e.g. Photography, Video Editing)"
                    className="mt-1 w-full bg-white/10 text-white px-2 py-1 rounded border border-purple-500/30"
                  />
                ) : (
                  <div className="mt-1 flex flex-wrap gap-2">
                    {artist.skillSets
                      ? artist.skillSets.split(", ").map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gradient-to-r from-purple-900/40 to-pink-900/40 backdrop-blur-sm text-purple-200 text-xs font-medium rounded-full border border-purple-500/30"
                          >
                            {skill.trim()}
                          </span>
                        ))
                      : null}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="mt-8 p-6 rounded-xl backdrop-blur-md bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 shadow-lg hover:shadow-purple-600/10 transition-all duration-300">
            <h3 className="text-lg font-semibold text-white">About</h3>
            <div className="mt-2 text-gray-300">
              {isEditing ? (
                <textarea
                  name="bio"
                  value={editedArtist.bio || ""}
                  onChange={handleInputChange}
                  placeholder="Write your bio here..."
                  className="w-full h-32 bg-white/10 text-white px-3 py-2 rounded border border-purple-500/30"
                />
              ) : (
                artist.bio ? (
                  <>
                    <p>
                      {showFullBio
                        ? artist.bio
                        : `${artist.bio.substring(0, 200)}${
                            artist.bio.length > 200 ? "..." : ""
                          }`}
                    </p>
                    {artist.bio.length > 200 && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-3 px-4 py-1 bg-purple-900/30 backdrop-blur-sm rounded-full text-purple-300 text-sm font-medium border border-purple-500/30 hover:bg-purple-800/30 transition-all duration-300"
                        onClick={() => setShowFullBio(!showFullBio)}
                      >
                        {showFullBio ? "Show less" : "Read more"}
                      </motion.button>
                    )}
                  </>
                ) : (
                  <p className="text-gray-500 italic">No bio provided</p>
                )
              )}
            </div>
          </div>

          {/* Description/Work Section - Ensuring it's visible */}
          <div className="mt-6 p-6 rounded-xl backdrop-blur-md bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 shadow-lg hover:shadow-purple-600/10 transition-all duration-300">
            <h3 className="text-lg font-semibold text-white">Work</h3>
            {isEditing ? (
              <textarea
                name="description"
                value={editedArtist.description || ""}
                onChange={handleInputChange}
                placeholder="Describe your work..."
                className="w-full h-32 mt-2 bg-white/10 text-white px-3 py-2 rounded border border-purple-500/30"
              />
            ) : (
              <p className="mt-2 text-gray-300">
                {artist.description || "No work description provided"}
              </p>
            )}
          </div>

          {/* Contact Information */}
          <div className="mt-6 p-6 rounded-xl backdrop-blur-md bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 shadow-lg hover:shadow-purple-600/10 transition-all duration-300">
            <h3 className="text-lg font-semibold text-white">Contact</h3>
            <div className="mt-4 flex flex-col space-y-4">
              {isEditing ? (
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center mr-3">
                    <Mail className="w-5 h-5 text-purple-300" />
                  </div>
                  <input
                    name="email"
                    value={editedArtist.email || ""}
                    onChange={handleInputChange}
                    type="email"
                    className="flex-1 bg-white/10 text-white px-2 py-1 rounded border border-purple-500/30"
                  />
                </div>
              ) : (
                <motion.a
                  whileHover={{ x: 5 }}
                  href={`mailto:${artist.email}`}
                  className="flex items-center text-gray-300 hover:text-purple-300 transition-colors duration-300"
                >
                  <div className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center mr-3">
                    <Mail className="w-5 h-5 text-purple-300" />
                  </div>
                  {artist.email}
                </motion.a>
              )}

              {isEditing ? (
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center mr-3">
                    <Linkedin className="w-5 h-5 text-purple-300" />
                  </div>
                  <input
                    name="linkedin_url"
                    value={editedArtist.linkedin_url || ""}
                    onChange={handleInputChange}
                    placeholder="LinkedIn URL"
                    className="flex-1 bg-white/10 text-white px-2 py-1 rounded border border-purple-500/30"
                  />
                </div>
              ) : (
                <motion.a
                  whileHover={{ x: 5 }}
                  href={artist.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-300 hover:text-purple-300 transition-colors duration-300"
                >
                  <div className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center mr-3">
                    <Linkedin className="w-5 h-5 text-purple-300" />
                  </div>
                  LinkedIn Profile
                </motion.a>
              )}

              {isEditing ? (
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center mr-3">
                    <Instagram className="w-5 h-5 text-purple-300" />
                  </div>
                  <input
                    name="instagram_url"
                    value={editedArtist.instagram_url || ""}
                    onChange={handleInputChange}
                    placeholder="Instagram URL"
                    className="flex-1 bg-white/10 text-white px-2 py-1 rounded border border-purple-500/30"
                  />
                </div>
              ) : (
                <motion.a
                  whileHover={{ x: 5 }}
                  href={artist.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-300 hover:text-purple-300 transition-colors duration-300"
                >
                  <div className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center mr-3">
                    <Instagram className="w-5 h-5 text-purple-300" />
                  </div>
                  Instagram Profile
                </motion.a>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ArtistProfile;