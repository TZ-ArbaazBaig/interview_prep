const mongoose = require('mongoose');
require('dotenv').config();

// Using the username provided in your message
const uri = "mongodb+srv://arbaazbaig98:3CB3osIBUQIxJucx@interview-prep.yvhgxoj.mongodb.net/interviewprep";

async function test() {
  try {
    console.log("Attempting connection with username 'arbaazbaig98'...");
    await mongoose.connect(uri);
    console.log("SUCCESS: Connected to Cluster!");
    process.exit(0);
  } catch (err) {
    console.error("FAILURE: Connection error:");
    console.error(err.message);
    process.exit(1);
  }
}

test();
