require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
// Ensure static images folder exists
const imagesDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Configure template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Media upload helper
async function persistUploadedFile(file) {
  if (!file) return;
  try {
    const filePath = file.path;
    if (fs.existsSync(filePath)) {
      const buffer = fs.readFileSync(filePath);
      await db.saveMedia(file.filename, file.mimetype || 'image/jpeg', buffer);
    }
  } catch (err) {
    console.error('Error persisting uploaded file to MongoDB:', err.message);
  }
}

// Media file route
app.get('/uploads/:filename', async (req, res) => {
  const filename = req.params.filename;
  const localPath = path.join(uploadDir, filename);

  // If cached on local disk, serve immediately
  if (fs.existsSync(localPath)) {
    return res.sendFile(localPath);
  }

  // If not on disk, pull from MongoDB Atlas
  try {
    const media = await db.getMedia(filename);
    if (media && media.data) {
      const imgBuffer = Buffer.isBuffer(media.data) ? media.data : (media.data.buffer ? Buffer.from(media.data.buffer) : Buffer.from(media.data));
      // Write to local disk cache for fast future requests
      try {
        fs.writeFileSync(localPath, imgBuffer);
      } catch (e) {
        // Non-blocking if disk write fails
      }
      res.contentType(media.contentType || 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=31536000');
      return res.end(imgBuffer);
    }
  } catch (err) {
    console.error('Error retrieving media from MongoDB:', err);
  }

  // Media fallback
  try {
    const settings = await db.getSettings();
    if (settings && settings.chefImage && settings.chefImage.includes(filename)) {
      return res.redirect('/images/chef-portrait.jpg');
    }
  } catch (e) {}

  if (filename.toLowerCase().includes('chef')) {
    return res.redirect('/images/chef-portrait.jpg');
  }
  return res.redirect('/images/default-food.jpg');
});

// Configure Sessions
app.use(session({
  secret: 'chef-nitesh-sharma-key-2026',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 2 } // 2 hours
}));

// Share settings and session globally in templates
app.use(async (req, res, next) => {
  res.locals.settings = await db.getSettings();
  res.locals.session = req.session;
  next();
});

// Configure Multer for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only images (jpg, png, webp, gif) are allowed!'));
  }
});

// Authentication middleware
function checkAuth(req, res, next) {
  if (req.session && req.session.isAdmin) {
    return next();
  }
  res.redirect('/admin/login');
}

// Maintenance Mode Middleware
app.use((req, res, next) => {
  const isMaintenance = process.env.MAINTENANCE_MODE === 'true';
  const isAdmin = req.session && req.session.isAdmin;

  if (isMaintenance && !isAdmin) {
    // Exclude admin panel and static assets so they don't break
    const isAssetOrAdmin = 
      req.path.startsWith('/admin') || 
      req.path.startsWith('/uploads') || 
      req.path.startsWith('/css') || 
      req.path.startsWith('/js') || 
      req.path.startsWith('/images') ||
      req.path.startsWith('/favicon.ico');
      
    if (!isAssetOrAdmin) {
      res.status(503);
      return res.render('maintenance');
    }
  }
  next();
});

/* ========================================================
   PUBLIC PAGES ROUTES
   ======================================================== */

// 1. Home Page
app.get('/', async (req, res) => {
  const blogs = await db.get('blogs');
  let gallery = await db.get('gallery');
  const journey = await db.get('journey');
  const sustainability = await db.get('sustainability');

  // Filter published blogs, sort by date (descending), take top 3
  const latestBlogs = blogs
    .filter(b => b.published)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  // If gallery is empty, fall back to recipes
  if (!gallery || gallery.length === 0) {
    const recipes = await db.get('recipes');
    gallery = recipes.map(r => ({
      id: r.id,
      title: r.title,
      image: (r.images && r.images.length > 0) ? r.images[0] : '/images/default-food.jpg',
      category: r.category || 'Specialty',
      description: r.description || '',
      date: r.date
    }));
  }

  // Take top 3 dishes for gallery preview
  const featuredGallery = gallery
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    .slice(0, 3);

  // Sort journey by year desc, take top 3
  const sortedJourney = journey
    .sort((a, b) => parseInt(b.year) - parseInt(a.year))
    .slice(0, 3);

  res.render('home', {
    latestBlogs,
    featuredGallery,
    journeyPreview: sortedJourney,
    sustainabilityPreview: sustainability.slice(0, 2)
  });
});

