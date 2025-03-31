const Artist = require("../../models/artist");
const { Projects } = require("../../models/client");
const mongoose = require("mongoose");

const getMatchedProjects = async (req, res) => {
  const { artist_id } = req.query;
  console.log(artist_id);

  if (!artist_id) {
    return res.status(400).json({ error: "Artist ID is required" });
  }

  try {
    const artist = await Artist.findById(artist_id);
    if (!artist) {
      return res.status(404).json({ error: "Artist not found" });
    }

    // Get all matched projects in a single query
    const matchedProjects = await Projects.find({
      _id: { $in: artist.matched_project_ids }
    });

    console.log("Matched Projects:", matchedProjects);
    return res.status(200).json({ matchedProjects });
  } catch (error) {
    console.error("Error fetching matched projects:", error);
    return res.status(500).json({ 
      error: "Server error",
      details: error.message 
    });
  }
};

const getAcceptedProjects = async (req, res) => {
    const { artist_id } = req.query;
    console.log(artist_id);

    if (!artist_id) {
        return res.status(400).json({ error: "Artist ID is required" });
    }

    try {
        const artist = await Artist.findById(artist_id);
        if (!artist) {
            return res.status(404).json({ error: "Artist not found" });
        }

        const acceptedProjects = await Projects.find({
            _id: { $in: artist.alloted_project_ids }
        });

        return res.status(200).json({ acceptedProjects });
    }
    catch (error) {
        console.error("Error fetching accepted projects:", error);
        return res.status(500).json({ 
            error: "Server error",
            details: error.message 
        });
    }
};

const acceptProject = async (req, res) => {
    const { artist_id, project_id } = req.query;
    console.log("Accepting project:", { artist_id, project_id });
    
    if (!artist_id || !project_id) {
      return res.status(400).json({ error: "Artist ID and Project ID are required" });
    }
  
    try {
      // Find artist and project
      const [artist, project] = await Promise.all([
        Artist.findById(artist_id),
        Projects.findById(project_id)
      ]);
      
      if (!artist) {
        return res.status(404).json({ error: "Artist not found" });
      }
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      if (project.project_status === "Accepted") {
        return res.status(400).json({ error: "Project already accepted" });
      }
  
      // Check if project is already accepted
      if (project.artist_id && project.artist_id.includes(artist_id)) {
        return res.status(400).json({ error: "Project already accepted by this artist" });
      }
  
      // Check if project is in matched projects
      if (!artist.matched_project_ids.some(id => id.toString() === project_id.toString())) {
        return res.status(400).json({ error: "Project is not in matched projects list" });
      }
  
      // Start a session for transaction
      const session = await mongoose.startSession();
      session.startTransaction();
      
      try {
        // Remove project from matched projects
        const result1 = await Artist.updateOne(
            {_id: artist_id},
            {$pull: {matched_project_ids: project_id}},
            { session }
        );
        console.log(result1);

        if (result1.modifiedCount === 0) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ error: "Artist update failed" });
        }
        
        // Add project to allotted projects
        const result = await Artist.updateOne(
            {_id: artist_id},
            {$push: {alloted_project_ids: project_id}},
            { session }
        );
        console.log(result);

        if (result.modifiedCount === 0) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ error: "Artist update failed" });
        }
        
        // Update project with artist ID
        const result2 = await Projects.updateOne(
            {_id: project_id},
            {
                $push: {artist_id: artist_id},
                $set: {project_status: "Accepted"}
            },
            { session }
        );
        console.log(result2);

        if (result2.modifiedCount === 0) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ error: "Project update failed" });
        }
        
        // Commit the transaction
        await session.commitTransaction();
        session.endSession();
        
        // Fetch the updated project to return in response
        const updatedProject = await Projects.findById(project_id);
        
        return res.status(200).json({ 
          message: "Project accepted successfully", 
          project: { 
            _id: updatedProject._id, 
            project_title: updatedProject.project_title, 
            project_status: updatedProject.project_status
          }
        });
      } catch (error) {
        // If an error occurred, abort the transaction
        await session.abortTransaction();
        session.endSession();
        throw error;
      }
    } catch (error) {
      console.error("Error accepting project:", error);
      
      // Handle specific MongoDB errors
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          error: "Validation Error",
          details: Object.values(error.errors).map(err => err.message)
        });
      }
      
      if (error.name === 'CastError') {
        return res.status(400).json({
          error: "Invalid ID format",
          details: "The provided ID is not in the correct format"
        });
      }
      
      return res.status(500).json({ 
        error: "Server error", 
        details: error.message
      });
    }
  };

module.exports = {
  getMatchedProjects,
  acceptProject,
  getAcceptedProjects
};