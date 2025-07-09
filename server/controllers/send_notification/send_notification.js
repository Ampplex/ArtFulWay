const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");
const dotenv = require("dotenv");
const Artist = require("../../models/artist");
const { Projects } = require("../../models/client");

dotenv.config();

const snsClient = new SNSClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const publishSNS_Notification = async (req, res) => {
  const { message, subject } = req.body;

  const params = {
    Message: JSON.stringify(message),
    Subject: subject || "Login Event",
    TopicArn: process.env.SNS_TOPIC_ARN
  };

  try {
    const command = new PublishCommand(params);
    const response = await snsClient.send(command);
    res.status(200).json({ messageId: response.MessageId });
  } catch (error) {
    console.error("Publish failed:", error);
    res.status(500).json({ error: "Failed to publish message" });
  }
}

const pushMatchedArtist = async (req, res) => {
  const { artistId, projectId } = req.body;

  try {
    console.log("Received request to push matched artist");
    console.log(artistId, projectId);
    // Find the artist by ID

    const project = await Projects.findOne({ _id: projectId });
    if (project.project_status === "Accepted") {
      return res.status(400).json({ error: "Project already accepted" });
    }

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
  publishSNS_Notification
};