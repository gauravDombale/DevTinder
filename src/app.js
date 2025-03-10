const express = require("express");
const connectDB = require("./config/database.js");
const User = require("./models/user.js");
const app = express();

//! Middleware to read JSON data from the request body
app.use(express.json());


app.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User created successfully!");
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Error creating user");
  }
});

//feed api to fetch all users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Error fetching users");
  }
});

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
