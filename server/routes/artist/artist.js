const express = require("express");
const {
  handleLogin,
  handleSignUp,
} = require("../../controllers/authentication/artist_auth/auth");

const { pushMatchedArtist } = require("../../controllers/send_notification/send_notification");

const router = express.Router();

router.route("/login").post(handleLogin);
router.route("/signup").post(handleSignUp);
router.route("/notify_matchArtist").post(pushMatchedArtist);

module.exports = router;