const express = require("express");
require("dotenv").config();
const connectDB = require("./config/database.js");
const User = require("./models/user.js");
const { encryptPassword } = require("./utils/encrypt_password.js");
const { validateSignupData } = require("./utils/validation.js");
const bcrypt = require("bcrypt");
const app = express();
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middleware/auth.js");

//!Middleware to read JSON data from the request body
app.use(express.json());

//! Middleware to read cookies
app.use(cookieParser());

//* signup
app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req?.body;

    //? validate email id
    if (!validator.isEmail(emailId)) {
      return res.status(400).send("Invalid email");
    }

    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(404).send("Invalid credentials");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).send("Invalid credentials");
    }

    //? generate jwt token, here I am hiding the user id in the token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    if (!token) {
      return res.status(500).send("Error generating token");
    }

    //? Add the jwt token to the cookie and send the response back to the user
    res.cookie("token", token);

    res.send("Login successful");
  } catch (error) {
    res.status(500).send("Error logging in");
  }
});

//* profile api
app.get("/profile", userAuth, async (req, res) => {
  try {
    //* Now you can access the user from req.user which is attached by the userAuth middleware
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(500).send("Error fetching profile");
  }
});

//* send a connection request to other user
app.post("/connection-request", userAuth, async (req, res) => {
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

//* start server
const startServer = async () => {
  try {
    await connectDB();
    console.log("Database connected successfully");

    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

startServer();
