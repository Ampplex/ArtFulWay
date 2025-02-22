const {Client, Projects} = require("../../../models/client")

const handleLogin = async (req, res) => {
  const body = req.body;
  console.log(body);

  if (!body.email || !body.password) {
    console.log(body);
    return res.status(400).json({ error: "All fields are required" });
  } else {
    const { email, password } = req.body;

    try {
      const token = await Client.matchPasswordAndGenerateToken(email, password);
      return res.status(200).json({ token, msg: "success" });
    } catch (error) {
      console.log(error);
      return res.status(200).json({ error: "Invalid credentials" });
    }
  }
};

const handleSignUp = async (req, res) => {
  const body = req.body;

  console.log(body);

  if (!body.client_name || !body.email || !body.password) {
    return res.status(404).json({ msg: "All fields are required" });
  }

  const result = await Client.create({
    client_name: body.client_name,
    email: body.email,
    password: body.password,
    linkedin_url: body.linkedin_url,
    instagram_url: body.instagram_url,
    isAvailable: true,
    business_name: body.business_name,
    description: "",
    title: ""
  });

  return res
    .status(201)
    .json({ msg: "Client created successfully", id: result._id });
};

module.exports = {
  handleLogin,
  handleSignUp,
};