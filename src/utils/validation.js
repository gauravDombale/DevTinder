const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Names are required");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong");
  }
};

const validateProfileEditData = (req) => {
  const allowedUpdates = [
    "firstName",
    "lastName",
    "emailId",
    "about",
    "photoUrl",
    "age",
    "gender",
    "skills",
  ];
  const updates = Object.keys(req.body);
  const isValidUpdate = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidUpdate) {
    throw new Error("Invalid updates");
  }
  console.log("GAURAV", isValidUpdate);
  return isValidUpdate;
};

const validateProfilePassword = (req) => {
  const allowedUpdate = ["password"];
  const updates = Object.keys(req.body);

  // Validate presence of password
  if (!req.body.password) {
    throw new Error("password is required");
  }

  // Validate password strength
  if (!validator.isStrongPassword(req.body.password)) {
    throw new Error("Password is not strong enough");
  }

  const isValidUpdate = updates.every((update) =>
    allowedUpdate.includes(update)
  );
  if (!isValidUpdate) {
    throw new Error("Invalid updates");
  }

  return isValidUpdate;
};

module.exports = {
  validateSignupData,
  validateProfileEditData,
  validateProfilePassword,
};
