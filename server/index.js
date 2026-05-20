import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, "db.json");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Helper function to write DB
async function writeDB(data) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf8");
}

// Helper function to automatically update booking status based on calendar dates
async function checkAndAutoUpdateStatuses(db) {
  const today = new Date();
  // Strip time for clean midnight date comparisons
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  let modified = false;

  if (db.bookings && Array.isArray(db.bookings)) {
    db.bookings = db.bookings.map(b => {
      if (!b.date) return b;
      
      // Parse the date (format YYYY-MM-DD)
      const eventDate = new Date(b.date);
      if (isNaN(eventDate.getTime())) return b;

      const eventMidnight = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate()).getTime();

      // Automation Transitions:
      // 1. Confirmed -> In Progress (when event day arrives)
      if (b.status === "Confirmed" && todayMidnight === eventMidnight) {
        b.status = "In Progress";
        modified = true;
        console.log(`🤖 [Date Automation] Booking ${b.id} set to 'In Progress' (Event is today: ${b.date})`);
      }
      // 2. Confirmed or In Progress -> Completed (when event day passes)
      else if ((b.status === "Confirmed" || b.status === "In Progress") && todayMidnight > eventMidnight) {
        b.status = "Completed";
        modified = true;
        console.log(`🤖 [Date Automation] Booking ${b.id} set to 'Completed' (Event has passed: ${b.date})`);
      }
      
      return b;
    });
  }

  if (modified) {
    // Write directly to file (avoiding loops, writeDB does not readDB)
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf8");
  }
  return db;
}

// Helper function to read DB
async function readDB(skipAutoUpdate = false) {
  try {
    const data = await fs.readFile(DB_PATH, "utf8");
    let db = JSON.parse(data);
    if (!skipAutoUpdate && db.bookings && db.bookings.length > 0) {
      db = await checkAndAutoUpdateStatuses(db);
    }
    return db;
  } catch (error) {
    console.error("Error reading database file, creating a new one...", error);
    const initialData = { users: [], bookings: [], coupons: [] };
    await writeDB(initialData);
    return initialData;
  }
}

// Simulated Email Sender (logs to console)
function logSimulatedEmail(booking) {
  const emailHtml = `
=========================================
📧 EMAIL NOTIFICATION: BOOKING CONFIRMATION
To: ${booking.email}
Subject: Booking Confirmed & Invoice - Mela Celebrations! (${booking.id})
=========================================
Dear ${booking.name},

Thank you for booking with Mela Celebrations! We are excited to make your event extraordinary.

--- INVOICE SUMMARY ---
Booking ID:   ${booking.id}
Event Date:   ${booking.date}
Venue:        ${booking.venue}

ITEMIZED CHARGES:
1. Base Package (${booking.packageName || "Custom consultation"}): ₹${(booking.packagePrice || 0).toLocaleString("en-IN")}
2. Selected Add-ons:
${booking.selectedServices && booking.selectedServices.length > 0
  ? booking.selectedServices.map(s => `   - ${s.name}: ₹${s.price.toLocaleString("en-IN")}`).join("\n")
  : "   None"}

Subtotal:     ₹${(booking.subtotal || 0).toLocaleString("en-IN")}
${booking.discountAmount > 0 ? `Discount Applied (${booking.activeCoupon || "Coupon"}): -₹${booking.discountAmount.toLocaleString("en-IN")}\n` : ""}Final Total:  ₹${(booking.finalPrice || 0).toLocaleString("en-IN")}

Status:       ${booking.status.toUpperCase()}
Tracking URL: http://localhost:5173/dashboard

If you have any questions, click the WhatsApp button on our website or reply to this email.

Best Regards,
The Mela Celebrations Team
=========================================
`;
  console.log(emailHtml);
}

// --- API ENDPOINTS ---

