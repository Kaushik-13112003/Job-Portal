const jobModel = require("../models/jobModel");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");

async function uploadPhotoFunction(originalname, mimetype, path) {
  try {
    const client = new S3Client({
      region: "ap-southeast-2",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      },
    });

    const data = await client.send(
      new PutObjectCommand({
        Bucket: "mern-job-portal",
        Key: originalname,
        Body: fs.readFileSync(path),
        ACL: "public-read",
        ContentType: mimetype,
      })
    );

    // // Clean up local file after upload
    // fs.unlinkSync(filePath);

    return `https://mern-job-portal.s3.amazonaws.com/${originalname}`;
  } catch (err) {
    console.error("Error uploading to S3:", err);
    throw new Error("Error uploading to S3");
  }
}

const uploadPhotoController = async (req, res) => {
  let file = req.file;
  let { originalname, mimetype, path } = file;

  try {
    let link = await uploadPhotoFunction(originalname, mimetype, path);
    return res.json(link);
  } catch (err) {
    console.log(err);
  }
};

const createJobController = async (req, res) => {
  try {
    const {
      title,
      category,
      salary,
      location,
      city,
      country,
      expired,
      fixedSalary,
      from,
      to,
      state,
      jobRole,
      des,
      photo,
    } = req.fields;
    // const { photo } = req.files;

    const newJob = new jobModel({
      title,
      category,
      salary,
      location,
      city,
      photo,
      state,
      country,
      expired,
      des,
      jobRole,
      publishedBy: req.user?._id,
    });

    if (salary === "Fixed Salary") {
      newJob.fixedSalary = fixedSalary;
      newJob.filterSalary = fixedSalary;
    }

    if (salary === "Range Salary") {
      newJob.rangeSalary.push(from, to);
      newJob.filterSalary = from;
    }

    // if (photo) {
    //   newJob.photo.data = fs.readFileSync(photo.path);
    //   newJob.photo.contentType = photo.type;
    // }

    await newJob.save();
    return res.status(200).json({ message: " Job Created" });
  } catch (err) {
    console.log(err);
  }
};

const updateJobController = async (req, res) => {
  try {
    const { id } = req.params;
    const { from, to, salary, fixedSalary, photo } = req.fields;
    // const { photo } = req.files;

    let findJob = await jobModel.findByIdAndUpdate(
      { _id: id },
      { ...req.fields },
      { new: true }
    );

    if (salary === "Fixed Salary") {
      findJob = await jobModel.findByIdAndUpdate(
        { _id: id },
        { $unset: { rangeSalary: 1 } }
      );
      if (!fixedSalary) {
        return res.status(400).json({ message: "  salary  required" });
      }
      findJob.fixedSalary = fixedSalary;
      findJob.filterSalary = fixedSalary;
    }

    if (salary === "Range Salary") {
      findJob = await jobModel.findByIdAndUpdate(
        { _id: id },
        { $unset: { fixedSalary: 1 } }
      );
      if (!from || !to) {
        return res.status(400).json({ message: "  salary  required" });
      }

      findJob.rangeSalary.push(from, to);
      findJob.rangeSalary = [...new Set(findJob.rangeSalary)];
      findJob.filterSalary = findJob.rangeSalary[0];
    }

    // if (photo) {
    //   findJob.photo.data = fs.readFileSync(photo.path);
    //   findJob.photo.contentType = photo.type;
    // }

    await findJob.save();
    return res.status(200).json({ message: " Job Updated" });
  } catch (err) {
    console.log(err);
  }
};

const getAllJobController = async (req, res) => {
  try {
    const allJob = await jobModel
      .find()
      // .select("-photo")
      .populate("publishedBy", ["name"])
      .sort({ createdAt: -1 });

    let bc = 0;
    let fc = 0;
    let bfc = 0;

    allJob.forEach((ele) => {
      if (ele.category === "Frontend") {
        fc += 1;
      } else if (ele.category === "Backend") {
        bc += 1;
      } else {
        bfc += 1;
      }
    });

    if (allJob) {
      return res.status(200).json({
        allJob: allJob,
        length: allJob.length,
        backend: bc,
        frontend: fc,
        fullStack: bfc,
      });
    } else {
      return res.status(400).json({ message: " Jobs not found" });
    }
  } catch (err) {
    console.log(err);
  }
};

