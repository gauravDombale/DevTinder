const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth.js");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const {
  validateProfileEditData,
  validateProfilePassword,
} = require("../utils/validation.js");
const bcrypt = require("bcrypt");
const app = express();
const { encryptPassword } = require("../utils/encrypt_password");

//!Middleware to read JSON data from the request body
app.use(express.json());

//! Middleware to read cookies
app.use(cookieParser());

//* profile view
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    //* Now you can access the user from req.user which is attached by the userAuth middleware
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(500).send("Error fetching profile");
  }
});

//* profile update
profileRouter.put("/profile/update", userAuth, async (req, res) => {
  try {
    const user = req.user;
    validateProfileEditData(req);
    const updates = Object.keys(req.body);
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    res.json({
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).send(`Error updating profile: ${error.message}`);
  }
});

//* prfile password update
profileRouter.put("/profile/password/update", userAuth, async (req, res) => {
  try {
    const user = req.user;
    validateProfilePassword(req);

    // Use bcrypt to compare passwords directly
    const isSamePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (isSamePassword) {
      return res.status(400).json({
        error: "New password must be different from current password",
      });
    }

    // Use the encryptPassword function to hash the new password
    user.password = await encryptPassword(req.body.password);
    await user.save();

    res.json({
      message: "Password updated successfully",
      data: user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: `Error updating password: ${error.message}` });
  }
});

module.exports = profileRouter;
