const { DataAPIClient, vector } = require("@datastax/astra-db-ts");
const axios = require('axios');

// Initialize the client
const client = new DataAPIClient('AstraCS:IAmIcXgCsCeIjPaGhXZKDjxr:47dfc62a1bd14b6bd83ca020f5674169016de87c57b515ea7dd0b63ac99f9814');
const db = client.db('https://e6faa57e-4998-4b4e-a6de-dbfdb7efc252-us-east-2.apps.astra.datastax.com');

const init_db = async () => {
  const colls = await db.listCollections();
  console.log('Connected to AstraDB:', colls);
};

const HF_API_TOKEN = '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';

const generateEmbedding = async (text) => {
  const response = await axios.post(
    'https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2',
    { inputs: text },
    {
      headers: {
        Authorization: `Bearer ${HF_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    }
  );

  if (!Array.isArray(response.data)) {
    throw new Error("Failed to get valid embeddings from Hugging Face");
  }

  return response.data;
};

const ingest = async (data) => {
  const { collection, document } = data;

  console.log(document)

  try {
    const embedding = await generateEmbedding(document.content);
    const documentWithVector = {
      ...document,
      $vector: embedding
    };

    const result = await db.collection(collection).insertOne(documentWithVector);
    console.log('Document inserted:', result);
    return result;
  } catch (error) {
    console.error('Error inserting document:', error);
  }
};

// ingest({ collection: 'test', document: { content: 'Hello, world!' } })
//   .then(() => console.log('Ingestion complete'))
//   .catch((error) => console.error('Ingestion failed:', error));

module.exports = {
  init_db,
  ingest,
  generateEmbedding
};