// Auth Endpoints
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: "Missing required registration details" });
    }

    const db = await readDB();
    const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ error: "A user with this email already exists" });
    }

    const newUser = {
      id: "usr_" + Date.now().toString(36),
      name,
      email: email.toLowerCase(),
      phone,
      password: Buffer.from(password).toString("base64") // basic local obscuring
    };

    db.users.push(newUser);
    await writeDB(db);

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ message: "Registration successful", user: userWithoutPassword });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ error: "Server registration error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const db = await readDB();
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const decodedPassword = Buffer.from(user.password, "base64").toString("utf-8");
    if (password !== decodedPassword) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({
      message: "Login successful",
      user: userWithoutPassword,
      token: "mock_jwt_" + user.id
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Server login error" });
  }
});

// Bookings Endpoints
app.post("/api/bookings", async (req, res) => {
  try {
    const {
      name, email, phone, date, venue, message,
      designId, packageName, packagePrice,
      selectedServices, subtotal, discountAmount, finalPrice, activeCoupon
    } = req.body;

    if (!name || !email || !phone || !date || !venue) {
      return res.status(400).json({ error: "Missing required booking information" });
    }

    const db = await readDB();
    const newBooking = {
      id: "MELA-" + Math.floor(1000 + Math.random() * 9000),
      name,
      email: email.toLowerCase(),
      phone,
      date,
      venue,
      message: message || "",
      designId: designId ? Number(designId) : null,
      packageName: packageName || "Custom Consultation",
      packagePrice: Number(packagePrice) || 0,
      selectedServices: selectedServices || [],
      subtotal: Number(subtotal) || 0,
      discountAmount: Number(discountAmount) || 0,
      finalPrice: Number(finalPrice) || 0,
      activeCoupon: activeCoupon || "",
      status: "Pending",
      createdAt: new Date().toISOString()
    };

    db.bookings.push(newBooking);
    await writeDB(db);

    // Send mock email
    logSimulatedEmail(newBooking);

    res.status(201).json({ message: "Booking confirmed successfully", booking: newBooking });
  } catch (error) {
    console.error("Create Booking Error:", error);
    res.status(500).json({ error: "Server error creating booking" });
  }
});

app.get("/api/bookings/user/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const db = await readDB();
    const userBookings = db.bookings.filter(b => b.email.toLowerCase() === email.toLowerCase());
    res.status(200).json(userBookings);
  } catch (error) {
    console.error("Get User Bookings Error:", error);
    res.status(500).json({ error: "Server error retrieving bookings" });
  }
});

app.get("/api/bookings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const db = await readDB();
    const booking = db.bookings.find(b => b.id.toUpperCase() === id.toUpperCase());
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.status(200).json(booking);
  } catch (error) {
    console.error("Get Booking Error:", error);
    res.status(500).json({ error: "Server error retrieving booking details" });
  }
});

app.put("/api/bookings/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ["Pending", "Confirmed", "In Progress", "Completed"];
    
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const db = await readDB();
    const index = db.bookings.findIndex(b => b.id.toUpperCase() === id.toUpperCase());
    if (index === -1) {
      return res.status(404).json({ error: "Booking not found" });
    }

    db.bookings[index].status = status;
    await writeDB(db);

    res.status(200).json({ message: "Status updated successfully", booking: db.bookings[index] });
  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({ error: "Server error updating status" });
  }
});

// Coupon Validate Endpoint (handles both route forms)
const handleValidateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ error: "Coupon code is required" });
    }

    const db = await readDB();
    const coupon = db.coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!coupon) {
      return res.status(400).json({ error: "Invalid coupon code" });
    }

    res.status(200).json(coupon);
  } catch (error) {
    console.error("Validate Coupon Error:", error);
    res.status(500).json({ error: "Server coupon validation error" });
  }
};

app.post("/api/coupons/validate", handleValidateCoupon);
app.post("/api/bookings/validate-coupon", handleValidateCoupon);

app.get("/api/coupons", async (req, res) => {
  try {
    const db = await readDB();
    res.status(200).json(db.coupons);
  } catch (error) {
    res.status(500).json({ error: "Server error fetching coupons" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Mela Celebrations Backend running on http://localhost:${PORT}`);
});
