const mongoose = require('mongoose');
require('dotenv').config();

const uri = "mongodb+srv://arbaazbaig98_db_user:3CB3osIBUQIxJucx@interview-prep.yvhgxoj.mongodb.net/interviewprep";

async function test() {
  try {
    console.log("Attempting to connect to MongoDB...");
    await mongoose.connect(uri);
    console.log("SUCCESS: Connected to MongoDB!");
    process.exit(0);
  } catch (err) {
    console.error("FAILURE: Connection error details:");
    console.error(err.message);
    process.exit(1);
  }
}

test();
