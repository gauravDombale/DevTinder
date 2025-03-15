const bcrypt = require("bcrypt");

async function encryptPassword(password) {
  try {
    if (!password || typeof password !== "string") {
      throw new Error("Invalid password format");
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw new Error("Failed to hash password");
  }
}

module.exports = { encryptPassword };
