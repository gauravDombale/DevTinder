const express = require("express");
const requestsRouter = express.Router();
const User = require("../models/user.js");
const { userAuth } = require("../middleware/auth.js");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const app = express();

//!Middleware to read JSON data from the request body
app.use(express.json());

//! Middleware to read cookies
app.use(cookieParser());

//* send a connection request to other user
requestsRouter.post("/connection-request", userAuth, async (req, res) => {
  try {
    const { userId } = req.body;
    const user = req.user;
    console.log(user);

    if (!userId) {
      return res.status(400).send("User id is required");
    }

    const userToConnect = await User.findById(userId);
    console.log(userToConnect);
    if (!userToConnect) {
      return res.status(404).send("User not found");
    }

    userToConnect.connectionRequests.push(user._id);
    await userToConnect.save();

    res.send("Connection request sent successfully");
  } catch (error) {
    res.status(500).send("Error sending connection request");
  }
});

module.exports = requestsRouter;
