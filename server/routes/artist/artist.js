const express = require("express");
const {
  handleLogin,
  handleSignUp,
} = require("../../controllers/authentication/artist_auth/auth");

const { pushMatchedArtist } = require("../../controllers/send_notification/send_notification");
const { getMatchedProjects, acceptProject, getAcceptedProjects, getProjectDetails, submitProject, getArtistName, getArtistDetails, editArtistDetails } = require("../../controllers/dashboard/artist");

const router = express.Router();

router.route("/login").post(handleLogin);
router.route("/signup").post(handleSignUp);
router.route("/notify_matchArtist").post(pushMatchedArtist);
router.route("/getMatchedProjects").get(getMatchedProjects);
router.route("/acceptProject").get(acceptProject);
router.route("/getAcceptedProjects").get(getAcceptedProjects);
router.route('/submitProject').post(submitProject);
router.route('/getArtistName').get(getArtistName);
router.route('/getProjectDetails').get(getProjectDetails);
router.route('/getArtistDetails').get(getArtistDetails);
router.patch("/editArtistDetails/:artist_id", editArtistDetails);

module.exports = router;