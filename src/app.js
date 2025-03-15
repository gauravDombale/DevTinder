const express = require("express");
require("dotenv").config();
const connectDB = require("./config/database.js");
const User = require("./models/user.js");
const { encryptPassword } = require("./utils/encrypt_password.js");
const { validateSignupData } = require("./utils/validation.js");
const app = express();

//!Middleware to read JSON data from the request body
app.use(express.json());

const saltRounds = 10;

//* signup
app.post("/signup", async (req, res) => {
  try {
    //* Validation
    validateSignupData(req);

    //* Encrypting password
    req.body.password = await encryptPassword(req?.body?.password);

    const user = new User(req?.body);

    await user.save();
    res.send("User created successfully!");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//* feed api to fetch all users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Error fetching users");
  }
});

//* find by id
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req?.params?.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
    // res.send(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Error fetching user" });
  }
});

//* find by mail
app.get("/userEmail", async (req, res) => {
  try {
    const user = await User.findOne({ emailId: req?.body?.emailId });
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).send("Error fetching user");
  }
});

//* find by id and delete
app.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req?.params?.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send("User deleted successfully");
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("Error deleting user");
  }
});

//* find by id and update
app.put("/users/:id", async (req, res) => {
  try {
    const AllowedUpdates = [
      "photoUrl",
      "about",
      "gender",
      "age",
      "skills",
      "password",
    ];

    //! Encrypt password
    req.body.password = await encryptPassword(req?.body?.password);

    const updates = Object.keys(req?.body);
    const isValidOperation = updates.every((update) =>
      AllowedUpdates.includes(update)
    );
    if (!isValidOperation) {
      return res.status(400).send("Invalid updates!");
    }
    const user = await User.findByIdAndUpdate(req?.params.id, req?.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send("User updated successfully");
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send(error.message);
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

startServer();
