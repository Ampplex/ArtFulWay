const { createHmac, randomBytes } = require("crypto");
const mongoose = require("mongoose");
const { createTokenForUser } = require("../services/auth");

const ProjectsSchema = new mongoose.Schema({
  project_title: {
    type: String,
    required: true,
  },
  experience_required: {
    type: String,
    required: true,
  },
  artist_id: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
  },
  client_name: {
    type: String,
    required: true,
  },
  client_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  required_skills: {
    type: String,
  },
  deadline: {
    type: String,
    required: true,
  },
  project_status: {
    type: String,
    required: true,
  },
  project_type: {
    type: String,
    required: true,
  },
  project_budget: {
    type: Number,
    required: true,
  },
  estimated_time: {
    type: String,
    required: true,
  },
  payment_status: { type: String },
});

const ClientSchema = new mongoose.Schema(
  {
    client_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    projects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Projects",
      },
    ],
    business_name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    linkedin_url: {
      type: String,
      required: true,
    },
    instagram_url: {
      type: String,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: false,
    },
    salt: {
      type: String,
    },
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
