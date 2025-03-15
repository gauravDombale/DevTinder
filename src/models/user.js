const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    min: 1,
    max: 120,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function (v) {
        return ["male", "female", "other"].includes(v);
      },
      message: (props) => `${props.value} is not a valid gender!`,
    },
  },
  photoUrl: {
    type: String,
    default:
      "https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small_2x/user-profile-icon-free-vector.jpg",
  },
  about: {
    type: String,
    default: "Hi I am a new user",
  },
  skills: {
    type: [String],
  },
},
{timestamps: true});

const User = mongoose.model("User", userSchema);

module.exports = User;
