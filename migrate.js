require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const mongoose = require('mongoose');

const mongoURI = process.env.MONGODB_URI;

if (!mongoURI || mongoURI.includes('<YOUR_CLUSTER_URL>')) {
  console.error('ERROR: Please update MONGODB_URI in the .env file with your actual cluster URL first!');
  process.exit(1);
}

// Reuse connection logic
mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB Atlas for migration.');
    startMigration();
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });

// Define schemas to match db.js
const SettingSchema = new mongoose.Schema({
  adminPassword: { type: String, default: 'chefadmin2026' },
  brandName: { type: String, default: 'Chef Nitesh Sharma' },
  shortDescription: { type: String, default: 'Aroma of Life by Chef Nitesh Sharma' },
  tagline: { type: String, default: 'Crafting Stories on a Plate' }
}, { strict: false });

const BlogSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: String,
  excerpt: String,
  content: String,
  image: String,
  date: String,
  year: String,
  published: { type: Boolean, default: true }
});

const RecipeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: String,
  description: String,
  category: String,
  ingredients: [String],
  method: [String],
  images: [String],
  date: String,
  type: { type: String, default: 'Veg' }
});

const JourneySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  year: String,
  title: String,
  description: String,
  company: String,
  date: String
});

const SustainabilitySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: String,
  content: String,
  image: String,
  date: String
});

const ContactSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  email: String,
  subject: String,
  message: String,
  date: String
}, { strict: false });

const SubscriberSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  email: String,
  date: String
});

const CategorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: String
});

const models = {
  settings: mongoose.model('Setting', SettingSchema),
  blogs: mongoose.model('Blog', BlogSchema),
  recipes: mongoose.model('Recipe', RecipeSchema),
  journey: mongoose.model('Journey', JourneySchema),
  sustainability: mongoose.model('Sustainability', SustainabilitySchema),
  contacts: mongoose.model('Contact', ContactSchema),
  subscribers: mongoose.model('Subscriber', SubscriberSchema),
  categories: mongoose.model('Category', CategorySchema)
};

async function startMigration() {
  try {
    const dataFilePath = path.join(__dirname, 'data.json');
    console.log(`Reading local database file: ${dataFilePath}`);
    
    let fileContent;
    try {
      fileContent = await fs.readFile(dataFilePath, 'utf8');
    } catch (readErr) {
      console.error(`Error reading data.json: ${readErr.message}`);
      console.log('No local data.json file found to migrate. Exiting...');
      mongoose.disconnect();
      return;
    }
    
    const localData = JSON.parse(fileContent);
    
    // 1. Settings
    if (localData.settings) {
      console.log('Migrating Settings...');
      await models.settings.deleteMany({});
      await new models.settings(localData.settings).save();
      console.log('Settings migrated successfully.');
    }
    
    // Helper function for arrays
    async function migrateCollection(key, modelName) {
      const items = localData[key];
      const Model = models[key];
      if (Array.isArray(items)) {
        console.log(`Migrating ${key} (${items.length} items)...`);
        await Model.deleteMany({});
        if (items.length > 0) {
          await Model.insertMany(items);
        }
        console.log(`${key} migrated successfully.`);
      }
    }
    
    await migrateCollection('categories');
    await migrateCollection('blogs');
    await migrateCollection('recipes');
    await migrateCollection('journey');
    await migrateCollection('sustainability');
    await migrateCollection('contacts');
    await migrateCollection('subscribers');
    
    console.log('*** MIGRATION COMPLETED SUCCESSFULLY ***');
  } catch (err) {
    console.error('Error during database migration:', err);
  } finally {
    mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}
