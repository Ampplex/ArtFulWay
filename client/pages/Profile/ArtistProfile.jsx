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
  X,
  RefreshCw,
  Eye,
  User,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

function ArtistProfile() {
  const [showFullBio, setShowFullBio] = useState(false);
  const location = useLocation();
  const artistId = location.state?.artist_id;
  const editProfile = location.state?.editProfile || false;
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedArtist, setEditedArtist] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const cachedArtist = sessionStorage.getItem(`artist_${artistId}`);

    if (cachedArtist) {
      console.log("Using cached artist data");
      const artistData = JSON.parse(cachedArtist);
      setArtist(artistData);
      setEditedArtist(artistData);
      setLoading(false);
    } else {
      console.log("Fetching artist data for ID:", artistId);
      fetchArtistData();
    }
    if (editProfile) {
      handleEditToggle();
    }
  }, [artistId]);

  const fetchArtistData = async () => {
    const url = `http://localhost:8080/api/artist/getArtistDetails/?artist_id=${artistId}`;
    try {
      setLoading(true);
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
      setEditedArtist(data);
      sessionStorage.setItem(`artist_${artistId}`, JSON.stringify(data));
    } catch (error) {
      console.error("Error fetching artist data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refreshArtistData = () => {
    setRefreshing(true);
    sessionStorage.removeItem(`artist_${artistId}`);
    fetchArtistData();
  };

  const handleEditToggle = () => {
    if (isEditing) {
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
      const changedFields = {};

      if (editedArtist.artist_name !== artist.artist_name)
        changedFields.artist_name = editedArtist.artist_name;
      if (editedArtist.work_title !== artist.work_title)
        changedFields.work_title = editedArtist.work_title;
      if (editedArtist.experience !== artist.experience)
        changedFields.experience = editedArtist.experience;
      if (editedArtist.email !== artist.email)
        changedFields.email = editedArtist.email;
      if (editedArtist.description !== artist.description)
        changedFields.description = editedArtist.description;
      if (editedArtist.bio !== artist.bio) changedFields.bio = editedArtist.bio;
      if (editedArtist.linkedin_url !== artist.linkedin_url)
        changedFields.linkedin_url = editedArtist.linkedin_url;
      if (editedArtist.instagram_url !== artist.instagram_url)
        changedFields.instagram_url = editedArtist.instagram_url;
      if (editedArtist.skillSets !== artist.skillSets)
        changedFields.skillSets = editedArtist.skillSets;
      if (editedArtist.isAvailable !== artist.isAvailable)
        changedFields.isAvailable = editedArtist.isAvailable;

      if (Object.keys(changedFields).length === 0) {
        alert("No changes detected");
        setIsEditing(false);
        return;
      }

      const url = `http://localhost:8080/api/artist/editArtistDetails/${artistId}`;
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(changedFields),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${response.status} - ${errorText}`);
      }

      const updatedData = await response.json();
      sessionStorage.setItem(
        `artist_${artistId}`,
        JSON.stringify(updatedData.artist)
      );
      setArtist(updatedData.artist);
      setIsEditing(false);

      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error("Error updating artist data:", error);
      alert(`Failed to save changes: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="backdrop-blur-md bg-white/30 border border-white/20 shadow-2xl p-8 rounded-3xl">
          <p className="text-center text-slate-700 font-medium">Loading artist profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="backdrop-blur-md bg-white/30 border border-white/20 shadow-2xl p-8 rounded-3xl">
          <p className="text-center text-red-600 font-medium">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="backdrop-blur-md bg-white/30 border border-white/20 shadow-2xl p-8 rounded-3xl">
          <p className="text-center text-slate-700 font-medium">Artist not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      {/* Success Notification */}
      {showSuccessMessage && (
        <motion.div
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.8 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed top-6 right-6 backdrop-blur-md bg-emerald-500/90 border border-emerald-300/30 text-white px-6 py-4 rounded-2xl shadow-2xl z-50 flex items-center"
        >
          <CheckCircle className="w-5 h-5 mr-2" />
          <span className="font-medium">Profile updated successfully!</span>
        </motion.div>
      )}

      <div className="container mx-auto px-4 max-w-4xl mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="backdrop-blur-md bg-white/40 border border-white/20 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header Section */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-8 text-center relative overflow-hidden">
            {/* Glassmorphic overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm"></div>
            
            <div className="absolute top-4 right-4 flex gap-3 relative z-10">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={refreshArtistData}
                disabled={refreshing || loading}
                className="group relative flex items-center px-4 py-2.5 backdrop-blur-lg bg-white/10 border border-white/20 text-white rounded-2xl hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <RefreshCw className={`w-4 h-4 mr-2 relative z-10 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="relative z-10 font-medium">Refresh</span>
              </motion.button>

              {isEditing ? (
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSaveChanges}
                    className="group relative flex items-center px-4 py-2.5 backdrop-blur-lg bg-emerald-500/20 border border-emerald-300/30 text-white rounded-2xl hover:bg-emerald-500/30 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 to-emerald-600/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Save className="w-4 h-4 mr-2 relative z-10" />
                    <span className="relative z-10 font-medium">Save</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleEditToggle}
                    className="group relative flex items-center px-4 py-2.5 backdrop-blur-lg bg-red-500/20 border border-red-300/30 text-white rounded-2xl hover:bg-red-500/30 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-400/30 to-red-600/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <X className="w-4 h-4 mr-2 relative z-10" />
                    <span className="relative z-10 font-medium">Cancel</span>
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEditToggle}
                  className="group relative flex items-center px-4 py-2.5 backdrop-blur-lg bg-blue-500/20 border border-blue-300/30 text-white rounded-2xl hover:bg-blue-500/30 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-blue-600/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Edit className="w-4 h-4 mr-2 relative z-10" />
                  <span className="relative z-10 font-medium">Edit Profile</span>
                </motion.button>
              )}
            </div>

            <div className="w-24 h-24 mx-auto mb-4 backdrop-blur-lg bg-white/10 border border-white/20 rounded-full flex items-center justify-center relative z-10 shadow-2xl">
              <span className="text-2xl font-bold">
                {editedArtist.artist_name ? editedArtist.artist_name.charAt(0) : "A"}
              </span>
            </div>

            {isEditing ? (
              <input
                name="artist_name"
                value={editedArtist.artist_name || ""}
                onChange={handleInputChange}
                className="text-2xl font-bold backdrop-blur-lg bg-white/10 border border-white/20 text-white px-4 py-3 rounded-2xl w-full max-w-md mx-auto mb-2 placeholder-white/70 focus:bg-white/20 focus:border-white/40 transition-all duration-300 relative z-10"
                placeholder="Artist Name"
              />
            ) : (
              <h1 className="text-2xl font-bold mb-2 relative z-10">{artist.artist_name}</h1>
            )}
          </div>

          {/* Form Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                {isEditing ? (
                  <input
                    name="artist_name"
                    value={editedArtist.artist_name || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 backdrop-blur-sm bg-white/60 border border-white/40 rounded-2xl focus:bg-white/80 focus:border-blue-300/60 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 shadow-lg hover:shadow-xl"
                    placeholder="Enter your full name"
                  />
                ) : (
                  <div className="w-full px-4 py-3 backdrop-blur-sm bg-white/50 border border-white/30 rounded-2xl text-slate-800 shadow-lg">
                    <User className="w-5 h-5 inline mr-2 text-slate-500" />
                    {artist.artist_name || "Not provided"}
                  </div>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                {isEditing ? (
                  <input
                    name="email"
                    value={editedArtist.email || ""}
                    onChange={handleInputChange}
                    type="email"
                    className="w-full px-4 py-3 backdrop-blur-sm bg-white/60 border border-white/40 rounded-2xl focus:bg-white/80 focus:border-blue-300/60 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 shadow-lg hover:shadow-xl"
                    placeholder="Enter your email"
                  />
                ) : (
                  <div className="w-full px-4 py-3 backdrop-blur-sm bg-white/50 border border-white/30 rounded-2xl text-slate-800 shadow-lg">
                    <Mail className="w-5 h-5 inline mr-2 text-slate-500" />
                    {artist.email || "Not provided"}
                  </div>
                )}
              </div>

              {/* Work Title */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Work Title</label>
                {isEditing ? (
                  <input
                    name="work_title"
                    value={editedArtist.work_title || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 backdrop-blur-sm bg-white/60 border border-white/40 rounded-2xl focus:bg-white/80 focus:border-blue-300/60 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 shadow-lg hover:shadow-xl"
                    placeholder="Enter your work title"
                  />
                ) : (
                  <div className="w-full px-4 py-3 backdrop-blur-sm bg-white/50 border border-white/30 rounded-2xl text-slate-800 shadow-lg">
                    {artist.work_title || "Not provided"}
                  </div>
                )}
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Experience (Years)</label>
                {isEditing ? (
                  <input
                    name="experience"
                    value={editedArtist.experience || ""}
                    onChange={handleInputChange}
                    type="number"
                    className="w-full px-4 py-3 backdrop-blur-sm bg-white/60 border border-white/40 rounded-2xl focus:bg-white/80 focus:border-blue-300/60 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 shadow-lg hover:shadow-xl"
                    placeholder="Years of experience"
                  />
                ) : (
                  <div className="w-full px-4 py-3 backdrop-blur-sm bg-white/50 border border-white/30 rounded-2xl text-slate-800 flex items-center shadow-lg">
                    <Star className="w-5 h-5 mr-2 text-amber-500" />
                    {artist.experience} years
                  </div>
                )}
              </div>

              {/* LinkedIn Profile */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">LinkedIn Profile</label>
                {isEditing ? (
                  <input
                    name="linkedin_url"
                    value={editedArtist.linkedin_url || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 backdrop-blur-sm bg-white/60 border border-white/40 rounded-2xl focus:bg-white/80 focus:border-blue-300/60 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 shadow-lg hover:shadow-xl"
                    placeholder="https://linkedin.com/in/your-profile"
                  />
                ) : (
                  <div className="w-full px-4 py-3 backdrop-blur-sm bg-white/50 border border-white/30 rounded-2xl text-slate-800 shadow-lg">
                    <Linkedin className="w-5 h-5 inline mr-2 text-blue-600" />
                    {artist.linkedin_url ? (
                      <a href={artist.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200">
                        LinkedIn Profile
                      </a>
                    ) : (
                      "Not provided"
                    )}
                  </div>
                )}
              </div>

              {/* Instagram Profile */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Instagram Profile</label>
                {isEditing ? (
                  <input
                    name="instagram_url"
                    value={editedArtist.instagram_url || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 backdrop-blur-sm bg-white/60 border border-white/40 rounded-2xl focus:bg-white/80 focus:border-blue-300/60 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 shadow-lg hover:shadow-xl"
                    placeholder="https://instagram.com/your-profile"
                  />
                ) : (
                  <div className="w-full px-4 py-3 backdrop-blur-sm bg-white/50 border border-white/30 rounded-2xl text-slate-800 shadow-lg">
                    <Instagram className="w-5 h-5 inline mr-2 text-pink-600" />
                    {artist.instagram_url ? (
                      <a href={artist.instagram_url} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800 hover:underline transition-colors duration-200">
                        Instagram Profile
                      </a>
                    ) : (
                      "Not provided"
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Skills & Expertise */}
            <div className="mt-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Skills & Expertise</label>
              {isEditing ? (
                <textarea
                  name="skillSets"
                  value={editedArtist.skillSets || ""}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 backdrop-blur-sm bg-white/60 border border-white/40 rounded-2xl focus:bg-white/80 focus:border-blue-300/60 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 shadow-lg hover:shadow-xl resize-none"
                  placeholder="e.g., Digital Art, UI/UX Design, Illustration, Painting"
                />
              ) : (
                <div className="w-full px-4 py-3 backdrop-blur-sm bg-white/50 border border-white/30 rounded-2xl shadow-lg">
                  {artist.skillSets ? (
                    <div className="flex flex-wrap gap-2">
                      {artist.skillSets.split(", ").map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 backdrop-blur-sm bg-blue-500/20 border border-blue-300/30 text-blue-800 text-sm rounded-full font-medium shadow-md"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-slate-500">No skills provided</span>
                  )}
                </div>
              )}
            </div>

            {/* Bio */}
            <div className="mt-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Bio</label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={editedArtist.bio || ""}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 backdrop-blur-sm bg-white/60 border border-white/40 rounded-2xl focus:bg-white/80 focus:border-blue-300/60 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 shadow-lg hover:shadow-xl resize-none"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <div className="w-full px-4 py-3 backdrop-blur-sm bg-white/50 border border-white/30 rounded-2xl shadow-lg">
                  {artist.bio ? (
                    <div>
                      <p className="text-slate-800 leading-relaxed">
                        {showFullBio ? artist.bio : `${artist.bio.substring(0, 200)}${artist.bio.length > 200 ? "..." : ""}`}
                      </p>
                      {artist.bio.length > 200 && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setShowFullBio(!showFullBio)}
                          className="mt-3 px-4 py-2 backdrop-blur-sm bg-blue-500/20 border border-blue-300/30 text-blue-700 hover:bg-blue-500/30 hover:border-blue-400/40 rounded-xl text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                          {showFullBio ? "Show less" : "Read more"}
                        </motion.button>
                      )}
                    </div>
                  ) : (
                    <span className="text-slate-500">No bio provided</span>
                  )}
                </div>
              )}
            </div>

            {/* Work Description */}
            <div className="mt-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Work Description</label>
              {isEditing ? (
                <textarea
                  name="description"
                  value={editedArtist.description || ""}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 backdrop-blur-sm bg-white/60 border border-white/40 rounded-2xl focus:bg-white/80 focus:border-blue-300/60 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 shadow-lg hover:shadow-xl resize-none"
                  placeholder="Describe your work and expertise..."
                />
              ) : (
                <div className="w-full px-4 py-3 backdrop-blur-sm bg-white/50 border border-white/30 rounded-2xl shadow-lg">
                  <p className="text-slate-800 leading-relaxed">{artist.description || "No work description provided"}</p>
                </div>
              )}
            </div>

            {/* Availability Status */}
            <div className="mt-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Availability Status</label>
              {isEditing ? (
                <select
                  name="isAvailable"
                  value={editedArtist.isAvailable ? "true" : "false"}
                  onChange={(e) =>
                    setEditedArtist({
                      ...editedArtist,
                      isAvailable: e.target.value === "true",
                    })
                  }
                  className="w-full px-4 py-3 backdrop-blur-sm bg-white/60 border border-white/40 rounded-2xl focus:bg-white/80 focus:border-blue-300/60 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <option value="true">Available for work</option>
                  <option value="false">Not available</option>
                </select>
              ) : (
                <div className="w-full px-4 py-3 backdrop-blur-sm bg-white/50 border border-white/30 rounded-2xl shadow-lg">
                  <span className={`flex items-center font-medium ${artist.isAvailable ? "text-emerald-600" : "text-red-600"}`}>
                    {artist.isAvailable ? (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Available for work
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 mr-2" />
                        Not available
                      </>
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ArtistProfile;