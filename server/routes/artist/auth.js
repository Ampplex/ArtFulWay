const express = require("express");
const {
  handleLogin,
  handleSignUp,
} = require("../../controllers/authentication/artist_auth/auth");

const router = express.Router();

router.route("/login").post(handleLogin);
router.route("/signup").post(handleSignUp);

module.exports = router;