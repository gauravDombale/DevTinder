const express = require("express");
const authRouter = express.Router();
const User = require("../models/user.js");
const { encryptPassword } = require("../utils/encrypt_password.js");
const { validateSignupData } = require("../utils/validation.js");
require("dotenv").config();

//* signup
authRouter.post("/signup", async (req, res) => {
  try {
    //* Destructuring
    const {
      firstName,
      lastName,
      emailId,
      password,
      gender,
      age,
      skills,
      photoUrl,
      about,
    } = req?.body;

    //* Validation
    validateSignupData(req);

    //* Encrypting password
    const hashedPassword = await encryptPassword(req?.body?.password);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
      gender,
      age,
      skills,
      photoUrl,
      about,
    });
    await user.save();
    res.send("User created successfully!");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//* login
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = await user.getJWTToken();

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000,
    });

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.emailId,
        name: `${user.firstName} ${user.lastName}`,
      },
    });
  } catch (error) {
    res.status(500).json({
      error:
        "Login failed. Please check your email and password and try again.",
      data: error.message,
    });
  }
});

//* logout
authRouter.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logout successful" });
});

module.exports = authRouter;
