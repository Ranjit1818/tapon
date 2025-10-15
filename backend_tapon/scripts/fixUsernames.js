require("dotenv").config();
const mongoose = require("mongoose");
const Profile = require("../models/Profile");

const start = async () => {
  try {
    // ✅ Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // ✅ Find profiles without username
    const profiles = await Profile.find({ username: { $exists: false } });

    for (const p of profiles) {
      // Create base username (remove spaces, make lowercase)
      let baseUsername = p.displayName.replace(/\s+/g, "").toLowerCase();
      let username = baseUsername;
      let counter = 1;

      // ✅ Avoid duplicates
      while (await Profile.findOne({ username })) {
        username = `${baseUsername}${counter++}`;
      }

      p.username = username;
      await p.save();
      console.log(`✅ Updated: ${p.displayName} → ${p.username}`);
    }

    console.log("✅ All missing usernames fixed");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};

// ✅ Run the script
start();
