const { createHmac, randomBytes } = require("crypto");
const mongoose = require("mongoose");
const { createTokenForUser } = require("../services/auth");

const ProjectsSchema = new mongoose.Schema({
  project_title: { type: String, required: true },
  artist_name: { type: String, required: true },
  client_name: { type: String, required: true },
  description: { type: String },
  skills: { type: String },
  location: { type: String },
  date: { type: Date, required: true },
  status: { type: String, required: true },
  price: { type: String },
  payment_status: { type: String },
});

const ClientSchema = new mongoose.Schema(
  {
    client_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Projects" }],
    business_name: { type: String, required: true },
    password: { type: String, required: true },
    description: { type: String },
    linkedin_url: { type: String, required: true },
    instagram_url: { type: String, required: true },
    isAvailable: { type: Boolean, required: true },
    title: { type: String, required: false },
    salt: { type: String },
  },
  { timestamps: true }
);

ClientSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();

  const salt = randomBytes(16).toString("hex");
  const hashedPassword = createHmac("sha256", salt)
    .update(this.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;

  next();
});

ClientSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email });

    if (!user) throw new Error("User not found!");

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    if (hashedPassword !== userProvidedHash)
      throw new Error("Incorrect Password");

    return createTokenForUser(user);
  }
);

const Client = mongoose.model("Client", ClientSchema);
const Projects = mongoose.model("Projects", ProjectsSchema);

module.exports = { Client, Projects };