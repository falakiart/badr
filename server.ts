import express from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

// Setup directories for uploads and persistent data
const uploadsDir = path.join(process.cwd(), "uploads");
const dataDir = path.join(process.cwd(), "data");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Multer storage configuration for direct file uploads (photos and videos)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || (file.mimetype.startsWith("video/") ? ".mp4" : ".jpg");
    const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${baseName}_${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 120 * 1024 * 1024, // 120MB limit for high-res photos and videos
  },
});

// Middleware for parsing JSON with high limit for base64 uploads
app.use(express.json({ limit: "120mb" }));
app.use(express.urlencoded({ extended: true, limit: "120mb" }));

// Serve uploaded static files publicly for all site visitors
app.use("/uploads", express.static(uploadsDir));

// File path for site store
const STORE_FILE = path.join(dataDir, "site-data.json");

// Default initial data if store is fresh
const defaultStore = {
  galleryImages: [
    {
      id: "g1",
      title: "Product Bottle",
      url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1000",
      alt: "Leave-In Hair Mousse Bottle Cactus Oil & Aloe Vera",
    },
    {
      id: "g2",
      title: "Texture & Foam",
      url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=1000",
      alt: "Lightweight foam texture dispensed in palm",
    },
    {
      id: "g3",
      title: "Natural Ingredients",
      url: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=1000",
      alt: "Prickly pear cactus fruit and fresh aloe vera leaves",
    },
    {
      id: "g4",
      title: "Hair Result",
      url: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=1000",
      alt: "Hydrated glossy waves without frizz",
    },
  ],
  theme: {
    preset: "botanical",
    primaryColor: "#2F3E30",
    accentColor: "#8AA48A",
    bgColor: "#FDFCFB",
    textColor: "#2D332D",
    cardBg: "#F4F1ED",
    showCodForm: true,
    showStockTimer: true,
    showLiveSales: true,
    showStickyBar: true,
    showVideoSection: true,
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-brushing-her-long-shiny-hair-41126-large.mp4",
    videoTitle: "شاهد طريقة الاستعمال والنتيجة الفورية على الشعر",
    videoSubtitle: "شاهدي كيف تمنح رغوة الماوس بزيت الصبار والألوفيرا ترطيباً عميقاً ولمعاناً حريرياً بدون دهون في أقل من دقيقة واحدة.",
    videoLoop: true,
    videoAutoplay: true,
    videoShowcaseMode: true,
    freeShippingThresholdMAD: 300,
    logoText: "vola.ma",
    logoUrl: "",
    whatsappNumber: "212600000000",
  },
  bundles: [
    {
      id: "bundle-1",
      title: "1 Bottle (Try & Test)",
      subtitle: "Standard 150ml Pack",
      bottles: 1,
      originalPriceMAD: 299,
      priceMAD: 199,
      freeShipping: false,
      gift: "Includes Free Beauty E-Guide",
    },
    {
      id: "bundle-2",
      title: "2 Bottles (Duo Pack)",
      subtitle: "Most Popular Choice",
      bottles: 2,
      originalPriceMAD: 598,
      priceMAD: 329,
      badge: "🔥 BEST SELLER - SAVE 45%",
      popular: true,
      freeShipping: true,
      gift: "FREE Express Delivery + Hair Scalp Brush",
    },
    {
      id: "bundle-3",
      title: "3 Bottles (BUY 2 GET 1 FREE)",
      subtitle: "Ultimate Hair Care Value",
      bottles: 3,
      originalPriceMAD: 897,
      priceMAD: 399,
      badge: "🎁 BUY 2 GET 1 FREE (SAVE 55%)",
      popular: false,
      freeShipping: true,
      gift: "FREE Express Shipping + Satin Hair Scrunchie Set",
    },
  ],
  reviewsList: [
    {
      id: "rev-1",
      author: "Sanaa M.",
      city: "Casablanca",
      rating: 5,
      date: "2 days ago",
      comment: "Waw wallahila top! Hair becomes super soft without feeling oily or heavy. My curls look bouncy and defined all day long. Delivery in Casablanca was under 24 hours!",
      hairType: "Curly 3B Hair",
      verified: true,
      helpfulCount: 34,
      imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: "rev-2",
      author: "Houda B.",
      city: "Rabat",
      rating: 5,
      date: "4 days ago",
      comment: "The combination of Cactus Oil & Aloe Vera is brilliant. I used to suffer from extreme humidity frizz in Rabat, but 3 pumps of this mousse completely fixed it. Will definitely reorder the 3 bottle bundle!",
      hairType: "Wavy & Frizzy Hair",
      verified: true,
      helpfulCount: 28,
      imageUrl: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: "rev-3",
      author: "Yasmine K.",
      city: "Marrakech",
      rating: 5,
      date: "1 week ago",
      comment: "Zero crunchy feeling! I hate old traditional mousses that make hair hard like wire. This one is like a hydrating cloud. Smell is so refreshing and natural.",
      hairType: "Fine & Dry Hair",
      verified: true,
      helpfulCount: 19,
      imageUrl: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: "rev-4",
      author: "Khadija T.",
      city: "Agadir",
      rating: 5,
      date: "1 week ago",
      comment: "Super fast Cash on Delivery in Agadir. Packaging is high quality and the foam dispenser pumps smoothly. Hair feels silky immediately.",
      hairType: "Bleached & Damaged",
      verified: true,
      helpfulCount: 15,
      imageUrl: "https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: "rev-5",
      author: "Meriem L.",
      city: "Tangier",
      rating: 4,
      date: "2 weeks ago",
      comment: "Very good product for daily use. I use 2 pumps every morning after shower. Keeps flyaways tame all day. Highly recommended!",
      hairType: "Coily 4A Hair",
      verified: true,
      helpfulCount: 12,
      imageUrl: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80&w=600",
    },
  ],
  orders: [
    {
      id: "ord-101",
      orderNumber: "PB-482910",
      customerName: "Fatima-Zahra El Amrani",
      phone: "+212 661234567",
      city: "Casablanca",
      address: "Avenue 2 Mars, Residence El Nakhil, Appt 4",
      bundle: {
        id: "bundle-2",
        title: "2 Bottles (Duo Pack)",
        subtitle: "Most Popular Choice",
        bottles: 2,
        originalPriceMAD: 598,
        priceMAD: 329,
        badge: "🔥 BEST SELLER - SAVE 45%",
        popular: true,
        freeShipping: true,
        gift: "FREE Express Delivery + Hair Scalp Brush",
      },
      totalMAD: 329,
      paymentMethod: "cod",
      createdAt: "10:42 AM",
      fullDate: "Jul 29, 2026",
      status: "pending",
      notes: "Please call 30 mins before arrival",
    },
  ],
};

