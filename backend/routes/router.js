const express = require("express");
const router = express.Router();
const formidable = require("express-formidable");
const {
  registerController,
  loginController,
  getSingleUserController,
  getSingleUserImageController,
  updateUserController,
  deleteSingleUserController,
  forgotPasswordController,
} = require("../controllers/userController");
const { authController, adminAuth } = require("../middleware/auth");

//register
router.post("/register", formidable(), registerController);

//login
router.post("/login", loginController);

//get single user
router.get("/single-user/:id", getSingleUserController);

//get photo
router.get("/user-photo/:id", getSingleUserImageController);

//forgot password
router.put("/forgot-password", forgotPasswordController);

//update user
router.put(
  "/update-user/:id",
  authController,
  formidable(),
  updateUserController
);

//delete user
router.delete("/delete-user/:id", authController, deleteSingleUserController);

router.get("/test", authController, adminAuth, (req, res) => {
  res.status(200).send({ ok: true });
});

router.get("/auth", authController, (req, res) => {
  res.status(200).send({ ok: true });
});
module.exports = router;
