const express = require("express");
const {getPendingUsers, approveUser, rejectUser, getQueueStatus} = require("../../controllers/dashboard/admin");

const router = express.Router();

router.route("/pending_users").get(getPendingUsers);

router.route("/approve-user").post(approveUser);
router.route("/reject-user").post(rejectUser);
router.route("/queue-status").get(getQueueStatus);

module.exports = router;