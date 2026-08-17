const fs = require('fs').promises;
const path = require('path');

const DB_FILE = path.join(__dirname, 'data.json');

// Default initial database content
const DEFAULT_DATA = {
  settings: {
    adminPassword: 'chefadmin2026',
    brandName: 'Chef Nitesh Sharma',
    shortDescription: 'Aroma of Life by Chef Nitesh Sharma',
    tagline: 'Crafting Stories on a Plate'
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
      date: '2026-08-12'
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
      date: '2026-08-11'
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
      date: '2026-07-28'
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
  subscribers: []
};

let cachedData = null;

// Read database from file (uses cache if loaded)
async function readDb() {
  if (cachedData) return cachedData;
  try {
    const data = await fs.readFile(DB_FILE, 'utf8');
    cachedData = JSON.parse(data);
    return cachedData;
  } catch (error) {
    // If file doesn't exist, create it with default data
    await writeDb(DEFAULT_DATA);
    cachedData = DEFAULT_DATA;
    return cachedData;
  }
}

// Write database to file
async function writeDb(data) {
  cachedData = data;
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = {
  // Get all items in a collection
  async get(collection) {
    const db = await readDb();
    return db[collection] || [];
  },

  // Get item by ID
  async getById(collection, id) {
    const items = await this.get(collection);
    return items.find(item => item.id === id);
  },

  // Insert a new item
  async insert(collection, item) {
    const db = await readDb();
    if (!db[collection]) db[collection] = [];
    
    // Generate simple unique ID
    const randomId = Math.random().toString(36).substring(2, 9);
    const newItem = {
      id: `${collection[0]}${randomId}`,
      date: new Date().toISOString().split('T')[0],
      ...item
    };
    
    db[collection].push(newItem);
    await writeDb(db);
    return newItem;
  },

  // Update an existing item
  async update(collection, id, updatedFields) {
    const db = await readDb();
    if (!db[collection]) return null;
    
    const index = db[collection].findIndex(item => item.id === id);
    if (index === -1) return null;
    
    db[collection][index] = {
      ...db[collection][index],
      ...updatedFields
    };
    
    await writeDb(db);
    return db[collection][index];
  },

  // Delete an item
  async delete(collection, id) {
    const db = await readDb();
    if (!db[collection]) return false;
    
    const lengthBefore = db[collection].length;
    db[collection] = db[collection].filter(item => item.id !== id);
    
    if (db[collection].length < lengthBefore) {
      await writeDb(db);
      return true;
    }
    return false;
  },

  // Settings helpers
  async getSettings() {
    const db = await readDb();
    return db.settings;
  },

  async updateSettings(settings) {
    const db = await readDb();
    db.settings = { ...db.settings, ...settings };
    await writeDb(db);
    return db.settings;
  }
};
