const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://gauravdombale007:fVQaLJVTm7S0nale@namastenodejs.0mjmw.mongodb.net/devTinder"
  );
};



module.exports = connectDB;