// 2. Blog Listing Page
app.get('/blog', async (req, res) => {
  const blogs = await db.get('blogs');
  const publishedBlogs = blogs.filter(b => b.published);
  
  // Sort descending by date
  publishedBlogs.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Group blogs by year
  const blogsByYear = {};
  publishedBlogs.forEach(blog => {
    const yr = blog.year || new Date(blog.date).getFullYear().toString();
    if (!blogsByYear[yr]) {
      blogsByYear[yr] = [];
    }
    blogsByYear[yr].push(blog);
  });

  // Get years sorted descending
  const years = Object.keys(blogsByYear).sort((a, b) => parseInt(b) - parseInt(a));

  res.render('blog', { blogsByYear, years });
});

// 3. Blog Detail Page
app.get('/blog/:id', async (req, res) => {
  const blog = await db.getById('blogs', req.params.id);
  if (!blog || !blog.published) {
    return res.status(404).send('Blog Post Not Found');
  }
  
  // Get other recent posts for sidebar
  const blogs = await db.get('blogs');
  const recentBlogs = blogs
    .filter(b => b.published && b.id !== blog.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4);

  res.render('blog-detail', { blog, recentBlogs });
});

// 4. Journey Page
app.get('/journey', async (req, res) => {
  const journey = await db.get('journey');
  
  // Sort journey entries by year desc, then date desc
  journey.sort((a, b) => {
    const yrDiff = parseInt(b.year) - parseInt(a.year);
    if (yrDiff !== 0) return yrDiff;
    return new Date(b.date) - new Date(a.date);
  });

  // Group by year
  const journeyByYear = {};
  journey.forEach(entry => {
    const yr = entry.year || 'Other';
    if (!journeyByYear[yr]) {
      journeyByYear[yr] = [];
    }
    journeyByYear[yr].push(entry);
  });

  const years = Object.keys(journeyByYear).sort((a, b) => parseInt(b) - parseInt(a));

  res.render('journey', { journeyByYear, years });
});

// 5. Food Gallery Listing Page
app.get('/gallery', async (req, res) => {
  let gallery = await db.get('gallery');
  if (!gallery || gallery.length === 0) {
    const recipes = await db.get('recipes');
    gallery = recipes.map(r => ({
      id: r.id,
      title: r.title,
      image: (r.images && r.images.length > 0) ? r.images[0] : '/images/default-food.jpg',
      category: r.category || 'Specialty',
      description: r.description || '',
      date: r.date
    }));
  }

  const categoryFilter = req.query.category || 'All';
  
  // Load categories dynamically
  const dbCategories = await db.get('categories');
  const catNames = new Set(dbCategories.map(c => c.name));
  gallery.forEach(g => { if (g.category) catNames.add(g.category); });
  const categories = Array.from(catNames);

  let filteredGallery = gallery;
  if (categoryFilter !== 'All') {
    filteredGallery = gallery.filter(r => r.category && r.category.toLowerCase() === categoryFilter.toLowerCase());
  }

  // Sort by date desc
  filteredGallery.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  res.render('gallery', { 
    gallery: filteredGallery, 
    categories, 
    selectedCategory: categoryFilter 
  });
});

// Backward compatibility redirects for old recipe links
app.get('/recipes', (req, res) => res.redirect(301, '/gallery'));
app.get('/recipes/:id', (req, res) => res.redirect(301, '/gallery'));

// 7. Sustainability Page
app.get('/sustainability', async (req, res) => {
  const sustainability = await db.get('sustainability');
  res.render('sustainability', { contentBlocks: sustainability });
});

// 8. About Me Page
app.get('/about', async (req, res) => {
  res.render('about');
});

// 9. Contact Me Page
app.get('/contact', async (req, res) => {
  res.render('contact', { success: req.query.success === 'true', error: req.query.error });
});

// 10. Contact Form POST Handler
app.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.redirect('/contact?error=Missing+required+fields');
    }
    await db.insert('contacts', {
      name,
      email,
      subject: subject || 'General Inquiry',
      message,
      read: false
    });
    res.redirect('/contact?success=true');
  } catch (error) {
    res.redirect('/contact?error=Failed+to+send+message');
  }
});

