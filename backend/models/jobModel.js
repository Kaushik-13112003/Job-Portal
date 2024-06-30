const mongoose = require("mongoose");

const schemaDesign = new mongoose.Schema(
  {
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

    jobRole: {
      type: String,
      require: true,
    },

    photo: {
      type: String,
      require: true,
    },
    // photo: {
    //   data: Buffer,
    //   contentType: String,
    // },

    salary: {
      type: String,
      default: "Fixed Salary",
      enum: ["Fixed Salary", "Range Salary"],
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

    expired: {
      type: String,
      default: false,
    },

    publishedBy: {
      type: mongoose.ObjectId,
      ref: "userData",
    },
  },
  {
    timestamps: true,
  }
);

const jobModel = mongoose.model("jobData", schemaDesign);
module.exports = jobModel;
