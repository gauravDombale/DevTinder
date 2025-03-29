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

//* endpoint for sending connection requests
requestsRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const validStatuses = ["interested", "ignored"];
      const status = req.params.status;
      
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const request = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      await request.save();
      res.json({ message: "Connection request sent successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to send connection request" });
    }
  }
);

//* Combined endpoint for review connection requests
requestsRouter.post(
  "/request/review/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const validStatuses = ["accepted", "rejected"];
      const status = req.params.status;
      
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const request = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      await request.save();
      res.json({ message: "Connection request sent successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to send connection request" });
    }
  }
);

module.exports = requestsRouter;