// 11. Newsletter Form POST Handler
app.post('/newsletter', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    // Check if already subscribed
    const subscribers = await db.get('subscribers');
    const exists = subscribers.some(s => s.email.toLowerCase() === email.toLowerCase());
    
    if (!exists) {
      await db.insert('subscribers', { email });
    }
    
    // Check if AJAX request
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.json({ success: true, message: 'Thank you for subscribing!' });
    }
    res.redirect('/?newsletter_success=true');
  } catch (error) {
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.status(500).json({ error: 'Failed to subscribe' });
    }
    res.redirect('/?newsletter_error=true');
  }
});

/* ========================================================
   ADMIN ROUTES
   ======================================================== */

// Admin Login GET
app.get('/admin/login', (req, res) => {
  if (req.session && req.session.isAdmin) {
    return res.redirect('/admin');
  }
  res.render('admin/login', { error: req.query.error });
});

// Admin Login POST
app.post('/admin/login', async (req, res) => {
  const { password } = req.body;
  const settings = await db.getSettings();
  if (password === settings.adminPassword) {
    req.session.isAdmin = true;
    res.redirect('/admin');
  } else {
    res.redirect('/admin/login?error=Invalid+Password');
  }
});

// Admin Logout
app.get('/admin/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
});

// Admin Dashboard - Home
app.get('/admin', checkAuth, async (req, res) => {
  const blogs = await db.get('blogs');
  const gallery = await db.get('gallery');
  const contacts = await db.get('contacts');
  const subscribers = await db.get('subscribers');

  res.render('admin/dashboard', {
    blogCount: blogs.length,
    galleryCount: gallery.length,
    recipeCount: gallery.length,
    unreadEnquiries: contacts.filter(c => !c.read).length,
    subscriberCount: subscribers.length
  });
});

// --- ADMIN: BLOGS ---
app.get('/admin/blogs', checkAuth, async (req, res) => {
  const blogs = await db.get('blogs');
  blogs.sort((a, b) => new Date(b.date) - new Date(a.date));
  res.render('admin/blogs', { blogs });
});

app.get('/admin/blogs/add', checkAuth, (req, res) => {
  res.render('admin/blogs-form', { blog: null });
});

app.post('/admin/blogs/add', checkAuth, upload.single('image'), async (req, res) => {
  try {
    const { title, excerpt, content, year, published, imageUrl } = req.body;
    let image = '/images/default-food.jpg';
    
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
      await persistUploadedFile(req.file);
    } else if (imageUrl && imageUrl.trim().length > 0) {
      image = imageUrl.trim();
    }
    
    await db.insert('blogs', {
      title: title ? title.trim() : 'Untitled Post',
      excerpt: excerpt ? excerpt.trim() : '',
      content: content || '',
      year: year || new Date().getFullYear().toString(),
      published: published === 'on' || published === 'true',
      image
    });
    res.redirect('/admin/blogs');
  } catch (err) {
    console.error('Error adding blog post:', err);
    res.redirect('/admin/blogs');
  }
});

app.get('/admin/blogs/edit/:id', checkAuth, async (req, res) => {
  const blog = await db.getById('blogs', req.params.id);
  if (!blog) return res.redirect('/admin/blogs');
  res.render('admin/blogs-form', { blog });
});

app.post('/admin/blogs/edit/:id', checkAuth, upload.single('image'), async (req, res) => {
  try {
    const blog = await db.getById('blogs', req.params.id);
    if (!blog) return res.redirect('/admin/blogs');

    const { title, excerpt, content, year, published, imageUrl } = req.body;
    const updateData = {
      title: title ? title.trim() : blog.title,
      excerpt: excerpt ? excerpt.trim() : blog.excerpt,
      content: content !== undefined ? content : blog.content,
      year: year || blog.year,
      published: published === 'on' || published === 'true'
    };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
      await persistUploadedFile(req.file);
    } else if (imageUrl && imageUrl.trim().length > 0) {
      updateData.image = imageUrl.trim();
    }

    await db.update('blogs', req.params.id, updateData);
    res.redirect('/admin/blogs');
  } catch (err) {
    console.error('Error editing blog post:', err);
    res.redirect('/admin/blogs');
  }
});

app.post('/admin/blogs/delete/:id', checkAuth, async (req, res) => {
  await db.delete('blogs', req.params.id);
  res.redirect('/admin/blogs');
});


