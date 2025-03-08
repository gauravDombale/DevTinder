// src/middleware/auth.js
const adminAuth = (req, res, next) => {
  const token = "ABC";
  const isAdminAuthorized = token === "ABC";
  if (!isAdminAuthorized) {
    res.status(401).send("Unauthorized login");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  const token = "ABC";
  const isAdminAuthorized = token === "ABC";
  if (!isAdminAuthorized) {
    res.status(401).send("Unauthorized login");
  } else {
    next();
  }
};

export { adminAuth, userAuth };