const Artist = require("../../models/artist");
const { Projects, Client } = require("../../models/client");
const mongoose = require("mongoose");
const { putObject, ALLOWED_FILE_TYPES, MAX_FILE_SIZE } = require("../../services/s3");
const { ObjectId } = mongoose.Types;

const getArtistName = async (req, res) => {
  const { artist_id } = req.query;

  if (!artist_id) {
    return res.status(400).json({ error: "Artist ID is required" });
  }

  try {
    const artist = await Artist.findById(artist_id);
    return res.status(200).json({ artist_name: artist.artist_name });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}

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

      // get Client ID from project
      const client_id = project.client_id;
      console.log(client_id);

      // get Client details from Client ID
      const client = await Client.findById(client_id);
      const client_email = client.email;
      console.log(client_email);
      
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

const submitProject = async (req, res) => {
  try {
    // Get data from req.body and req.files
    const { project_id, artist_id, submission_notes, completion_time, challenges_faced, improvements_made, links } = req.body;
    const files = req.files;

    // Enhanced logging
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);
    console.log("Received submission:", {
      project_id,
      artist_id,
      submission_notes,
      completion_time,
      challenges_faced,
      improvements_made,
      links,
      files: files ? files.length : 0
    });

    // Validate required fields
    if (!submission_notes || !challenges_faced || !improvements_made || !links) {
      console.error("Missing required fields");
      return res.status(400).json({
        error: "Missing required fields",
        details: "All fields are required: submission_notes, challenges_faced, improvements_made, and links"
      });
    }

    // Enhanced project ID validation
    if (!project_id) {
      console.error("Missing project_id in request");
      return res.status(400).json({ 
        error: "Project ID is required",
        details: "Please provide a valid project ID",
        code: "MISSING_PROJECT_ID"
      });
    }

    // Validate MongoDB ObjectId format for project ID
    if (!mongoose.Types.ObjectId.isValid(project_id)) {
      console.error("Invalid project_id format:", project_id);
      return res.status(400).json({ 
        error: "Invalid Project ID format",
        details: "The provided project ID is not in the correct format",
        code: "INVALID_PROJECT_ID_FORMAT"
      });
    }

    // Find and validate project existence
    const project = await Projects.findById(project_id);
    console.log("Found project:", project);
    
    if (!project) {
      console.error("Project not found with ID:", project_id);
      return res.status(404).json({ 
        error: "Project not found",
        details: "No project exists with the provided ID",
        code: "PROJECT_NOT_FOUND"
      });
    }

    // Validate project status
    if (project.project_status === "Submitted") {
      console.error("Project already submitted:", project_id);
      return res.status(400).json({ 
        error: "Project already submitted",
        details: "This project has already been submitted",
        code: "PROJECT_ALREADY_SUBMITTED"
      });
    }

    // Validate project is in progress
    if (project.project_status !== "Accepted") {
      console.error("Invalid project status:", project.project_status);
      return res.status(400).json({ 
        error: "Invalid project status",
        details: "Project must be in 'Accepted' status to be submitted",
        code: "INVALID_PROJECT_STATUS"
      });
    }

    // Enhanced validation for required fields
    if (!artist_id) {
      console.error("Missing artist_id in request");
      return res.status(400).json({ 
        error: "Artist ID is required",
        details: "Please provide a valid artist ID"
      });
    }

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(artist_id)) {
      console.error("Invalid artist_id format:", artist_id);
      return res.status(400).json({ 
        error: "Invalid Artist ID format",
        details: "The provided artist ID is not in the correct format"
      });
    }

    // Verify artist is assigned to this project
    if (!project.artist_id.includes(artist_id)) {
      console.error("Unauthorized artist:", artist_id, "for project:", project_id);
      return res.status(403).json({ 
        error: "Unauthorized submission",
        details: "You are not authorized to submit this project"
      });
    }

    // Handle file uploads
    const uploadedFiles = [];
    if (files && files.length > 0) {
      for (const file of files) {
        console.log("Processing file:", file.originalname, file.mimetype, file.size);
        
        // Validate file type
        if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
          console.error("Invalid file type:", file.mimetype);
          return res.status(400).json({ 
            error: "Invalid file type",
            details: `File type ${file.mimetype} is not allowed`
          });
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
          console.error("File too large:", file.originalname, file.size);
          return res.status(400).json({ 
            error: "File too large",
            details: `File ${file.originalname} exceeds the maximum size limit of 10MB`
          });
        }

        // Generate a unique filename
        const filename = `project-${project_id}-${Date.now()}-${file.originalname}`;
        
        try {
          // Upload file to S3
          const fileData = await putObject(filename, file.mimetype, file.buffer);
          console.log("File uploaded to S3:", fileData);
          
          uploadedFiles.push({
            url: fileData.url,
            key: fileData.key,
            type: file.mimetype,
            name: file.originalname
          });
        } catch (uploadError) {
          console.error("S3 upload error:", uploadError);
          throw new Error(`Failed to upload file ${file.originalname}: ${uploadError.message}`);
        }
      }
    }

    console.log("Attempting to update project with data:", {
      submission_notes,
      challenges_faced,
      improvements_made,
      links,
      uploadedFiles
    });

    // Update project with submission details using session
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const updatedProject = await Projects.findByIdAndUpdate(
        project_id,
        {
          $set: {
            submission_notes,
            challenges_faced,
            improvements_made,
            demo_link: links,
            project_status: "Submitted",
            submitted_files: uploadedFiles,
            submission_date: new Date()
          }
        },
        { new: true, session }
      );

      if (!updatedProject) {
        throw new Error("Failed to update project");
      }

      await session.commitTransaction();
      console.log("Project updated successfully:", updatedProject._id);

      return res.status(200).json({
        success: true,
        message: "Project submitted successfully",
        project: updatedProject
      });
    } catch (updateError) {
      await session.abortTransaction();
      console.error("Error updating project:", updateError);
      throw updateError;
    } finally {
      session.endSession();
    }

  } catch (error) {
    console.error("Error submitting project:", error);
    return res.status(500).json({
      error: "Server error",
      details: error.message
    });
  }
};