// --- ADMIN: FOOD GALLERY ---
app.get('/admin/gallery', checkAuth, async (req, res) => {
  let gallery = await db.get('gallery');
  if (!gallery || gallery.length === 0) {
    const recipes = await db.get('recipes');
    gallery = recipes.map(r => ({
      id: r.id,
      title: r.title,
      image: (r.images && r.images.length > 0) ? r.images[0] : '/images/default-food.jpg',
      category: r.category || 'Specialty',
      description: r.description || '',
      date: r.date
    }));
  }
  gallery.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  res.render('admin/gallery', { gallery });
});

app.get('/admin/gallery/add', checkAuth, async (req, res) => {
  const dbCategories = await db.get('categories');
  const categories = dbCategories.map(c => c.name);
  res.render('admin/gallery-form', { item: null, categories });
});

app.post('/admin/gallery/add', checkAuth, upload.single('image'), async (req, res) => {
  try {
    const { title, category, description, imageUrl } = req.body;
    let image = '/images/default-food.jpg';

    if (req.file) {
      image = `/uploads/${req.file.filename}`;
      await persistUploadedFile(req.file);
    } else if (imageUrl && imageUrl.trim().length > 0) {
      image = imageUrl.trim();
    }

    await db.insert('gallery', {
      title: title ? title.trim() : 'Untitled Dish',
      category: category || 'Signature',
      description: description ? description.trim() : '',
      image
    });
    res.redirect('/admin/gallery');
  } catch (err) {
    console.error('Error adding gallery dish:', err);
    res.redirect('/admin/gallery');
  }
});

app.get('/admin/gallery/edit/:id', checkAuth, async (req, res) => {
  let item = await db.getById('gallery', req.params.id);
  if (!item) {
    // Check recipes fallback
    const recipe = await db.getById('recipes', req.params.id);
    if (recipe) {
      item = {
        id: recipe.id,
        title: recipe.title,
        image: (recipe.images && recipe.images.length > 0) ? recipe.images[0] : '/images/default-food.jpg',
        category: recipe.category || 'Specialty',
        description: recipe.description || ''
      };
    }
  }
  if (!item) return res.redirect('/admin/gallery');
  const dbCategories = await db.get('categories');
  const categories = dbCategories.map(c => c.name);
  res.render('admin/gallery-form', { item, categories });
});

app.post('/admin/gallery/edit/:id', checkAuth, upload.single('image'), async (req, res) => {
  try {
    let item = await db.getById('gallery', req.params.id);
    const { title, category, description, imageUrl } = req.body;

    const updateData = {
      title: title ? title.trim() : (item ? item.title : 'Untitled Dish'),
      category: category || (item ? item.category : 'Signature'),
      description: description !== undefined ? description.trim() : (item ? item.description : '')
    };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
      await persistUploadedFile(req.file);
    } else if (imageUrl && imageUrl.trim().length > 0) {
      updateData.image = imageUrl.trim();
    }

    if (item) {
      await db.update('gallery', req.params.id, updateData);
    } else {
      await db.insert('gallery', { id: req.params.id, ...updateData });
    }
    res.redirect('/admin/gallery');
  } catch (err) {
    console.error('Error editing gallery dish:', err);
    res.redirect('/admin/gallery');
  }
});

app.post('/admin/gallery/delete/:id', checkAuth, async (req, res) => {
  await db.delete('gallery', req.params.id);
  await db.delete('recipes', req.params.id);
  res.redirect('/admin/gallery');
});

// Admin recipes backward compatibility redirects
app.get('/admin/recipes', (req, res) => res.redirect('/admin/gallery'));
app.get('/admin/recipes/*', (req, res) => res.redirect('/admin/gallery'));


// --- ADMIN: RECIPES CATEGORIES ---
app.get('/admin/categories', checkAuth, async (req, res) => {
  const categories = await db.get('categories');
  res.render('admin/categories', { categories, error: req.query.error });
});

app.post('/admin/categories/add', checkAuth, async (req, res) => {
  const { name } = req.body;
  if (!name || name.trim().length === 0) {
    return res.redirect('/admin/categories?error=Category+name+is+required');
  }
  
  // Check duplicate
  const categories = await db.get('categories');
  const duplicate = categories.some(c => c.name.toLowerCase() === name.trim().toLowerCase());
  if (duplicate) {
    return res.redirect('/admin/categories?error=Category+already+exists');
  }

  await db.insert('categories', { name: name.trim() });
  res.redirect('/admin/categories');
});

