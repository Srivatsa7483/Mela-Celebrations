import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, "db.json");

const app = express();
const PORT = process.env.PORT || 5001;

const smtpConfig = {
  host: process.env.SMTP_HOST || process.env.EMAIL_HOST || "",
  port: Number(process.env.SMTP_PORT || process.env.EMAIL_PORT || 587),
  secure: process.env.SMTP_SECURE === "true" || process.env.EMAIL_SECURE === "true",
  auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  } : process.env.EMAIL_USER && process.env.EMAIL_PASS ? {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  } : undefined,
};

const emailTransporter = smtpConfig.host && smtpConfig.auth ? nodemailer.createTransport(smtpConfig) : null;
const isEmailConfigured = Boolean(emailTransporter);

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

function renderServiceItems(booking) {
  if (!booking.selectedServices || booking.selectedServices.length === 0) {
    return "<tr><td colspan=2 style=\"padding:8px 0;\">None</td></tr>";
  }

  return booking.selectedServices.map((service, index) => `
      <tr>
        <td style="padding:8px 0;">${index + 1}. ${service.name}</td>
        <td style="padding:8px 0; text-align:right;">₹${Number(service.price || 0).toLocaleString("en-IN")}</td>
      </tr>`).join("");
}

function createInvoiceText(booking) {
  const itemsText = booking.selectedServices && booking.selectedServices.length > 0
    ? booking.selectedServices.map(s => `   - ${s.name}: ₹${Number(s.price || 0).toLocaleString("en-IN")}`).join("\n")
    : "   None";

  return `Booking Confirmation & Invoice\n\n` +
         `Booking ID: ${booking.id}\n` +
         `Event Date: ${booking.date}\n` +
         `Venue: ${booking.venue}\n\n` +
         `ITEMIZED CHARGES:\n` +
         `1. Base Package (${booking.packageName || "Custom Consultation"}): ₹${Number(booking.packagePrice || 0).toLocaleString("en-IN")}\n` +
         `2. Selected Add-ons:\n${itemsText}\n\n` +
         `Subtotal: ₹${Number(booking.subtotal || 0).toLocaleString("en-IN")}\n` +
         `${booking.discountAmount > 0 ? `Discount Applied (${booking.activeCoupon || "Coupon"}): -₹${Number(booking.discountAmount).toLocaleString("en-IN")}\n` : ""}` +
         `Final Total: ₹${Number(booking.finalPrice || 0).toLocaleString("en-IN")}\n\n` +
         `Status: ${booking.status.toUpperCase()}\n` +
         `Tracking URL: http://localhost:5173/dashboard\n\n` +
         `If you have any questions, please reply to this email.\n`;
}

async function sendBookingConfirmationEmail(booking) {
  const subject = `Booking Confirmed & Invoice - Mela Celebrations! (${booking.id})`;
  const invoiceUrl = process.env.INVOICE_URL || "http://localhost:5173/dashboard";

  const html = `
  <div style="font-family:Arial, sans-serif; color:#333; line-height:1.5;">
    <h2 style="color:#0c4a6e;">Booking Confirmation & Invoice</h2>
    <p>Dear ${booking.name},</p>
    <p>Thank you for booking with <strong>Mela Celebrations</strong>. We are thrilled to support your event.</p>
    <h3 style="margin-top:24px;">Invoice Summary</h3>
    <table style="width:100%; border-collapse:collapse;">
      <tr>
        <td style="padding:8px 0; font-weight:600; width:140px;">Booking ID:</td>
        <td>${booking.id}</td>
      </tr>
      <tr>
        <td style="padding:8px 0; font-weight:600;">Event Date:</td>
        <td>${booking.date}</td>
      </tr>
      <tr>
        <td style="padding:8px 0; font-weight:600;">Venue:</td>
        <td>${booking.venue}</td>
      </tr>
    </table>

    <h3 style="margin-top:24px;">Itemized Charges</h3>
    <table style="width:100%; border-collapse:collapse;">
      <tr>
        <td style="padding:8px 0;">Base Package (${booking.packageName || "Custom Consultation"})</td>
        <td style="padding:8px 0; text-align:right;">₹${Number(booking.packagePrice || 0).toLocaleString("en-IN")}</td>
      </tr>
      ${renderServiceItems(booking)}
      <tr>
        <td style="padding:12px 0; border-top:1px solid #ddd; font-weight:600;">Subtotal</td>
        <td style="padding:12px 0; text-align:right; border-top:1px solid #ddd;">₹${Number(booking.subtotal || 0).toLocaleString("en-IN")}</td>
      </tr>
      ${booking.discountAmount > 0 ? `
      <tr>
        <td style="padding:8px 0; color:#0b6623;">Discount (${booking.activeCoupon || "Coupon"})</td>
        <td style="padding:8px 0; text-align:right; color:#0b6623;">-₹${Number(booking.discountAmount).toLocaleString("en-IN")}</td>
      </tr>` : ""}
      <tr>
        <td style="padding:12px 0; font-weight:700;">Final Total</td>
        <td style="padding:12px 0; text-align:right; font-weight:700;">₹${Number(booking.finalPrice || 0).toLocaleString("en-IN")}</td>
      </tr>
    </table>

    <p style="margin-top:24px;">Status: <strong>${booking.status.toUpperCase()}</strong></p>
    <p style="margin-top:8px;">Manage your booking: <a href="${invoiceUrl}" style="color:#2563eb;">View your dashboard</a></p>
    <p>If you have any questions, feel free to reply to this email.</p>
    <p>Best regards,<br>The Mela Celebrations Team</p>
  </div>
  `;

  const mailOptions = {
    from: process.env.EMAIL_FROM || "Mela Celebrations <no-reply@melacelebrations.com>",
    to: booking.email,
    subject,
    text: createInvoiceText(booking),
    html,
    replyTo: process.env.EMAIL_REPLY_TO || process.env.SMTP_USER,
  };

  if (!isEmailConfigured) {
    console.warn("⚠️ SMTP not configured. Falling back to logging the email to console.");
    logSimulatedEmail(booking);
    return;
  }

  try {
    const info = await emailTransporter.sendMail(mailOptions);
    console.log(`📧 Booking confirmation email sent to ${booking.email} (${info.messageId})`);
  } catch (error) {
    console.error("Failed to send booking confirmation email:", error);
    logSimulatedEmail(booking);
  }
}

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

    // Send booking confirmation email (real SMTP if configured, otherwise logs email)
    await sendBookingConfirmationEmail(newBooking);

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
