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
      company_website_url: body.company_website_url
    });

    return res
      .status(201)
      .json({ msg: "Client created successfully", id: result._id });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err });
  }
};

module.exports = {
  handleLogin,
  handleSignUp,
};
