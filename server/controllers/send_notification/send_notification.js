const Artist = require("../../models/artist");

const pushMatchedArtist = async (req, res) => {
  const { artistId, projectId } = req.body;

  try {
    console.log("Received request to push matched artist");
    console.log(artistId, projectId);
    // Find the artist by ID
    const artist = await Artist.findOne({ _id: artistId });

    if (!artist) {
      return res.status(404).json({ error: "Artist not found" });
    }

    // Add the project ID to the matched Artist's matched_project_ids array
    const result = await Artist.updateOne(
      { _id: artistId },
      { $push: { matched_project_ids: projectId } }
    );

    console.log(result);

    if (result.modifiedCount === 0) {
      return res.status(400).json({ error: "Artist update failed" });
    }

    return res.status(200).json({ message: "Artist updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  pushMatchedArtist,
};