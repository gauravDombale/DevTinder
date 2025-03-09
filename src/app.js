const express = require("express");
const connectDB = require("./config/database.js");
const User = require("./models/user.js");

const app = express();

app.post("/signup", async (req, res) => {
  const userObj = new User({
    firstName: "Vivek",
    lastName: "Gunjal",
    emailId: "vivek@gmail.com",
    password: "vivek@123",
    age: 23,
    gender: "Male",
  });

  //! Creating a new instance of the User model
  const user = new User(userObj);

  try {
    await user.save();
    res.send("User created successfully!");
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Error creating user");
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
