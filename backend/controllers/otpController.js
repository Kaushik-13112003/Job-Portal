const nodemailer = require("nodemailer");

const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const otpModel = require("../models/otpModel");

//email config
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "kaushikprajapati351@gmail.com",
    pass: "zrws jpes jdlr jyok",
  },
});

// Generate OTP
function generateOTP() {
  return Math.random().toString().slice(2, 8); // Generates a 6-digit OTP
}

// Send OTP via email
function sendOTPEmail(email, otp) {
  const mailOptions = {
    from: "kaushikprajapati351@gmail.com",
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP for password reset is.Otp valid for 1 Minute only: ${otp}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

// Route for requesting password reset
// app.post("/forgot-password", async (req, res) => {});

// // Route for resetting password using OTP
// app.post("/reset-password", async (req, res) => {});

const sendOtpController = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user with provided email exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiration = new Date(Date.now() + 2 * 60 * 1000); // OTP expires in 5 minutes

    // Store OTP and expiration time in database
    await otpModel.create({ email, otp, expiresAt: otpExpiration });

    // Send OTP via email
    sendOTPEmail(email, otp);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.log(err);
  }
};

const resetPasswordController = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    console.log(email, otp, newPassword);

    // Verify OTP
    const otpRecord = await otpModel.findOne({ email });
    if (
      !otpRecord ||
      otpRecord.otp !== otp ||
      otpRecord.expiresAt < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid OTP or OTP expired" });
    }

    // Update user's password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userModel.updateOne({ email }, { password: hashedPassword });

    // Delete OTP record from database
    await otpRecord.deleteOne();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { sendOtpController, resetPasswordController };
