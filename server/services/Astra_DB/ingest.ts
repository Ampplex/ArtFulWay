import { DataAPIClient, vector } from "@datastax/astra-db-ts";

// Initialize the client
const client = new DataAPIClient('AstraCS:IAmIcXgCsCeIjPaGhXZKDjxr:47dfc62a1bd14b6bd83ca020f5674169016de87c57b515ea7dd0b63ac99f9814');
const db = client.db('https://e6faa57e-4998-4b4e-a6de-dbfdb7efc252-us-east-2.apps.astra.datastax.com');

const init_db = async () => {
  const colls = await db.listCollections();
  console.log('Connected to AstraDB:', colls);
}

init_db();

// Function to generate embeddings (placeholder - in real use, call Hugging Face API)
const generateEmbedding = async (text: string): Promise<number[]> => {
  // In a real implementation, you would call the Hugging Face API here
  // This is a placeholder that returns a random vector for demonstration
  const dimension = 384; // Typical dimension for small embedding models
  return Array(dimension).fill(0).map(() => Math.random() * 2 - 1);
}

const ingest = async (data: any) => {
  const { collection, document } = data;
  try {
    // Generate embedding for the content
    const embedding = await generateEmbedding(document.content);
    
    // Prepare the document with vector
    const documentWithVector = {
      ...document,
      $vector: embedding
    };
    
    const result = await db.collection(collection).insertOne(documentWithVector);
    console.log('Document inserted:', result);
  } catch (error) {
    console.error('Error inserting document:', error);
  }
}

// Sample data matching the collection format
const data = {
  collection: 'artists_vector', // Replace with your actual collection name
  document: {
    content: 'Artist - MERN stack - B', // Modified content
    metadata: {
      email: 'john.doe@example.com',
      experience: 3,
      linkedin_url: 'https://linkedin.com/johndoe',
      instagram_url: 'https://www.instagram.com/johndoe/',
      isAvailable: true,
      score: "B",
      skillSets: "MERN stack, Node.js, React"
    }
  }
};

ingest(data);