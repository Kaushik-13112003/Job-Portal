const express = require("express");
const router = express.Router();
const formidable = require("express-formidable");
const {
  applyJobController,
  getAllAppliedJobs,
  getAppliedJobImageJobController,
  updateJobStatusController,
  getResumeImageJobController,
  getSingleApplicationJobController,
  sortJobController,
} = require("../controllers/applyController");
const { authController, adminAuth } = require("../middleware/auth");

//get all job
router.get("/all-applied-job", getAllAppliedJobs);

//register
router.post("/apply-for-job", formidable(), applyJobController);

//job image
router.get("/applied-job-resume/:id", getResumeImageJobController);

//get single application of job
router.get("/single-application/:id", getSingleApplicationJobController);

router.put(
  "/update-job-status",
  authController,
  adminAuth,
  updateJobStatusController
);

//sort
router.get("/sort-job-by", sortJobController);

module.exports = router;
