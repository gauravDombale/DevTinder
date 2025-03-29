const express = require("express");
const requestsRouter = express.Router();
const User = require("../models/user.js");
const { userAuth } = require("../middleware/auth.js");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const ConnectionRequest = require("../models/connectionRequest.js");
const app = express();

//!Middleware to read JSON data from the request body
app.use(express.json());

//! Middleware to read cookies
app.use(cookieParser());

//* send a connection request to other user
requestsRouter.post("/connection-request", userAuth, async (req, res) => {
  try {
    console.log(req.body); //{ toUserId: '67e3699920a54635046f8566' }
    const { toUserId } = req.body;
    const fromUserId = req.user._id; 
    console.log(fromUserId);//new ObjectId('67e3698120a54635046f8564')
    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
    });
    await connectionRequest.save();
    res.json({
      message: "Connection request sent successfully",
      data: connectionRequest,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error sending connection request",
      data: error.message,
    });
  }
});

module.exports = requestsRouter;
