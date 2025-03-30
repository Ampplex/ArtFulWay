const Artist = require("../../../models/artist");
const { createTokenForUser } = require("../../../services/auth");

const handleLogin = async (req, res) => {
  const body = req.body;

  if (!body.email || !body.password) {
    console.log(body);
    return res.status(400).json({ error: "All fields are required" });
  }

  const { email, password } = req.body;

  try {

    // First find the artist
    const artist = await Artist.findOne({ email });

    if (!artist) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = await Artist.matchPasswordAndGenerateToken(email, password);

    return res.status(200).json({
      token,
      msg: "success",
      user: {
        id: artist._id,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const handleSignUp = async (req, res) => {
  const body = req.body;
  console.log(body);

  if (
    !body.artist_name ||
    !body.email ||
    !body.password ||
    !body.experience ||
    !body.work_title
  ) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  try {
    // Check if the email already exists
    const existingArtist = await Artist.findOne({ email: body.email });
    if (existingArtist) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Create new artist
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

    // Create JWT token for the new artist
    const token = createTokenForUser({
      _id: result._id,
      name: result.artist_name,
      email: result.email,
      password: result.password, // Be careful with sending password in token
    });

    return res.status(201).json({
      msg: "Artist created successfully",
      id: result._id,
      token,
      user: {
        id: result._id,
        name: result.artist_name,
        email: result.email,
      },
    });
  } catch (err) {
    console.error(err);
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
