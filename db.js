const mongoose = require('mongoose');

// Default initial database content
const DEFAULT_DATA = {
  settings: {
    adminPassword: 'chefadmin2026',
    brandName: 'Chef Nitesh Sharma',
    shortDescription: 'Aroma of Life by Chef Nitesh Sharma',
    tagline: 'Crafting Stories on a Plate',
    aboutTitleTag: 'Classically Trained | over 15 Years Experience',
    aboutQuote: '"Cooking is an art form driven by passion and executed with precision."',
    aboutHighlightText: 'Chef Nitesh Sharma is a classically trained culinary professional with over 15 years of experience leading and elevating high-volume Mediterranean kitchens. For him, cooking is an art form driven by passion and executed with precision.',
    aboutBioParagraph1: 'Throughout his career, his vision has extended beyond crafting exquisite dishes. He focuses on orchestrating the complete guest journey, blending traditional Mediterranean flavors with modern culinary techniques and creating innovative, seasonal programs.',
    aboutBioParagraph2: 'From direct partnerships with local biodiverse farms to curating zero-waste kitchen workflows, Chef Nitesh believes that chef leadership is essential in shaping sustainable eating cultures.',
    aboutSignatureName: 'Nitesh Sharma',
    aboutSignatureTitle: 'Executive Chef & Culinary Consultant',
    contactPhone: '+91-9521342251',
    contactWhatsapp: '+91-9521342251',
    contactEmail: 'Niteshind84@yahoo.com',
    contactLinkedin: 'chefnitesh',
    aboutSpecialty1Title: 'Seasonal Mediterranean Menus',
    aboutSpecialty1Desc: 'Highlighting fresh seafood, extra virgin olive oil, wild herbs, and vibrant citrus zest with authentic techniques.',
    aboutSpecialty2Title: 'Contemporary Cooking Methods',
    aboutSpecialty2Desc: 'Integrating precision sous-vide cooking, artisanal charcoal grilling, and traditional sourdough fermentation.',
    aboutSpecialty3Title: 'Zero-Waste Kitchen Design',
    aboutSpecialty3Desc: 'Creating sustainable menu programs that optimize inventory, minimize waste, and utilize local biodiverse supply chains.',
    aboutSpecialty4Title: 'Kitchen Team Leadership',
    aboutSpecialty4Desc: 'Training and mentoring kitchen staff in precision techniques, sanitation protocols, and high-standard operations.',
    contactIntroTitle: "Let's Craft Something Together",
    contactIntroText: 'Have questions about recipe consulting, menu engineering, or want to discuss a sustainable food project? Contact me using the details below or drop a message through the form.',
    contactNewsletterTitle: 'Subscribe to Chef Newsletter',
    contactNewsletterText: 'Stay updated with seasonal recipe releases and zero-waste cooking methods directly from my kitchen.'
  },
  blogs: [
    {
      id: 'b1',
      title: 'The Art of Mediterranean Herb Crusted Salmon',
      excerpt: 'Exploring the vibrant flavors of fresh dill, rosemary, and citrus zests blended perfectly into a golden crust over ocean-fresh salmon.',
      content: '<p>Cooking is an art form driven by passion and executed with precision. Today, we are diving into a classic dish that encapsulates the true essence of the Mediterranean: Herb Crusted Salmon.</p><p>Using a selection of finely chopped fresh parsley, dill, and rosemary, mixed with lemon zest and quality olive oil, we create a crust that locks in the juices of the fish while adding layers of herbal complexity. The key is searing the salmon skin-side down first, then applying the herb crust and roasting at high heat for a brief, controlled time. The result is a crisp exterior and a tender, moist interior that flake easily.</p><p>We pair this dish with a light lemon-garlic reduction and roasted wild asparagus, offering a beautiful harmony of textures and flavors on the plate.</p>',
      image: '/images/recipe-salmon.jpg',
      date: '2026-08-10',
      year: '2026',
      published: true
    },
    {
      id: 'b2',
      title: 'A Chef Journey: Sourcing from Organic Farms',
      excerpt: 'How building direct relationships with local sustainable farms transformed my culinary philosophy and dish presentations.',
      content: '<p>Sustainability is not just a trend; it is the future of gastronomy. Over the past few years, my culinary direction has shifted toward a farm-to-table ethos.</p><p>By sourcing directly from local organic growers, we gain access to heirloom vegetable varieties that are harvested at their peak flavor. The natural sweetness of vine-ripened tomatoes, the peppery kick of fresh arugula, and the earthiness of wild mushrooms all shine brighter when they haven\'t traveled thousands of miles. This direct connection also allows us to customize plantings and support agricultural ecosystems that respect the earth.</p><p>Every plate we craft tells the story of these dedicated growers and the pristine soils of our local landscape.</p>',
      image: '/images/farm-sourcing.jpg',
      date: '2025-11-15',
      year: '2025',
      published: true
    },
    {
      id: 'b3',
      title: 'Mastering the Charcoal Grill',
      excerpt: 'Key tips for controlling heat, choosing the right wood chunks, and locking in smokey Mediterranean profiles.',
      content: '<p>A charcoal grill is an ancient kitchen tool that remains unmatched in modern gastronomy. The interaction between fire, fat drippings, and wood smoke creates flavors that cannot be replicated indoors.</p><p>To master the grill, one must understand zonal cooking. Create a high-heat direct zone for searing meats, and a lower-heat indirect zone for gentle roasting. We use a combination of oak wood for stable heat and cherry wood chunks for a subtle, sweet smoke profile. Whether grilling octopus or dry-aged ribeye, patience and careful temperature monitoring are your best tools.</p>',
      image: '/images/charcoal-grill.jpg',
      date: '2024-06-22',
      year: '2024',
      published: true
    }
  ],
  recipes: [
    {
      id: 'r1',
      title: 'Pan-Seared Sea Bass with Tomato-Olive Caponata',
      description: 'A classic Mediterranean preparation featuring crispy skin sea bass served over a sweet and tangy Sicilian eggplant caponata.',
      category: 'Fish',
      ingredients: [
        '2 Sea Bass fillets (skin-on)',
        '1 Eggplant, medium diced',
        '1/2 cup Cherry tomatoes, halved',
        '1/4 cup Green olives, pitted and chopped',
        '2 tbsp Capers, drained',
        '2 tbsp Red wine vinegar',
        '1 tbsp Honey or brown sugar',
        '3 tbsp Extra virgin olive oil',
        'Fresh basil leaves, salt, and freshly cracked black pepper'
      ],
      method: [
        'Prepare the Caponata: Heat 2 tbsp olive oil in a pan, add diced eggplant and cook until tender. Toss in tomatoes, olives, and capers.',
        'Stir in vinegar and honey. Simmer for 10 minutes until glossy and thick. Season with salt, pepper, and fresh basil.',
        'Prep the Fish: Pat sea bass skin completely dry. Score the skin lightly and season both sides with salt and pepper.',
        'Sear the Bass: Heat remaining olive oil in a non-stick pan over medium-high heat. Place fillets skin-side down, press flat for 30 seconds.',
        'Cook for 4 minutes until skin is golden and crispy. Flip and cook for another 1-2 minutes until done.',
        'To Serve: Spoon a generous portion of warm caponata onto a plate. Top with the sea bass fillet skin-side up. Garnish with a drizzle of extra virgin olive oil.'
      ],
      images: ['/images/sea-bass.jpg'],
      date: '2026-08-12',
      type: 'Non-Veg'
    },
    {
      id: 'r2',
      title: 'Truffle Butter Roasted Chicken',
      description: 'Succulent chicken breast roasted to perfection with homemade black truffle herb butter tucked under the skin.',
      category: 'Chicken',
      ingredients: [
        '4 Chicken breasts (skin-on, bone-in)',
        '4 tbsp Butter, softened',
        '1 tbsp Black truffle paste or truffle oil',
        '2 Garlic cloves, minced',
        '1 tbsp Fresh thyme leaves',
        '1 Lemon, halved',
        'Salt and white pepper to taste'
      ],
      method: [
        'Preheat the oven to 400°F (200°C).',
        'In a small bowl, blend softened butter, truffle paste, minced garlic, thyme, salt, and white pepper.',
        'Gently loosen the skin of the chicken breasts and spread the truffle butter evenly under the skin.',
        'Rub any remaining butter over the outside of the skin and squeeze fresh lemon juice over the top.',
        'Place chicken in a roasting pan and roast for 25-30 minutes until the skin is deep golden brown and the internal temperature reaches 165°F (74°C).',
        'Rest for 5 minutes before serving with pan drippings.'
      ],
      images: ['/images/truffle-chicken.jpg'],
      date: '2026-08-11',
      type: 'Non-Veg'
    },
    {
      id: 'r3',
      title: 'Citrus Glazed Fennel & Beet Salad',
      description: 'A colorful and refreshing summer salad combining earthy roasted beets, crunchy sliced fennel, and a zesty orange reduction vinaigrette.',
      category: 'Salads',
      ingredients: [
        '3 Medium beets (red and golden)',
        '1 Fennel bulb, shaved paper thin',
        '2 Oranges, segmented',
        '1/4 cup Goat cheese, crumbled',
        '1/4 cup Toasted walnuts, chopped',
        '3 tbsp Extra virgin olive oil',
        '1 tbsp Fresh orange juice',
        '1 tbsp White balsamic vinegar',
        'Microgreens for garnish'
      ],
      method: [
        'Roast Beets: Wrap beets in foil with olive oil, salt, and pepper. Bake at 400°F for 45 minutes. Peel and slice into wedges once cool.',
        'Prepare Shaved Fennel: Shave the fennel bulb using a mandoline. Place in ice water for 10 minutes to crisp, then spin dry.',
        'Make Vinaigrette: Whisk olive oil, orange juice, balsamic vinegar, and salt together.',
        'Assemble Salad: Arrange beet slices and crisp fennel on a platter. Scatter orange segments, toasted walnuts, and goat cheese.',
        'Drizzle vinaigrette over the salad. Garnish with fennel fronds and microgreens.'
      ],
      images: ['/images/beet-salad.jpg'],
      date: '2026-07-28',
      type: 'Veg'
    }
  ],
  journey: [
    {
      id: 'j1',
      year: '2026',
      title: 'Executive Culinary Consultant',
      description: 'Leading menu revamps and implementing sustainable sourcing practices for top Mediterranean restaurants in Mumbai and Delhi, focusing on local organic supply chains.',
      company: 'Aroma Culinary Consulting',
      date: '2026-01-10'
    },
    {
      id: 'j2',
      year: '2025',
      title: 'Executive Chef',
      description: 'Supervised a team of 15 cooks at a high-volume coastal Mediterranean bistro. Designed seasonal menus, organized exclusive chef-table wine pairings, and boosted guest satisfaction ratings by 20%.',
      company: 'Maris Coastal Grille',
      date: '2025-03-15'
    },
    {
      id: 'j3',
      year: '2024',
      title: 'Head of Culinary Innovation',
      description: 'Developed modern interpretations of traditional Greek and Italian recipes. Trained kitchen teams in precision sous-vide techniques and curated zero-waste food prep protocols.',
      company: 'Nostos Fine Dining Group',
      date: '2024-02-01'
    },
    {
      id: 'j4',
      year: '2022',
      title: 'Chef de Cuisine',
      description: 'Managed kitchen operations, food costing, and menu design for a boutique luxury hotel specializing in Mediterranean farm-to-table cuisine.',
      company: 'Aurelia Resort & Spa',
      date: '2022-05-10'
    }
  ],
  sustainability: [
    {
      id: 's1',
      title: 'Our Zero-Waste Kitchen Philosophy',
      content: '<p>In my kitchens, we view every ingredient as a precious resource. Sustainability is not just about using organic produce; it\'s about respecting the entire lifecycle of what we consume.</p><p>We employ creative fermentation, dehydrating techniques, and slow reductions to utilize herb stems, vegetable trimmings, and bones. Citrus peels are turned into custom bitters and syrups, while leftover sourdough is transformed into flavorful crumbs or miso-style starters. By shrinking our waste footprint, we honor the farmers and the earth that gave us these ingredients.</p>',
      image: '/images/sustainability-kitchen.jpg',
      date: '2026-08-01'
    },
    {
      id: 's2',
      title: 'Local Farm Partnerships & Biodiversity',
      content: '<p>Monoculture depletes our soils and strips ingredients of their true flavors. I actively partner with small family farms that practice regenerative agriculture and protect biodiversity.</p><p>By incorporating lesser-known heirloom grains, wild-foraged herbs, and native vegetable varieties into our seasonal menus, we encourage soil health and support sustainable farming families. The menu shifts dynamically with the harvest calendar, ensuring that diners experience flavors in their most genuine, vibrant form.</p>',
      image: '/images/sustainability-farm.jpg',
      date: '2026-05-12'
    }
  ],
  contacts: [],
  subscribers: [],
  categories: [
    { id: 'cat1', name: 'Fish' },
    { id: 'cat2', name: 'Chicken' },
    { id: 'cat3', name: 'Beef' },
    { id: 'cat4', name: 'Pork' },
    { id: 'cat5', name: 'Vegetables' },
    { id: 'cat6', name: 'Salads' },
    { id: 'cat7', name: 'Soups' }
  ]
};

