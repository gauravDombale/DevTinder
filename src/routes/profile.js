const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth.js");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const app = express();

//!Middleware to read JSON data from the request body
app.use(express.json());

//! Middleware to read cookies
app.use(cookieParser());

//* profile api
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    //* Now you can access the user from req.user which is attached by the userAuth middleware
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(500).send("Error fetching profile");
  }
});

module.exports = profileRouter;
