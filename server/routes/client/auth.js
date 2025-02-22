const express = require("express");
const {
  handleLogin,
  handleSignUp,
} = require("../../controllers/authentication/client_auth/auth");

const router = express.Router();

router.route("/login").post(handleLogin);
router.route("/signup").post(handleSignUp);

module.exports = router;