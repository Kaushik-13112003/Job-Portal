const mongoose = require("mongoose");

const schemaDesign = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      trim: true,
      lowercase: true,
    },

    email: {
      type: String,
      require: true,
    },

    phone: {
      type: Number,
      require: true,
    },

    resume: {
      type: String,
      require: true,
    },

    photo: {
      type: String,
      require: true,
    },

    jobPhoto: {
      type: String,
      require: true,
    },

    title: {
      type: String,
      require: true,
      trim: true,
      lowercase: true,
    },

    category: {
      type: String,
      require: true,
    },

    location: { type: String, require: true },

    city: {
      type: String,
      require: true,
    },

    state: {
      type: String,
      require: true,
    },

    country: {
      type: String,
      require: true,
    },

    des: {
      type: String,
      require: true,
    },

    salary: {
      type: String,
      require: true,
    },

    fixedSalary: {
      type: Number,
    },

    filterSalary: {
      type: Number,
    },

    rangeSalary: {
      type: Array,
      default: [],
    },

    publishedBy: {
      type: Object,
    },

    jobId: {
      type: Object,
    },

    status: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const jobApplyModel = mongoose.model("appliedJobs", schemaDesign);
module.exports = jobApplyModel;
