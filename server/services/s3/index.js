const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
require('dotenv').config();

// Use environment variables for credentials
const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'ap-south-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "AKIA5BLOALZ3PWBRNBW7",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "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"
    }
});

const ALLOWED_FILE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/zip',
    'application/x-rar-compressed'
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

async function getObjectURL(key) {
    try {
        const command = new GetObjectCommand({
            Bucket: 'artfulway',
            Key: key
        });
        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        
        return url;
    } catch (error) {
        console.error('Error generating signed URL:', error);
        throw new Error('Failed to generate file URL');
    }
}

async function putObject(filename, contentType, fileBuffer) {
    try {
        // Validate file type
        if (!ALLOWED_FILE_TYPES.includes(contentType)) {
            throw new Error('File type not allowed');
        }

        const key = `/uploads/projects/${filename}`;
        
        // If fileBuffer is provided, upload the file directly
        if (fileBuffer) {
            const command = new PutObjectCommand({
                Bucket: 'artfulway',
                Key: key,
                Body: fileBuffer,
                ContentType: contentType
            });
            
            await s3Client.send(command);
            
            // Generate a URL for the uploaded file
            const getCommand = new GetObjectCommand({
                Bucket: 'artfulway',
                Key: key
            });
            
            const url = await getSignedUrl(s3Client, getCommand);
 
            return {
                url,
                key
            };
        } else {
            // Generate a pre-signed URL for client-side upload
            const command = new PutObjectCommand({
                Bucket: 'artfulway',
                Key: key,
                ContentType: contentType
            });
            
            const url = await getSignedUrl(s3Client, command);
            
            return {
                url,
                key
            };
        }
    } catch (error) {
        console.error('Error handling file upload:', error);
        throw new Error('Failed to handle file upload');
    }
}

module.exports = { 
    s3Client, 
    getObjectURL, 
    putObject,
    ALLOWED_FILE_TYPES,
    MAX_FILE_SIZE
};