function readStore() {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const data = fs.readFileSync(STORE_FILE, "utf-8");
      return { ...defaultStore, ...JSON.parse(data) };
    }
  } catch (err) {
    console.error("Error reading site store:", err);
  }
  return defaultStore;
}

function writeStore(data: any) {
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error writing site store:", err);
    return false;
  }
}

// Ensure store file exists on startup
if (!fs.existsSync(STORE_FILE)) {
  writeStore(defaultStore);
}

// ================= API ROUTES =================

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// GET site data: Available for EVERY visitor across all devices
app.get("/api/site-data", (req, res) => {
  const store = readStore();
  res.json({
    success: true,
    data: store,
  });
});

// POST site data: Update gallery, theme, bundles, reviews, orders
app.post("/api/site-data", (req, res) => {
  try {
    const current = readStore();
    const updated = {
      ...current,
      ...req.body,
    };
    writeStore(updated);
    res.json({ success: true, message: "Site data updated successfully for all visitors" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to update site data" });
  }
});

// POST new order from customer (Cash on Delivery)
app.post("/api/orders", (req, res) => {
  try {
    const newOrder = req.body;
    if (!newOrder || !newOrder.customerName || !newOrder.phone) {
      return res.status(400).json({ success: false, error: "Missing required order fields" });
    }
    const current = readStore();
    const orders = [newOrder, ...(current.orders || [])];
    current.orders = orders;
    writeStore(current);
    res.json({ success: true, order: newOrder });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to save order" });
  }
});

// Upload endpoint supporting Multipart (Multer) OR Base64 JSON
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    // 1. Handled via Multer (multipart/form-data)
    if (req.file) {
      const publicUrl = `/uploads/${req.file.filename}`;
      return res.json({
        success: true,
        url: publicUrl,
        filename: req.file.filename,
        size: req.file.size,
      });
    }

    // 2. Handled via JSON body (Base64 data URL)
    const { data, filename, mimeType } = req.body;
    if (data && typeof data === "string") {
      const matches = data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      let buffer: Buffer;
      let extension = ".jpg";

      if (matches && matches.length === 3) {
        const type = matches[1];
        buffer = Buffer.from(matches[2], "base64");
        if (type.includes("png")) extension = ".png";
        else if (type.includes("webp")) extension = ".webp";
        else if (type.includes("mp4")) extension = ".mp4";
        else if (type.includes("webm")) extension = ".webm";
        else if (type.includes("quicktime")) extension = ".mov";
      } else {
        buffer = Buffer.from(data, "base64");
        if (mimeType?.includes("video") || filename?.endsWith(".mp4")) extension = ".mp4";
      }

      const safeBase = filename
        ? path.basename(filename, path.extname(filename)).replace(/[^a-zA-Z0-9_-]/g, "_")
        : "upload";
      const generatedName = `${safeBase}_${Date.now()}_${Math.round(Math.random() * 1e5)}${extension}`;
      const destPath = path.join(uploadsDir, generatedName);

      await fs.promises.writeFile(destPath, buffer);
      const publicUrl = `/uploads/${generatedName}`;

      return res.json({
        success: true,
        url: publicUrl,
        filename: generatedName,
        size: buffer.length,
      });
    }

    return res.status(400).json({ success: false, error: "No file or data provided" });
  } catch (err: any) {
    console.error("Upload error:", err);
    res.status(500).json({ success: false, error: err.message || "Failed to upload file" });
  }
});

// Start Server with Vite middleware in dev or static files in prod
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
