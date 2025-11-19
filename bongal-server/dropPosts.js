const mongoose = require('mongoose');
require('dotenv').config();

async function dropPostsCollection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;

    // Check if collection exists
    const collections = await db.listCollections({ name: 'posts' }).toArray();

    if (collections.length > 0) {
      console.log('Found posts collection, dropping...');
      await db.collection('posts').drop();
      console.log('✅ Posts collection dropped successfully');
    } else {
      console.log('Posts collection does not exist');
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

dropPostsCollection();
