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

      // Verify that the recipient user exists
      const recipientUser = await User.findById(toUserId);
      if (!recipientUser) {
        return res.status(404).json({ error: "Recipient user not found" });
      }

      // Check if any request already exists between the users (in either direction)
      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId }
        ]
      });

      if (existingRequest) {
        return res.status(400).json({ error: "A connection request already exists between these users" });
      }

      const request = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      await request.save();
      res.json({ message: "Connection request sent successfully" });
    } catch (error) {
      // Check if the error is from our pre-save hook
      if (error.message === "Cannot send request to yourself") {
        return res.status(400).json({ error: error.message });
      }
      console.error("Error sending connection request:", error);
      res.status(500).json({ error: "Failed to send connection request" });
    }
  }
);

//* Combined endpoint for review connection requests
requestsRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const validStatuses = ["accepted", "rejected"];
      const status = req.params.status;
      
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const userId = req.user._id;
      const requestId = req.params.requestId;
      
      // Find the existing request
      const existingRequest = await ConnectionRequest.findById(requestId);
      
      if (!existingRequest) {
        return res.status(404).json({ error: "Connection request not found" });
      }
      
      // Verify that the current user is the recipient of the request
      if (existingRequest.toUserId.toString() !== userId.toString()) {
        return res.status(403).json({ error: "You can only accept/reject requests sent to you" });
      }
      
      // Update the request status
      existingRequest.status = status;
      await existingRequest.save();
      
      res.json({ message: `Connection request ${status} successfully` });
    } catch (error) {
      res.status(500).json({ error: "Failed to update connection request" });
    }
  }
);

module.exports = requestsRouter;
