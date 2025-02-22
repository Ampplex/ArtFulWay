const { createHmac, randomBytes } = require("crypto");
const mongoose = require("mongoose");
const { createTokenForUser } = require("../services/auth");

const Artist_Schema = new mongoose.Schema(
  {
    artist_name: {
      type: String,
      required: true,
    },
    work_title: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    experience: {
      type: String,
      required: true,
      unique: false,
    },
    password: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    bio: {
      type: String,
    },
    linkedin_url : {
        type: String,
        required: true,
    },
    instagram_url : {
        type: String,
        required: true,
    },
    isAvailable: {
      type: Boolean,
      required: true,
    },
    score: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
    },
  },
  { timestamps: true }
);

Artist_Schema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return;

  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;

  next();
});

Artist_Schema.static(
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

    const token = createTokenForUser(user);
    return token;
  }
);

const Artist = mongoose.model("Artist", Artist_Schema, "artist");

module.exports = Artist;