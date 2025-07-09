const express = require("express");
const {pullMessagesFromQueue, approveUser} = require("../../controllers/dashboard/admin");

const router = express.Router();

router.route("/pending_users").get(pullMessagesFromQueue);

router.route("/approve-user").post(approveUser);

module.exports = router;