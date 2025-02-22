const express = require("express")
require("dotenv").config()
const {connectMongoDb} = require("./connection")

const app = express();
const port = process.env.PORT || 3000;

const artistRouter = require("./routes/artist/auth");
const clientRouter = require("./routes/client/auth");

// Middleware - Plugin
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
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
