import mongoose from "mongoose";

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://gauravdombale007:fVQaLJVTm7S0nale@namastenodejs.0mjmw.mongodb.net/"
  );
};


export default connectDB;
