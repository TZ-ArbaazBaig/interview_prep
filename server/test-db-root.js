const mongoose = require('mongoose');
require('dotenv').config();

// Trying without the database name to see if it's a permission issue on that specific DB
const uri = "mongodb+srv://arbaazbaig98_db_user:3CB3osIBUQIxJucx@interview-prep.yvhgxoj.mongodb.net/?retryWrites=true&w=majority";

async function test() {
  try {
    console.log("Attempting root connection to Cluster...");
    await mongoose.connect(uri);
    console.log("SUCCESS: Connected to Cluster!");
    process.exit(0);
  } catch (err) {
    console.error("FAILURE: Cluster connection error:");
    console.error(err.message);
    process.exit(1);
  }
}

test();
