const express = require("express");
const router = express.Router();
const formidable = require("express-formidable");
const { authController, adminAuth } = require("../middleware/auth");
const multer = require("multer");
const {
  createJobController,
  updateJobController,
  getSingleJobController,
  getAllJobController,
  getJobImageJobController,
  deleteJobController,
  getSearchController,
  getAdminsAllJobController,
  getAllJobCategoryController,
  getAllFilteredJobController,
  uploadPhotoController,
} = require("../controllers/jobController");

const photoMiddleware = multer({ dest: "/temp" });

router.post(
  "/uploadPhoto",
  photoMiddleware.single("photo"),
  uploadPhotoController
);
//create job
router.post(
  "/create-job",
  authController,
  adminAuth,
  formidable(),
  createJobController
);

//update job
router.put(
  "/update-job/:id",
  authController,
  adminAuth,
  formidable(),
  updateJobController
);

//get job
router.get("/single-job/:id", getSingleJobController);

//all job
router.get("/all-job", getAllJobController);

//search
router.get("/search/:keyword", getSearchController);

//job image
router.get("/job-photo/:id", getJobImageJobController);

//delete job
router.delete(
  "/delete-job/:id",
  authController,
  adminAuth,
  deleteJobController
);

//admin all jobs
//job image
router.get(
  "/admin-jobs/:id",
  authController,
  adminAuth,
  getAdminsAllJobController
);

//job categories
router.get("/job-category", getAllJobCategoryController);

//filtered jobs
router.post("/filter-jobs", getAllFilteredJobController);

module.exports = router;
