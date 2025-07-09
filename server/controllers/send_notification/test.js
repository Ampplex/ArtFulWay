import { STSClient, GetCallerIdentityCommand } from "@aws-sdk/client-sts";
import dotenv from "dotenv";
dotenv.config();

const client = new STSClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function verifyCredentials() {
  try {
    const command = new GetCallerIdentityCommand({});
    const response = await client.send(command);
    console.log("✅ Credentials valid:", response);
  } catch (err) {
    console.error("❌ Invalid credentials:", err);
  }
}

verifyCredentials();