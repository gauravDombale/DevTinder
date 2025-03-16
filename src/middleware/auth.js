const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

const userAuth = async (req, res, next) => {
  try {
    //? Read the token form the cookie
    const cookie = req.cookies;
    const token = cookie.token;

    if (!token) {
      return res.status(401).send("Unauthorized");
    }

    //? Decode the token
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).send("Unauthorized");
    }

    //? Get the user id from the decoded token
    const userId = decoded.id;

    //? Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).send("Unauthorized");
    }
    //? Attach the user to the request object
    req.user = user;
    next();
  } catch {}
};

module.exports = { userAuth };