const getSearchController = async (req, res) => {
  const { keyword } = req.params;
  try {
    const searchData = await jobModel
      .find({
        $or: [
          { title: { $regex: keyword, $options: "i" } },
          { category: { $regex: keyword, $options: "i" } },
          { city: { $regex: keyword, $options: "i" } },
          { location: { $regex: keyword, $options: "i" } },
          { state: { $regex: keyword, $options: "i" } },
          { country: { $regex: keyword, $options: "i" } },
          // { filterSalary: { $regex: Number(keyword) } },
        ],
      })
      // .select("-photo")
      .populate("publishedBy");

    if (searchData) {
      return res.status(200).json({ searchData: searchData });
    } else {
      return res.status(400).json({ message: " Jobs not found" });
    }
  } catch (err) {
    console.log(err);
  }
};

const getSingleJobController = async (req, res) => {
  try {
    const { id } = req.params;
    const singlejob = await jobModel
      .findById({ _id: id })
      // .select("-photo")
      .populate("publishedBy", ["name"]);

    if (singlejob) {
      return res.status(200).json({ singlejob: singlejob });
    } else {
      return res.status(400).json({ message: " Job not found" });
    }
  } catch (err) {
    console.log(err);
  }
};

const getJobImageJobController = async (req, res) => {
  try {
    const { id } = req.params;
    const jobPhoto = await jobModel.findById({ _id: id }).select("photo");

    if (jobPhoto.photo.data) {
      return res.status(200).send(jobPhoto.photo.data);
    } else {
      return res.status(400).json({ message: " Job photo not found" });
    }
  } catch (err) {
    console.log(err);
  }
};

const deleteJobController = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteJob = await jobModel.findByIdAndDelete({ _id: id });

    if (deleteJob) {
      return res.status(200).json({ message: "job Deleted" });
    }
  } catch (err) {
    console.log(err);
  }
};

const getAdminsAllJobController = async (req, res) => {
  try {
    const { id } = req.params;
    const findJobs = await jobModel
      .find({ publishedBy: id })
      // .select("-photo")
      .populate("publishedBy")
      .sort({ createdAt: -1 });

    let bc = 0;
    let fc = 0;
    let bfc = 0;

    findJobs.forEach((ele) => {
      if (ele.category === "Frontend") {
        fc += 1;
      } else if (ele.category === "Backend") {
        bc += 1;
      } else {
        bfc += 1;
      }
    });

    if (findJobs) {
      return res.status(200).json({
        length: findJobs.length,
        findJobs: findJobs,
        backend: bc,
        frontend: fc,
        fullStack: bfc,
      });
    } else {
      return res.status(400).json({ message: "Jobs not found" });
    }
  } catch (err) {
    console.log(err);
  }
};

const getAllJobCategoryController = async (req, res) => {
  try {
    const findCategory = await jobModel.aggregate([
      { $group: { _id: "category" } },
    ]);

    let allCategory = findCategory.map((category) => category?._id);
    res.send(allCategory);

    if (findCategory) {
      return res
        .status(200)
        .json({ length: findCategory.length, findCategory: findCategory });
    } else {
      return res.status(400).json({ message: "Categories not found" });
    }
  } catch (err) {
    console.log(err);
  }
};

const getAllFilteredJobController = async (req, res) => {
  const { checked, salary } = req.body;
  // console.log(salary);
  try {
    const args = {};

    if (checked.length > 0) {
      args.category = { $in: checked };
    }

    if (salary.length) {
      if (salary[1] === "more") {
        args.filterSalary = { $gte: 50000 };
      } else {
        args.filterSalary = { $gte: salary[0], $lte: salary[1] };
      }
    }

    // console.log(args);
    const allFilteredJobs = await jobModel.find(args);

    if (allFilteredJobs) {
      return res.status(200).json({
        length: allFilteredJobs.length,
        allFilteredJobs: allFilteredJobs,
      });
    } else {
      return res.status(400).json({ message: "Categories not found" });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  createJobController,
  uploadPhotoController,
  updateJobController,
  getAllJobController,
  getSingleJobController,
  getJobImageJobController,
  deleteJobController,
  getSearchController,
  getAdminsAllJobController,
  getAllJobCategoryController,
  getAllFilteredJobController,
};
