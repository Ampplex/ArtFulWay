const { Client, Projects } = require("../../../models/client");

const handleLogin = async (req, res) => {
  const body = req.body;
  console.log(body);

  if (!body.email || !body.password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const { email, password } = req.body;

  try {
    const client = await Client.findOne({ email });

    if (!client) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = await Client.matchPasswordAndGenerateToken(
      email,
      password
    );

    return res.status(200).json({
      token,
      msg: "success",
      user: {
        id: client._id,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: "Invalid credentials" });
  }
};

const handleSignUp = async (req, res) => {
  const body = req.body;

  console.log(body);

  if (!body.client_name || !body.email || !body.password) {
    return res.status(404).json({ msg: "All fields are required" });
  }

  try {
    const result = await Client.create({
      client_name: body.client_name,
      email: body.email,
      password: body.password,
      linkedin_url: body.linkedin_url,
      instagram_url: body.instagram_url,
      isAvailable: true,
      business_name: body.business_name,
      description: "",
      title: "",
    });

    return res
      .status(201)
      .json({ msg: "Client created successfully", id: result._id });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err });
  }
};

const handleAddProject = async (req, res) => {
  const body = req.body;

  console.log(body);

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

module.exports = {
  handleLogin,
  handleSignUp,
  handleAddProject,
};
