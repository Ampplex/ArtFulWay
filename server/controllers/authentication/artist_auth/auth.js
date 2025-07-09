const Artist = require("../../../models/artist");
const { createTokenForUser } = require("../../../services/auth");
const { ingest } = require("../../../services/Astra_DB/ingest.js");
const { sendSignupToSQS } = require("../../../services/sqs");


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
      isVerified: false,
    });

    // Create JWT token for the new artist
    const token = createTokenForUser({
      _id: result._id,
      name: result.artist_name,
      email: result.email,
      password: result.password, // Be careful with sending password in token
    });

    // Ingest the new artist into Astra DB
    const content = `${result.work_title} ${result.bio} ${result.description} ${result.skillSets} ${result.experience} ${result.score}`;
    const data_to_ingest = {
      content,
      meta_data: {
      email: result.email,
      experience: result.experience,
      linkedin_url: result.linkedin_url,
      instagram_url: result.instagram_url,
      isAvailable: true,
      score: "A",
      skillSets: result.skillSets,
      mongo_id: result._id,
      },
    }

    const ingest_result = await ingest({collection: "artists_vector", document: data_to_ingest});

    console.log("Artist_Data Ingestion result:", ingest_result);

    // Send signup details to SQS (non-blocking for user)
    try {
      await sendSignupToSQS(result);
    } catch (sqsErr) {
      console.error("Failed to send signup to SQS:", sqsErr);
    }

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

const checkArtistVerification = async (req, res) => {
  const artistId = req.params.id;

  try {
    const artist = await Artist.findById(artistId);
    if (!artist) {
      return res.status(404).json({ error: "Artist not found" });
    }
    return res.status(200).json({ isVerified: artist.isVerified });
  } catch (error) {
    console.error("Error checking artist verification:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  handleLogin,
  handleSignUp,
  checkArtistVerification
};
