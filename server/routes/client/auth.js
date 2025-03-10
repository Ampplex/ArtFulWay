const express = require("express");
const {
  handleLogin,
  handleSignUp,
} = require("../../controllers/authentication/client_auth/auth");

const {
  handleAddProject,
  getClientProjects
} = require("../../controllers/dashboard/client");

const router = express.Router();

router.route("/login").post(handleLogin);
router.route("/signup").post(handleSignUp);
router.route("/add_project").post(handleAddProject);
router.route("/get_projects").get(getClientProjects);

module.exports = router;