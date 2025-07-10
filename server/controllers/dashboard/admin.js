const AWS = require("aws-sdk");
const dotenv = require("dotenv");
const Artist = require("../../models/artist");
dotenv.config();

AWS.config.update({ region: process.env.AWS_REGION });
const sqs = new AWS.SQS({ apiVersion: "2012-11-05" });
const QUEUE_URL = process.env.FREELANCE_QUEUE_URL;

// 1. Get Pending Users (Admin Dashboard)
const getPendingUsers = async (req, res) => {
  try {
    const params = {
      QueueUrl: QUEUE_URL,
      MaxNumberOfMessages: 10,
      VisibilityTimeout: 2, // Reduced for rapid polling
      WaitTimeSeconds: 5
    };
    const result = await sqs.receiveMessage(params).promise();
    if (!result.Messages) {
      return res.status(200).json({ pending: [] });
    }
    const formatted = result.Messages.map((msg) => ({
      receiptHandle: msg.ReceiptHandle,
      body: JSON.parse(msg.Body)
    }));
    res.status(200).json({ pending: formatted });
  } catch (err) {
    res.status(500).json({ error: "Error fetching from SQS", details: err.message });
  }
};

// 2. Approve User
const approveUser = async (req, res) => {
  try {
    const { userId, receiptHandle } = req.body;
    await Artist.findByIdAndUpdate(userId, { isVerified: true });
    const deleteParams = {
      QueueUrl: QUEUE_URL,
      ReceiptHandle: receiptHandle
    };
    await sqs.deleteMessage(deleteParams).promise();
    res.status(200).json({ message: "User approved and message removed from SQS." });
  } catch (err) {
    res.status(500).json({ error: "Failed to approve", details: err.message });
  }
};

// 3. Reject User
const rejectUser = async (req, res) => {
  try {
    const { receiptHandle, email } = req.body;
    // Optionally send rejection email here
    console.log(`Rejection email sent to: ${email}`);
    const deleteParams = {
      QueueUrl: QUEUE_URL,
      ReceiptHandle: receiptHandle
    };
    await sqs.deleteMessage(deleteParams).promise();
    res.status(200).json({ message: "User rejected and message removed from SQS." });
  } catch (err) {
    res.status(500).json({ error: "Failed to reject", details: err.message });
  }
};

// 4. Queue Health Check (unchanged)
const getQueueStatus = async (req, res) => {
  try {
    const params = {
      QueueUrl: QUEUE_URL,
      AttributeNames: ['ApproximateNumberOfMessages', 'ApproximateNumberOfMessagesNotVisible']
    };
    const data = await sqs.getQueueAttributes(params).promise();
    return res.status(200).json({
      availableMessages: data.Attributes.ApproximateNumberOfMessages,
      inProcessing: data.Attributes.ApproximateNumberOfMessagesNotVisible
    });
  } catch (err) {
    console.error("Queue status error:", err);
    return res.status(500).json({ error: "Failed to get queue status" });
  }
};

module.exports = {
  getPendingUsers,
  approveUser,
  rejectUser,
  getQueueStatus
};