const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = new S3Client({
    region: 'ap-south-1',
    credentials: {
        accessKeyId: 'AKIA5BLOALZ3PWBRNBW7',
        secretAccessKey: '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'
    }
})

async function getObjectURL(key) {
    const command = new GetObjectCommand({
        Bucket: 'artfulway',
        Key: key
    })
    const url = await getSignedUrl(s3Client, command)
    return url;
}

async function putObject(filename, contentType) {
    const command = new PutObjectCommand({
        Bucket: 'artfulway',
        Key: `/uploads/users/${filename}`,
        ContentType: contentType
    })

    const url = await getSignedUrl(s3Client, command);

    return url;
}

const init = async () => {
    const url = await getObjectURL('/uploads/users/image-1743948197650-jpeg')
    console.log(url)
    // console.log("URL for uploading",
    //     await putObject (`image-${Date.now()}-jpeg`, "image/jpeg")
    // )
}

module.exports = { s3Client, getObjectURL, putObject };