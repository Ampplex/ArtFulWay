const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");

const sqsClient = new SQSClient({ region: "ap-south-1" });
const QUEUE_URL = process.env.FREELANCE_QUEUE_URL;

async function sendSignupToSQS(artist) {
  const params = {
    QueueUrl: QUEUE_URL,
    MessageBody: JSON.stringify({
      user_id: artist._id,
      artist_name: artist.artist_name,
      email: artist.email,
      linkedin_url: artist.linkedin_url,
      instagram_url: artist.instagram_url,
      skillSets: artist.skillSets,
      experience: artist.experience,
      work_title: artist.work_title,
      isVerified: artist.isVerified,
      createdAt: artist.createdAt,
    }),
  };

  try {
    const data = await sqsClient.send(new SendMessageCommand(params));
    console.log("SQS message sent:", data.MessageId);
    return data;
  } catch (err) {
    console.error("Error sending SQS message:", err);
    throw err;
  }
}

module.exports = { sendSignupToSQS }; 