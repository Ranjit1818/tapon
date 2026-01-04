const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Profile = require('../models/Profile');
const User = require('../models/User'); // Required for population
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
};

const checkProfile = async () => {
    await connectDB();
    const username = process.argv[2];

    if (!username) {
        console.log('Please provide a username to check.');
        process.exit(1);
    }

    try {
        const profile = await Profile.findOne({ username }).populate('user', 'name email');

        if (!profile) {
            console.log(`❌ Profile not found for username: ${username}`);
        } else {
            console.log(`✅ Profile found:`);
            console.log(`   ID: ${profile._id}`);
            console.log(`   DisplayName: ${profile.displayName}`);
            console.log(`   Username: ${profile.username}`);
            console.log(`   IsPublic: ${profile.isPublic}`);
            console.log(`   User: ${profile.user?.name} (${profile.user?.email})`);
        }
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkProfile();
