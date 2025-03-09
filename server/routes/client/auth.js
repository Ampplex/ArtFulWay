const express = require("express");
const {
  handleLogin,
  handleSignUp,
  handleAddProject
} = require("../../controllers/authentication/client_auth/auth");

const router = express.Router();

router.route("/login").post(handleLogin);
router.route("/signup").post(handleSignUp);
router.route("/add_project").post(handleAddProject);

module.exports = router;