app.post('/admin/categories/delete/:id', checkAuth, async (req, res) => {
  await db.delete('categories', req.params.id);
  res.redirect('/admin/categories');
});

app.post('/admin/categories/add-json', checkAuth, async (req, res) => {
  const { name } = req.body;
  if (!name || name.trim().length === 0) {
    return res.status(400).json({ error: 'Category name is required' });
  }
  
  const categories = await db.get('categories');
  const duplicate = categories.some(c => c.name.toLowerCase() === name.trim().toLowerCase());
  if (duplicate) {
    return res.status(400).json({ error: 'Category already exists' });
  }

  const newCat = await db.insert('categories', { name: name.trim() });
  res.json({ success: true, category: newCat });
});

app.post('/admin/recipes/delete/:id', checkAuth, async (req, res) => {
  await db.delete('recipes', req.params.id);
  res.redirect('/admin/recipes');
});


// --- ADMIN: JOURNEY ---
app.get('/admin/journey', checkAuth, async (req, res) => {
  const journey = await db.get('journey');
  journey.sort((a, b) => parseInt(b.year) - parseInt(a.year));
  res.render('admin/journey', { journey });
});

app.post('/admin/journey/add', checkAuth, async (req, res) => {
  const { year, title, company, description } = req.body;
  await db.insert('journey', { year, title, company, description });
  res.redirect('/admin/journey');
});

app.post('/admin/journey/edit/:id', checkAuth, async (req, res) => {
  const { year, title, company, description } = req.body;
  await db.update('journey', req.params.id, { year, title, company, description });
  res.redirect('/admin/journey');
});

app.post('/admin/journey/delete/:id', checkAuth, async (req, res) => {
  await db.delete('journey', req.params.id);
  res.redirect('/admin/journey');
});


// --- ADMIN: SUSTAINABILITY ---
app.get('/admin/sustainability', checkAuth, async (req, res) => {
  const sustainability = await db.get('sustainability');
  res.render('admin/sustainability', { blocks: sustainability });
});

app.post('/admin/sustainability/add', checkAuth, upload.single('image'), async (req, res) => {
  const { title, content } = req.body;
  let image = '/images/default-sustainability.jpg';
  if (req.file) {
    image = `/uploads/${req.file.filename}`;
    await persistUploadedFile(req.file);
  }
  await db.insert('sustainability', { title, content, image });
  res.redirect('/admin/sustainability');
});

app.post('/admin/sustainability/edit/:id', checkAuth, upload.single('image'), async (req, res) => {
  const { title, content } = req.body;
  const updateData = { title, content };
  if (req.file) {
    updateData.image = `/uploads/${req.file.filename}`;
    await persistUploadedFile(req.file);
  }
  await db.update('sustainability', req.params.id, updateData);
  res.redirect('/admin/sustainability');
});

app.post('/admin/sustainability/delete/:id', checkAuth, async (req, res) => {
  await db.delete('sustainability', req.params.id);
  res.redirect('/admin/sustainability');
});


// --- ADMIN: MEDIA GALLERY ---
app.get('/admin/media', checkAuth, async (req, res) => {
  try {
    let diskFiles = [];
    if (fs.existsSync(uploadDir)) {
      diskFiles = fs.readdirSync(uploadDir).filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file));
    }
    const dbFilenames = await db.getAllMediaFilenames();
    const allFiles = Array.from(new Set([...diskFiles, ...dbFilenames]));
    const imageUrls = allFiles.map(file => `/uploads/${file}`);
    res.render('admin/media', { images: imageUrls, error: null });
  } catch (err) {
    res.render('admin/media', { images: [], error: 'Failed to read media folder' });
  }
});

app.post('/admin/media/upload', checkAuth, upload.single('mediafile'), async (req, res) => {
  if (req.file) {
    await persistUploadedFile(req.file);
  }
  res.redirect('/admin/media');
});

