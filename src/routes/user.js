const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middleware/auth.js");
const ConnectionRequest = require("../models/connectionRequest.js");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const app = express();

//!Middleware to read JSON data from the request body
app.use(express.json());

//! Middleware to read cookies
app.use(cookieParser());


//* user connections: All the connection request which user got from other user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const connections = await ConnectionRequest.find({
      toUserId: userId,
      status: "interested",
    }).populate("fromUserId", "firstName lastName photoUrl");
    res.json(connections);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch connections" });
  }
});

//* user requests: All the connection request which user sent to other user
userRouter.get("/user/requests/send", userAuth, async (req, res) => {
    try {
        const userId = req.user._id;
        const requests = await ConnectionRequest.find({
            fromUserId: userId,
        }).populate("toUserId", "firstName lastName photoUrl");
        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch requests" });
    }
});




module.exports = userRouter;