const getProjectDetails = async (req, res) => {
  try {
    const project_id = req.params.project_id || req.query.project_id;

    if (!project_id) {
      return res.status(400).json({
        error: "Project ID is required",
        details: "Please provide a valid project ID in the request parameters or query.",
      });
    }

    // Validate project_id format
    if (!mongoose.Types.ObjectId.isValid(project_id)) {
      return res.status(400).json({
        error: "Invalid Project ID format",
        details: "The provided project ID is not in the correct format.",
      });
    }

    // Find the project
    const project = await Projects.findById(project_id).select(
      "project_title description required_skills deadline project_budget submission_notes challenges_faced improvements_made demo_link submitted_files estimated_time"
    );

    if (!project) {
      return res.status(404).json({
        error: "Project not found",
        details: "No project exists with the provided ID.",
      });
    }

    // Return project details
    return res.status(200).json({
      project_title: project.project_title,
      description: project.description,
      required_skills: project.required_skills,
      deadline: project.deadline,
      project_budget: project.project_budget,
      submission_notes: project.submission_notes,
      challenges_faced: project.challenges_faced,
      improvements_made: project.improvements_made,
      demo_link: project.demo_link,
      submitted_files: project.submitted_files,
      estimated_time: project.estimated_time,
    });
  } catch (error) {
    console.error("Error fetching project details:", error);
    return res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
};

const getArtistDetails = async (req, res) => {
  try {
    const artist_id = req.params.artist_id || req.query.artist_id;

    if (!artist_id) {
      return res.status(400).json({
        error: "Artist ID is required",
        details: "Please provide a valid artist ID in the request parameters or query.",
      });
    }

    // Validate artist_id format
    if (!mongoose.Types.ObjectId.isValid(artist_id)) {
      return res.status(400).json({
        error: "Invalid Artist ID format",
        details: "The provided artist ID is not in the correct format.",
      });
    }

    // Find the artist
    const artist = await Artist.findById(artist_id).select(
      "artist_name work_title experience email description bio linkedin_url instagram_url skillSets isAvailable"
    );

    if (!artist) {
      return res.status(404).json({
        error: "Artist not found",
        details: "No artist exists with the provided ID.",
      });
    }

    // Return artist details
    return res.status(200).json({
      artist_name: artist.artist_name,
      work_title: artist.work_title,
      experience: artist.experience,
      email: artist.email,
      description: artist.description,
      bio: artist.bio,
      linkedin_url: artist.linkedin_url,
      instagram_url: artist.instagram_url,
      skillSets: artist.skillSets,
      isAvailable: artist.isAvailable
    });
  } catch (error) {
    console.error("Error fetching artist details:", error);
    return res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
}

module.exports = {
  getMatchedProjects,
  acceptProject,
  getAcceptedProjects,
  submitProject,
  getArtistName,
  getProjectDetails,
  getArtistDetails
};