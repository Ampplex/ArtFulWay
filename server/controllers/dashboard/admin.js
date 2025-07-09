const AWS = require("aws-sdk");
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");
const dotenv = require("dotenv");
const Artist = require("../../models/artist");
const { Projects } = require("../../models/client");

const sqs = new AWS.SQS({ region: "ap-south-1" }); // Change region as needed

const QUEUE_URL = process.env.FREELANCE_QUEUE_URL;

const pullMessagesFromQueue = async (req, res) => {
//   return res.status(200).json({
//     messages: [
//       {
//         body: '{"user_id":"686ce75af971bac48ded055a","artist_name":"rohan","email":"rohan@gmail.com","linkedin_url":"https://linkedin.com/ankeshkumar09","instagram_url":"https://www.instagram.com/dev.ankeshkumar/","skillSets":"Adobe illustrator, Figma, Adobe premier pro","experience":"-","work_title":"Artist","isVerified":false,"createdAt":"2025-07-08T09:39:38.536Z"}',
//         messageId: "1a04bc6e-bb7e-47de-9002-2e20ba91aa64",
//       },
//     ],
//   });

  try {
    const params = {
      QueueUrl: QUEUE_URL,
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 10, // long polling
    };

    const data = await sqs.receiveMessage(params).promise();

    if (!data.Messages || data.Messages.length === 0) {
      return res.status(200).json({ message: "No messages in queue" });
    }

    // Extract user payload
    const messages = data.Messages.map((msg) => ({
      body: msg.Body,
      messageId: msg.MessageId,
    }));

    return res.status(200).json({ messages });
  } catch (err) {
    console.error("SQS error:", err);
    return res.status(500).json({ error: "Failed to pull messages from SQS" });
  }
};

const approveUser = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }
  try {
    const updatedArtist = await Artist.findByIdAndUpdate(
      userId,
      { $set: { isVerified: true } },
      { new: true }
    );
    if (!updatedArtist) {
      return res.status(404).json({ error: "Artist not found" });
    }
    return res.status(200).json({ message: "User approved and verified", artist: updatedArtist });
  } catch (err) {
    console.error("Approve error:", err);
    return res.status(500).json({ error: "Failed to approve user" });
  }
};

module.exports = { pullMessagesFromQueue, approveUser };