// Connect to MongoDB Atlas
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  console.error("FATAL ERROR: MONGODB_URI is not defined in the environment variables (.env file).");
  process.exit(1);
}

// Set mongoose connection options
mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB Atlas successfully.');
    // Seed initial data if Settings is empty and no local migration is running
    initializeDbSeed();
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err.message);
  });

// Schema Definitions
const SettingSchema = new mongoose.Schema({
  adminPassword: { type: String, default: 'chefadmin2026' },
  brandName: { type: String, default: 'Chef Nitesh Sharma' },
  shortDescription: { type: String, default: 'Aroma of Life by Chef Nitesh Sharma' },
  tagline: { type: String, default: 'Crafting Stories on a Plate' },
  chefImage: { type: String },
  
  aboutTitleTag: { type: String, default: 'Classically Trained | over 15 Years Experience' },
  aboutQuote: { type: String, default: '"Cooking is an art form driven by passion and executed with precision."' },
  aboutHighlightText: { type: String, default: 'Chef Nitesh Sharma is a classically trained culinary professional with over 15 years of experience leading and elevating high-volume Mediterranean kitchens. For him, cooking is an art form driven by passion and executed with precision.' },
  aboutBioParagraph1: { type: String, default: 'Throughout his career, his vision has extended beyond crafting exquisite dishes. He focuses on orchestrating the complete guest journey, blending traditional Mediterranean flavors with modern culinary techniques and creating innovative, seasonal programs.' },
  aboutBioParagraph2: { type: String, default: 'From direct partnerships with local biodiverse farms to curating zero-waste kitchen workflows, Chef Nitesh believes that chef leadership is essential in shaping sustainable eating cultures.' },
  aboutSignatureName: { type: String, default: 'Nitesh Sharma' },
  aboutSignatureTitle: { type: String, default: 'Executive Chef & Culinary Consultant' },

  contactPhone: { type: String, default: '+91-9521342251' },
  contactWhatsapp: { type: String, default: '+91-9521342251' },
  contactEmail: { type: String, default: 'Niteshind84@yahoo.com' },
  contactLinkedin: { type: String, default: 'chefnitesh' },

  aboutSpecialty1Title: { type: String, default: 'Seasonal Mediterranean Menus' },
  aboutSpecialty1Desc: { type: String, default: 'Highlighting fresh seafood, extra virgin olive oil, wild herbs, and vibrant citrus zest with authentic techniques.' },
  aboutSpecialty2Title: { type: String, default: 'Contemporary Cooking Methods' },
  aboutSpecialty2Desc: { type: String, default: 'Integrating precision sous-vide cooking, artisanal charcoal grilling, and traditional sourdough fermentation.' },
  aboutSpecialty3Title: { type: String, default: 'Zero-Waste Kitchen Design' },
  aboutSpecialty3Desc: { type: String, default: 'Creating sustainable menu programs that optimize inventory, minimize waste, and utilize local biodiverse supply chains.' },
  aboutSpecialty4Title: { type: String, default: 'Kitchen Team Leadership' },
  aboutSpecialty4Desc: { type: String, default: 'Training and mentoring kitchen staff in precision techniques, sanitation protocols, and high-standard operations.' },

  contactIntroTitle: { type: String, default: "Let's Craft Something Together" },
  contactIntroText: { type: String, default: 'Have questions about recipe consulting, menu engineering, or want to discuss a sustainable food project? Contact me using the details below or drop a message through the form.' },
  contactNewsletterTitle: { type: String, default: 'Subscribe to Chef Newsletter' },
  contactNewsletterText: { type: String, default: 'Stay updated with seasonal recipe releases and zero-waste cooking methods directly from my kitchen.' }
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

// Compile Models
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

// Seed database with default data if empty
async function initializeDbSeed() {
  try {
    const settingsCount = await models.settings.countDocuments();
    if (settingsCount === 0) {
      console.log('Database is empty. Seeding default data...');
      
      // Save settings
      await new models.settings(DEFAULT_DATA.settings).save();
      
      // Seed categories
      for (const item of DEFAULT_DATA.categories) {
        await new models.categories(item).save();
      }
      
      // Seed blogs
      for (const item of DEFAULT_DATA.blogs) {
        await new models.blogs(item).save();
      }
      
      // Seed recipes
      for (const item of DEFAULT_DATA.recipes) {
        await new models.recipes(item).save();
      }
      
      // Seed journey
      for (const item of DEFAULT_DATA.journey) {
        await new models.journey(item).save();
      }
      
      // Seed sustainability
      for (const item of DEFAULT_DATA.sustainability) {
        await new models.sustainability(item).save();
      }
      
      console.log('Default data seeded successfully.');
    }
  } catch (err) {
    console.error('Error during default database seeding:', err.message);
  }
}

module.exports = {
  // Get all items in a collection
  async get(collection) {
    const Model = models[collection];
    if (!Model) return [];
    try {
      const docs = await Model.find({}).lean();
      return docs.map(doc => {
        const { _id, __v, ...rest } = doc;
        return rest;
      });
    } catch (err) {
      console.error(`Error in db.get(${collection}):`, err.message);
      return [];
    }
  },

  // Get item by ID
  async getById(collection, id) {
    const Model = models[collection];
    if (!Model) return null;
    try {
      const doc = await Model.findOne({ id }).lean();
      if (!doc) return null;
      const { _id, __v, ...rest } = doc;
      return rest;
    } catch (err) {
      console.error(`Error in db.getById(${collection}, ${id}):`, err.message);
      return null;
    }
  },

  // Insert a new item
  async insert(collection, item) {
    const Model = models[collection];
    if (!Model) return null;
    try {
      // Generate simple unique ID
      const randomId = Math.random().toString(36).substring(2, 9);
      const newItem = {
        id: `${collection[0]}${randomId}`,
        date: new Date().toISOString().split('T')[0],
        ...item
      };

      const doc = new Model(newItem);
      await doc.save();
      return newItem;
    } catch (err) {
      console.error(`Error in db.insert(${collection}):`, err.message);
      return null;
    }
  },

  // Update an existing item
  async update(collection, id, updatedFields) {
    const Model = models[collection];
    if (!Model) return null;
    try {
      const doc = await Model.findOneAndUpdate(
        { id },
        { $set: updatedFields },
        { new: true }
      ).lean();
      
      if (!doc) return null;
      const { _id, __v, ...rest } = doc;
      return rest;
    } catch (err) {
      console.error(`Error in db.update(${collection}, ${id}):`, err.message);
      return null;
    }
  },

  // Delete an item
  async delete(collection, id) {
    const Model = models[collection];
    if (!Model) return false;
    try {
      const result = await Model.deleteOne({ id });
      return result.deletedCount > 0;
    } catch (err) {
      console.error(`Error in db.delete(${collection}, ${id}):`, err.message);
      return false;
    }
  },

  // Settings helpers
  async getSettings() {
    const Model = models['settings'];
    try {
      let settingsDoc = await Model.findOne({}).lean();
      if (!settingsDoc) {
        // Fallback if not seeded yet
        const defaultDoc = { ...DEFAULT_DATA.settings };
        const doc = new Model(defaultDoc);
        await doc.save();
        return defaultDoc;
      }
      const { _id, __v, ...rest } = settingsDoc;
      return rest;
    } catch (err) {
      console.error('Error in db.getSettings():', err.message);
      return DEFAULT_DATA.settings;
    }
  },

  async updateSettings(settings) {
    const Model = models['settings'];
    try {
      const doc = await Model.findOneAndUpdate(
        {},
        { $set: settings },
        { new: true, upsert: true, lean: true }
      );
      const { _id, __v, ...rest } = doc;
      return rest;
    } catch (err) {
      console.error('Error in db.updateSettings():', err.message);
      return null;
    }
  }
};
