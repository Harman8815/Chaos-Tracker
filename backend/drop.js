const mongoose = require('mongoose');
const HabitDay = require('./models/Habbitday'); // Assuming you have your models in 'models/Habitday.js'

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/ChaosTracker', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    dropCollection();
  })
  .catch((err) => console.log('Error connecting to MongoDB:', err));

async function dropCollection() {
  try {
    const collectionName = 'habitdays';
    const collections = await mongoose.connection.db.listCollections({ name: collectionName }).toArray();
    if (collections.length > 0) {
      await mongoose.connection.db.dropCollection(collectionName);
      console.log(`Collection '${collectionName}' dropped successfully.`);
    } else {
      console.log(`Collection '${collectionName}' does not exist.`);
    }

  } catch (err) {
    console.error('Error dropping collection:', err);
  }
  mongoose.connection.close();
}