app.post('/admin/media/delete', checkAuth, async (req, res) => {
  const { imagePath } = req.body;
  if (!imagePath || !imagePath.startsWith('/uploads/')) {
    return res.redirect('/admin/media');
  }
  const filename = path.basename(imagePath);
  const fullPath = path.join(__dirname, 'public', imagePath);
  fs.unlink(fullPath, () => {});
  await db.deleteMedia(filename);
  res.redirect('/admin/media');
});


// --- ADMIN: CONTACT ENQUIRIES ---
app.get('/admin/contacts', checkAuth, async (req, res) => {
  const contacts = await db.get('contacts');
  contacts.sort((a, b) => new Date(b.date) - new Date(a.date));
  res.render('admin/contacts', { enquiries: contacts });
});

app.post('/admin/contacts/read/:id', checkAuth, async (req, res) => {
  await db.update('contacts', req.params.id, { read: true });
  res.redirect('/admin/contacts');
});

app.post('/admin/contacts/delete/:id', checkAuth, async (req, res) => {
  await db.delete('contacts', req.params.id);
  res.redirect('/admin/contacts');
});


// --- ADMIN: NEWSLETTER SUBSCRIBERS ---
app.get('/admin/newsletter', checkAuth, async (req, res) => {
  const subscribers = await db.get('subscribers');
  subscribers.sort((a, b) => new Date(b.date) - new Date(a.date));
  res.render('admin/newsletter', { subscribers });
});

app.post('/admin/newsletter/delete/:id', checkAuth, async (req, res) => {
  await db.delete('subscribers', req.params.id);
  res.redirect('/admin/newsletter');
});


// --- ADMIN: SETTINGS ---
app.post('/admin/settings', checkAuth, upload.single('chefImage'), async (req, res) => {
  const { 
    brandName, shortDescription, tagline, adminPassword,
    galleryHeading, gallerySubtitle,
    recipeHeading, recipeSubtitle,
    blogHeading, blogSubtitle,
    journeyHeading, journeySubtitle,
    sustainabilityHeading, sustainabilitySubtitle,
    aboutHeading, aboutSubtitle,
    contactHeading, contactSubtitle,
    aboutTitleTag, aboutQuote, aboutHighlightText,
    aboutBioParagraph1, aboutBioParagraph2,
    aboutSignatureName, aboutSignatureTitle,
    contactPhone, contactWhatsapp, contactEmail, contactLinkedin,
    
    aboutSpecialty1Title, aboutSpecialty1Desc,
    aboutSpecialty2Title, aboutSpecialty2Desc,
    aboutSpecialty3Title, aboutSpecialty3Desc,
    aboutSpecialty4Title, aboutSpecialty4Desc,
    contactIntroTitle, contactIntroText,
    contactNewsletterTitle, contactNewsletterText
  } = req.body;
  
  const updateData = { 
    brandName, shortDescription, tagline,
    galleryHeading: galleryHeading || recipeHeading,
    gallerySubtitle: gallerySubtitle || recipeSubtitle,
    recipeHeading: galleryHeading || recipeHeading,
    recipeSubtitle: gallerySubtitle || recipeSubtitle,
    blogHeading, blogSubtitle,
    journeyHeading, journeySubtitle,
    sustainabilityHeading, sustainabilitySubtitle,
    aboutHeading, aboutSubtitle,
    contactHeading, contactSubtitle,
    aboutTitleTag, aboutQuote, aboutHighlightText,
    aboutBioParagraph1, aboutBioParagraph2,
    aboutSignatureName, aboutSignatureTitle,
    contactPhone, contactWhatsapp, contactEmail, contactLinkedin,
    
    aboutSpecialty1Title, aboutSpecialty1Desc,
    aboutSpecialty2Title, aboutSpecialty2Desc,
    aboutSpecialty3Title, aboutSpecialty3Desc,
    aboutSpecialty4Title, aboutSpecialty4Desc,
    contactIntroTitle, contactIntroText,
    contactNewsletterTitle, contactNewsletterText
  };

  if (req.file) {
    updateData.chefImage = `/uploads/${req.file.filename}`;
    await persistUploadedFile(req.file);
  }

  if (adminPassword && adminPassword.trim().length > 0) {
    updateData.adminPassword = adminPassword;
  }
  await db.updateSettings(updateData);
  res.redirect('/admin');
});


// 404 handler
app.use((req, res) => {
  res.status(404).send('Page Not Found');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Chef Nitesh Sharma Website running on http://localhost:${PORT}`);
});
