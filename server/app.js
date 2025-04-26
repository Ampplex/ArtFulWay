const express = require("express");
const cors = require("cors"); // Add this line
require("dotenv").config();
const { connectMongoDb } = require("./connection");
const multer = require("multer"); // Add multer
const filesRoutes = require('./routes/files');

const app = express();
const port = process.env.PORT || 8080;
const artistRouter = require("./routes/artist/artist");
const clientRouter = require("./routes/client/client");

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:8080'], // Add your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Enable credentials (cookies, authorization headers, etc)
  optionsSuccessStatus: 200
};

// Middleware - Plugin
app.use(cors(corsOptions)); // Add CORS middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });
app.use(upload.any()); // This will handle multipart/form-data

// Routes
app.use('/api/files', filesRoutes);
app.use("/api/artist", artistRouter);
app.use("/api/client", clientRouter);

// Connection
connectMongoDb(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB successfully!"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to ArtfulWay API!" });
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});