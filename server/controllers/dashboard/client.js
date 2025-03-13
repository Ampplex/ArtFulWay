const { Client, Projects } = require("../../models/client");
const mongoose = require("mongoose");

/**
 * Add a new project and associate it with a client
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success message or error
 */
const handleAddProject = async (req, res) => {
  const body = req.body;

  if (
    !body.client_id ||
    !body.project_name ||
    !body.project_description ||
    !body.project_type ||
    !body.project_budget ||
    !body.estimated_time ||
    !body.project_status ||
    !body.required_skills ||
    !body.deadline
  ) {
    return res.status(404).json({ msg: "All fields are required" });
  }

  try {
    // Get Client's name from client id
    const client = await Client.findOne({ _id: body.client_id });
    const client_name = client.client_name;

    // Step 1: Create a new project document
    const newProject = new Projects({
      project_title: body.project_name,  // Note: This field name is different in your schema
      description: body.project_description,  // Note: field name difference 
      project_type: body.project_type,
      project_budget: body.project_budget,
      estimated_time: body.estimated_time,
      project_status: body.project_status || "Open",
      artist_name: "-",
      client_id: body.client_id,
      client_name: client_name,
      required_skills: body.required_skills,
      deadline: body.deadline,
      payment_status: "-",
    });

    // Step 2: Save the project to get its ID
    const savedProject = await newProject.save();

    // Step 3: Update the client to add the project ID to their projects array
    const result = await Client.updateOne(
      { _id: body.client_id },
      {
        $push: {
          projects: savedProject._id,  // Push just the ID, not the whole object
        },
      }
    );

    console.log(result);

    return res.status(201).json({ 
      msg: "Project added successfully", 
      project_id: savedProject._id 
    });
    
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err });
  }
};

/**
 * Get all projects for a specific client
 * @param {Object} req - Express request object with client_id in params or query
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with projects or error
 */
const getClientProjects = async (req, res) => {
  try {
    // Get client_id from request params or query
    const clientId = req.params.client_id || req.query.client_id;
    
    if (!clientId) {
      return res.status(400).json({ 
        success: false, 
        error: "Client ID is required" 
      });
    }

    // Find the client to verify existence
    const client = await Client.findById(clientId);
    
    if (!client) {
      return res.status(404).json({ 
        success: false, 
        error: "Client not found" 
      });
    }

    // Find all projects associated with the client
    // Method 1: Using the projects array in the client document
    const projectIds = client.projects;
    const projects = await Projects.find({ _id: { $in: projectIds } });

    // Return the projects
    return res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
      client_name: client.client_name
    });

  } catch (err) {
    console.error("Error fetching client projects:", err);
    
    // Check if it's a casting error (invalid ObjectId)
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        error: "Invalid client ID format"
      });
    }
    
    return res.status(500).json({
      success: false,
      error: "Server error while fetching projects"
    });
  }
};

module.exports = {
  handleAddProject,
  getClientProjects
};