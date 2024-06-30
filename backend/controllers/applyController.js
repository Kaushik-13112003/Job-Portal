const jobApplyModel = require("../models/jobApplyModel");
const jobModel = require("../models/jobModel");
const fs = require("fs");

const applyJobController = async (req, res) => {
  try {
    const {
      title,
      category,
      salary,
      location,
      city,
      country,
      fixedSalary,
      from,
      to,
      state,
      des,
      name,
      email,
      jobPhoto,
      jobRole,
      photo,
      phone,
      publishedBy,
      resume,
      jobId,
    } = req.fields;
    // const { resume } = req.files;

    const applyJob = new jobApplyModel({
      title,
      category,
      salary,
      location,
      city,
      state,
      country,
      des,
      name,
      email,
      phone,
      jobPhoto,
      jobRole,
      photo,
      publishedBy,
      resume,
      jobId,
    });
    // console.log(name);

    if (salary === "Fixed Salary") {
      applyJob.fixedSalary = fixedSalary;
      applyJob.filterSalary = fixedSalary;
    }

    if (salary === "Range Salary") {
      applyJob.rangeSalary.push(from, to);
      applyJob.filterSalary = from;
    }

    // if (resume) {
    //   applyJob.resume.data = fs.readFileSync(resume.path);
    //   applyJob.resume.contentType = resume.type;
    // }

    applyJob.status = "Pending";
    await applyJob.save();
    return res.status(200).json({ message: "Application Submitted" });
  } catch (err) {
    console.log(err);
  }
};

const getAllAppliedJobs = async (req, res) => {
  try {
    const allAppliedJobs = await jobApplyModel.find().sort({ createdAt: -1 });

    if (allAppliedJobs) {
      return res.status(200).json({ allAppliedJobs: allAppliedJobs });
    } else {
      return res.status(200).json({ message: "There is no job" });
    }
  } catch (err) {
    console.log(err);
  }
};

//
const getResumeImageJobController = async (req, res) => {
  try {
    const { id } = req.params;
    const resumePhoto = await jobApplyModel
      .findById({ _id: id })
      .select("resume");

    if (resumePhoto.resume.data) {
      return res.status(200).send(resumePhoto.resume.data);
    } else {
      return res.status(400).json({ message: " resume not found" });
    }
  } catch (err) {
    console.log(err);
  }
};

const getSingleApplicationJobController = async (req, res) => {
  try {
    const { id } = req.params;
    const singlejob = await jobApplyModel.findById({ _id: id });
    // .select("-resume");

    if (singlejob) {
      return res.status(200).json({ singlejob: singlejob });
    } else {
      return res.status(400).json({ message: " Application not found" });
    }
  } catch (err) {
    console.log(err);
  }
};

const updateJobStatusController = async (req, res) => {
  let { id, status } = req.body;

  if (!id) return;
  try {
    let updateStatus = await jobApplyModel.findByIdAndUpdate(
      { _id: id },
      { status: status },
      { new: true }
    );

    return res.status(200).json({ msg: "status updated" });
  } catch (err) {
    console.log(err);
  }
};

const sortJobController = async (req, res) => {
  let { sortBy } = req.query;

  try {
    let allJobs;
    if (sortBy === "All") {
      allJobs = await jobApplyModel.find();
    } else {
      allJobs = await jobApplyModel.find({ status: sortBy });
    }
    console.log();
    return res.status(200).json(allJobs);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  applyJobController,
  getAllAppliedJobs,
  getResumeImageJobController,
  getSingleApplicationJobController,
  updateJobStatusController,
  sortJobController,
};
