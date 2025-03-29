const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
      match: /^[A-Za-z]+$/,
    },
    lastName: {
      type: String,
      match: /^[A-Za-z]+$/,
      minLength: 3,
      maxLength: 20,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: validator.isEmail,
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return validator.isStrongPassword(v);
        },
        message: (props) => `${props.value} is not a strong password!`,
      },
    },
    age: {
      type: Number,
      min: 1,
      max: 120,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: "{VALUE} is not a valid gender",
      },
      required: true,
      lowercase: true,
      trim: true,
    },
    photoUrl: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small_2x/user-profile-icon-free-vector.jpg",
      validate: {
        validator: function (v) {
          return validator.isURL(v);
        },
        message: (props) => `${props.value} is not a valid URL!`,
      },
    },
    about: {
      type: String,
      default: "Hi I am a new user",
    },
    skills: {
      type: [String],
      validate: [
        {
          validator: function (v) {
            return v.length <= 5;
          },
          message: (props) =>
            `Maximum of 5 skills allowed, got ${props.value.length}`,
        },
      ],
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWTToken = async function () {
  const user = this;
  const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
};

userSchema.methods.validatePassword = async function (password) {
  const user = this;
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error("Invalid credentials");
  }
  return true;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
