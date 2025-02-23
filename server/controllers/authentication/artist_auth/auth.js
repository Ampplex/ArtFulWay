const Artist = require("../../../models/artist");

const handleLogin = async (req, res) => {
  const body = req.body;
  console.log(body);

  if (!body.email || !body.password) {
    console.log(body);
    return res.status(400).json({ error: "All fields are required" });
  } else {
    const { email, password } = req.body;

    try {
      const token = await Artist.matchPasswordAndGenerateToken(email, password);
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

  if (
    !body.artist_name ||
    !body.email ||
    !body.password || body.linkedin_url || body.instagram_url
  ) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  try {
    // Check if the email already exists before creating a new user
    const existingArtist = await Artist.findOne({ email: body.email });
    if (existingArtist) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const result = await Artist.create({
      artist_name: body.artist_name,
      email: body.email,
      password: body.password,
      linkedin_url: body.linkedin_url,
      instagram_url: body.instagram_url,
      isAvailable: true,
      skillSets: body.skillSets,
      experience: body.experience,
      bio: "-",
      score: "A",
      description: "",
      work_title: body.work_title,
    });

    return res
      .status(201)
      .json({ msg: "Artist created successfully", id: result._id });

  } catch (err) {
    console.error(err);

    // Check for duplicate key error (MongoDB error code 11000)
    if (err.code === 11000) {
      return res.status(400).json({ error: "Email already exists" });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  handleLogin,
  handleSignUp,
};
