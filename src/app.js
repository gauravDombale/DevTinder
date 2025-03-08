import express from "express";
import { adminAuth, userAuth } from "./middleware/auth.js";
const app = express();

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
