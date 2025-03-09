import express from "express";
import { adminAuth, userAuth } from "./middleware/auth.js";
import connectDB from "./config/database.js";

const app = express();


connectDB()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error("Database connection error");
    process.exit(1); 
  });

app.get("/admin/login", adminAuth, (req, res) => {
  res.send("Welcome to admin panel");
});

app.delete("/admin/delete", adminAuth, (req, res) => {
  res.send("Delete user");
});

app.get("/user/login", userAuth, (req, res) => {
  res.send("Welcome to user panel");
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
