import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dns from "dns";
import { connectDB, getDB } from "./db.js";


dotenv.config();

// Globally prefer IPv4 over IPv6 in DNS resolution to prevent ENETUNREACH errors on Render
dns.setDefaultResultOrder("ipv4first");

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || "mela_dev_secret_change_in_production";
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "http://localhost:5173";
const APP_URL = process.env.INVOICE_URL || "http://localhost:5173/dashboard";

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman) or matching origin
    if (!origin || origin === ALLOWED_ORIGIN) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: origin ${origin} not allowed`));
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// ── EMAIL SETUP ───────────────────────────────────────────────────────────────
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const smtpConfig = {
  host: process.env.SMTP_HOST || process.env.EMAIL_HOST || "",
  port: Number(process.env.SMTP_PORT || process.env.EMAIL_PORT || 587),
  secure: process.env.SMTP_SECURE === "true" || process.env.EMAIL_SECURE === "true",
  family: 4, // Force IPv4 connection at the socket level
  tls: {
    rejectUnauthorized: false
  },
  auth: process.env.SMTP_USER && process.env.SMTP_PASS
    ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    : process.env.EMAIL_USER && process.env.EMAIL_PASS
    ? { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    : undefined,
};

const emailTransporter = smtpConfig.host && smtpConfig.auth
  ? nodemailer.createTransport(smtpConfig)
  : null;

const isEmailConfigured = Boolean(emailTransporter) || Boolean(resend);

// Generic Email Dispatcher supporting both Resend HTTP API and Nodemailer SMTP
async function sendMailHelper({ to, subject, text, html, replyTo }) {
  const from = process.env.EMAIL_FROM || "Mela Celebrations <onboarding@resend.dev>";
  
  if (resend) {
    try {
      const response = await resend.emails.send({
        from,
        to,
        subject,
        html,
        text,
        replyTo: replyTo || process.env.EMAIL_REPLY_TO || undefined,
      });
      if (response && response.error) {
        throw new Error(response.error.message || JSON.stringify(response.error));
      }
      console.log(`📧 Email sent to ${to} via Resend (${(response && response.data && response.data.id) || "success"})`);
      return;
    } catch (error) {
      console.error("⚠️ Resend HTTP API failed, trying SMTP fallback...", error);
    }
  }

  if (emailTransporter) {
    const mailOptions = {
      from: process.env.EMAIL_FROM || `Mela Celebrations <${process.env.SMTP_USER || process.env.EMAIL_USER || "melacelebrations@gmail.com"}>`,
      to,
      subject,
      text,
      html,
      replyTo: replyTo || process.env.EMAIL_REPLY_TO || undefined,
    };
    const info = await emailTransporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${to} via SMTP (${info.messageId})`);
    return;
  }

  console.warn("⚠️ No email service configured. Logging email to console.");
  console.log(`📧 [SIMULATED] To: ${to} | Subject: ${subject}`);
}

// ── HELPERS ───────────────────────────────────────────────────────────────────
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
    `Booking ID: ${booking.id}\nEvent Date: ${booking.date}\nVenue: ${booking.venue}\n\n` +
    `ITEMIZED CHARGES:\n` +
    `1. Base Package (${booking.packageName || "Custom Consultation"}): ₹${Number(booking.packagePrice || 0).toLocaleString("en-IN")}\n` +
    `2. Selected Add-ons:\n${itemsText}\n\n` +
    `Subtotal: ₹${Number(booking.subtotal || 0).toLocaleString("en-IN")}\n` +
    `${booking.discountAmount > 0 ? `Discount Applied (${booking.activeCoupon || "Coupon"}): -₹${Number(booking.discountAmount).toLocaleString("en-IN")}\n` : ""}` +
    `Final Total: ₹${Number(booking.finalPrice || 0).toLocaleString("en-IN")}\n\n` +
    `Status: ${booking.status.toUpperCase()}\nTracking URL: ${APP_URL}\n\n` +
    `If you have any questions, please reply to this email.\n`;
}

// ── DATE-BASED STATUS AUTO-UPDATE ─────────────────────────────────────────────
async function checkAndAutoUpdateStatuses(db) {
  const today = new Date();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const bookingsCol = db.collection("bookings");

  // Find all bookings that might need updating
  const bookings = await bookingsCol.find({
    status: { $in: ["Confirmed", "In Progress"] }
  }).toArray();

  const bookingsToNotify = [];

  for (const b of bookings) {
    if (!b.date) continue;
    const eventDate = new Date(b.date);
    if (isNaN(eventDate.getTime())) continue;
    const eventMidnight = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate()).getTime();

    let newStatus = null;
    if (b.status === "Confirmed" && todayMidnight === eventMidnight) {
      newStatus = "In Progress";
    } else if ((b.status === "Confirmed" || b.status === "In Progress") && todayMidnight > eventMidnight) {
      newStatus = "Completed";
    }

    if (newStatus) {
      await bookingsCol.updateOne({ id: b.id }, { $set: { status: newStatus } });
      console.log(`🤖 [Date Automation] Booking ${b.id} → '${newStatus}'`);
      bookingsToNotify.push({ ...b, status: newStatus });
    }
  }

  for (const b of bookingsToNotify) {
    sendBookingStatusUpdateEmail(b).catch(err =>
      console.error("Auto status update email error:", err)
    );
  }
}

// ── EMAIL FUNCTIONS ───────────────────────────────────────────────────────────
async function sendBookingConfirmationEmail(booking) {
  const subject = `Booking Confirmed & Invoice - Mela Celebrations! (${booking.id})`;
  const html = `
  <div style="font-family:Arial, sans-serif; color:#333; line-height:1.5;">
    <h2 style="color:#0c4a6e;">Booking Confirmation & Invoice</h2>
    <p>Dear ${booking.name},</p>
    <p>Thank you for booking with <strong>Mela Celebrations</strong>. We are thrilled to support your event.</p>
    <h3 style="margin-top:24px;">Invoice Summary</h3>
    <table style="width:100%; border-collapse:collapse;">
      <tr><td style="padding:8px 0; font-weight:600; width:140px;">Booking ID:</td><td>${booking.id}</td></tr>
      <tr><td style="padding:8px 0; font-weight:600;">Event Date:</td><td>${booking.date}</td></tr>
      <tr><td style="padding:8px 0; font-weight:600;">Venue:</td><td>${booking.venue}</td></tr>
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
    <p style="margin-top:8px;">Manage your booking: <a href="${APP_URL}" style="color:#2563eb;">View your dashboard</a></p>
    <p>If you have any questions, feel free to reply to this email.</p>
    <p>Best regards,<br>The Mela Celebrations Team</p>
  </div>`;

  await sendMailHelper({
    to: booking.email,
    subject,
    text: createInvoiceText(booking),
    html,
  });
}

async function sendWelcomeEmail(user) {
  const subject = `Welcome to Mela Celebrations, ${user.name}! ✨`;
  const html = `
  <div style="font-family:Arial, sans-serif; color:#333; line-height:1.5;">
    <h2 style="color:#0c4a6e;">Welcome to Mela Celebrations! 🎉</h2>
    <p>Dear ${user.name},</p>
    <p>Thank you for registering with <strong>Mela Celebrations</strong>. We are delighted to support you in planning your special events.</p>
    <h3 style="margin-top:24px;">With your new account, you can:</h3>
    <ul>
      <li>Explore and save premium decoration setups to your wishlist.</li>
      <li>Use our interactive Budget Estimator and Event Customizer tools.</li>
      <li>Track your booking requests and view invoices in real time from your dashboard.</li>
    </ul>
    <p style="margin-top:24px;">Manage your account: <a href="${APP_URL}" style="color:#2563eb; font-weight:bold;">View your dashboard</a></p>
    <p>Best regards,<br>The Mela Celebrations Team</p>
  </div>`;

  await sendMailHelper({
    to: user.email,
    subject,
    html,
  });
}

async function sendBookingStatusUpdateEmail(booking) {
  const subject = `Booking Status Update - Mela Celebrations! (${booking.id})`;
  const html = `
  <div style="font-family:Arial, sans-serif; color:#333; line-height:1.5;">
    <h2 style="color:#0c4a6e;">Booking Status Update</h2>
    <p>Dear ${booking.name},</p>
    <p>The status of your booking <strong>${booking.id}</strong> has been updated.</p>
    <div style="background-color:#f7f4ef; padding:16px; border-radius:8px; border-left:4px solid #c9a84c; margin:20px 0;">
      <p style="margin:0; font-size:1.1rem; color:#0c4a6e;">New Status: <strong>${booking.status.toUpperCase()}</strong></p>
    </div>
    <table style="width:100%; border-collapse:collapse; margin-bottom:20px;">
      <tr><td style="padding:8px 0; font-weight:600; width:140px;">Booking ID:</td><td>${booking.id}</td></tr>
      <tr><td style="padding:8px 0; font-weight:600;">Event Date:</td><td>${booking.date}</td></tr>
      <tr><td style="padding:8px 0; font-weight:600;">Venue:</td><td>${booking.venue}</td></tr>
      <tr><td style="padding:8px 0; font-weight:600;">Package:</td><td>${booking.packageName}</td></tr>
    </table>
    <p>Track your booking: <a href="${APP_URL}" style="color:#2563eb; font-weight:bold;">View your dashboard</a></p>
    <p>Best regards,<br>The Mela Celebrations Team</p>
  </div>`;

  await sendMailHelper({
    to: booking.email,
    subject,
    html,
  });
}

async function sendContactFormEmails(contactData) {
  const adminEmail = process.env.EMAIL_REPLY_TO || process.env.SMTP_USER || "melacelebrations@gmail.com";

  const adminHtml = `
  <div style="font-family:Arial, sans-serif; color:#333; line-height:1.5;">
    <h2 style="color:#0c4a6e;">New Contact Us Submission</h2>
    <table style="width:100%; border-collapse:collapse;">
      <tr><td style="padding:8px 0; font-weight:600; width:120px;">Name:</td><td>${contactData.name}</td></tr>
      <tr><td style="padding:8px 0; font-weight:600;">Email:</td><td><a href="mailto:${contactData.email}">${contactData.email}</a></td></tr>
      <tr><td style="padding:8px 0; font-weight:600;">Subject:</td><td>${contactData.subject}</td></tr>
      <tr><td style="padding:8px 0; font-weight:600; vertical-align:top;">Message:</td><td>${contactData.message}</td></tr>
    </table>
    <p style="margin-top:20px; font-size:0.8rem; color:#888;">Submitted at: ${new Date().toLocaleString()}</p>
  </div>`;

  const userHtml = `
  <div style="font-family:Arial, sans-serif; color:#333; line-height:1.5;">
    <h2 style="color:#0c4a6e;">Thank you for contacting Mela Celebrations!</h2>
    <p>Dear ${contactData.name},</p>
    <p>We have received your inquiry regarding <strong>"${contactData.subject}"</strong>.</p>
    <p>Our team will get back to you within 24–48 hours.</p>
    <p>Best regards,<br>The Mela Celebrations Team</p>
  </div>`;

  // Send email to admin
  await sendMailHelper({
    to: adminEmail,
    subject: `New Contact Inquiry: ${contactData.subject} - from ${contactData.name}`,
    html: adminHtml,
    replyTo: contactData.email,
  });

  // Send confirmation to user
  await sendMailHelper({
    to: contactData.email,
    subject: "We received your message - Mela Celebrations",
    html: userHtml,
  });
}

// ── API ROUTES ────────────────────────────────────────────────────────────────

// ── CATEGORIES & DESIGNS ──────────────────────────────────────────────────────
app.get("/api/categories", async (req, res) => {
  try {
    const db = await getDB();
    const categories = await db.collection("categories").find({}).toArray();
    const clean = categories.map(({ _id, ...c }) => c);
    res.status(200).json(clean);
  } catch (error) {
    console.error("Get Categories Error:", error);
    res.status(500).json({ error: "Server error fetching categories" });
  }
});

app.get("/api/designs", async (req, res) => {
  try {
    const db = await getDB();
    const designs = await db.collection("designs").find({}).toArray();
    const clean = designs.map(({ _id, ...d }) => d);
    res.status(200).json(clean);
  } catch (error) {
    console.error("Get Designs Error:", error);
    res.status(500).json({ error: "Server error fetching designs" });
  }
});

app.post("/api/designs", async (req, res) => {
  try {
    const newDesign = req.body;
    const db = await getDB();
    const designsCol = db.collection("designs");
    const designs = await designsCol.find({}).toArray();
    
    // Generate new numeric ID
    const nextId = designs.length > 0 
      ? Math.max(...designs.map(d => Number(d.id) || 0)) + 1 
      : 1001;
      
    const designWithId = {
      ...newDesign,
      id: nextId
    };
    
    await designsCol.insertOne(designWithId);
    const { _id, ...clean } = designWithId;
    res.status(201).json(clean);
  } catch (error) {
    console.error("Create Design Error:", error);
    res.status(500).json({ error: "Server error creating design" });
  }
});

app.delete("/api/designs/:id", async (req, res) => {
  try {
    const designId = req.params.id;
    const db = await getDB();
    const designsCol = db.collection("designs");
    
    const numericId = Number(designId);
    const query = {
      $or: [
        { id: designId },
        { id: isNaN(numericId) ? null : numericId }
      ]
    };
    
    const result = await designsCol.deleteOne(query);
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Design not found" });
    }
    
    res.status(200).json({ success: true, message: "Design deleted successfully" });
  } catch (error) {
    console.error("Delete Design Error:", error);
    res.status(500).json({ error: "Server error deleting design" });
  }
});

app.put("/api/designs/:id", async (req, res) => {
  try {
    const designId = req.params.id;
    const updateData = req.body;
    const db = await getDB();
    const designsCol = db.collection("designs");
    
    const numericId = Number(designId);
    const query = {
      $or: [
        { id: designId },
        { id: isNaN(numericId) ? null : numericId }
      ]
    };
    
    // Clean data: prevent modifying immutable _id
    delete updateData._id;
    if (updateData.id) {
      updateData.id = isNaN(Number(updateData.id)) ? updateData.id : Number(updateData.id);
    }
    if (updateData.price) {
      updateData.price = Number(updateData.price);
    }
    if (updateData.originalPrice) {
      updateData.originalPrice = Number(updateData.originalPrice);
    }

    const result = await designsCol.findOneAndUpdate(
      query,
      { $set: updateData },
      { returnDocument: "after" }
    );

    if (!result) {
      return res.status(404).json({ error: "Design not found" });
    }

    const { _id, ...clean } = result;
    res.status(200).json(clean);
  } catch (error) {
    console.error("Update Design Error:", error);
    res.status(500).json({ error: "Server error updating design" });
  }
});

// ── AUTH ──────────────────────────────────────────────────────────────────────
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: "Missing required registration details" });
    }
    const db = await getDB();
    const usersCol = db.collection("users");
    const existing = await usersCol.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: "A user with this email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = {
      id: "usr_" + Date.now().toString(36),
      name,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };
    await usersCol.insertOne(newUser);
    sendWelcomeEmail(newUser).catch(err => console.error("Welcome email error:", err));
    const { password: _, _id, ...userWithoutPassword } = newUser;
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
    const db = await getDB();
    const usersCol = db.collection("users");
    const user = await usersCol.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    const { password: _, _id, ...userWithoutPassword } = user;
    res.status(200).json({ message: "Login successful", user: userWithoutPassword, token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Server login error" });
  }
});

// ── BOOKINGS ──────────────────────────────────────────────────────────────────
app.post("/api/bookings", async (req, res) => {
  try {
    const {
      name, email, phone, date, venue, message,
      designId, packageName, packagePrice,
      selectedServices, subtotal, discountAmount, finalPrice, activeCoupon,
    } = req.body;
    if (!name || !email || !phone || !date || !venue) {
      return res.status(400).json({ error: "Missing required booking information" });
    }
    const db = await getDB();
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
      createdAt: new Date().toISOString(),
    };
    await db.collection("bookings").insertOne(newBooking);
    sendBookingConfirmationEmail(newBooking).catch(err =>
      console.error("Booking email error:", err)
    );
    const { _id, ...bookingResponse } = newBooking;
    res.status(201).json({ message: "Booking confirmed successfully", booking: bookingResponse });
  } catch (error) {
    console.error("Create Booking Error:", error);
    res.status(500).json({ error: "Server error creating booking" });
  }
});

app.get("/api/bookings/user/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const db = await getDB();
    await checkAndAutoUpdateStatuses(db);
    const bookings = await db.collection("bookings")
      .find({ email: email.toLowerCase() })
      .sort({ createdAt: -1 })
      .toArray();
    const clean = bookings.map(({ _id, ...b }) => b);
    res.status(200).json(clean);
  } catch (error) {
    console.error("Get User Bookings Error:", error);
    res.status(500).json({ error: "Server error retrieving bookings" });
  }
});

app.get("/api/bookings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDB();
    const booking = await db.collection("bookings").findOne({
      id: { $regex: new RegExp(`^${id}$`, "i") }
    });
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    const { _id, ...bookingResponse } = booking;
    res.status(200).json(bookingResponse);
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
    const db = await getDB();
    const result = await db.collection("bookings").findOneAndUpdate(
      { id: { $regex: new RegExp(`^${id}$`, "i") } },
      { $set: { status } },
      { returnDocument: "after" }
    );
    if (!result) return res.status(404).json({ error: "Booking not found" });
    sendBookingStatusUpdateEmail(result).catch(err =>
      console.error("Status email error:", err)
    );
    const { _id, ...bookingResponse } = result;
    res.status(200).json({ message: "Status updated successfully", booking: bookingResponse });
  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({ error: "Server error updating status" });
  }
});

// ── COUPONS ───────────────────────────────────────────────────────────────────
const handleValidateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: "Coupon code is required" });
    const db = await getDB();
    const coupon = await db.collection("coupons").findOne({
      code: { $regex: new RegExp(`^${code.trim()}$`, "i") }
    });
    if (!coupon) return res.status(400).json({ error: "Invalid coupon code" });
    const { _id, ...couponResponse } = coupon;
    res.status(200).json(couponResponse);
  } catch (error) {
    console.error("Validate Coupon Error:", error);
    res.status(500).json({ error: "Server coupon validation error" });
  }
};

app.post("/api/coupons/validate", handleValidateCoupon);
app.post("/api/bookings/validate-coupon", handleValidateCoupon);

app.get("/api/coupons", async (req, res) => {
  try {
    const db = await getDB();
    const coupons = await db.collection("coupons").find({}).toArray();
    const clean = coupons.map(({ _id, ...c }) => c);
    res.status(200).json(clean);
  } catch (error) {
    res.status(500).json({ error: "Server error fetching coupons" });
  }
});

// ── CONTACT ───────────────────────────────────────────────────────────────────
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "Missing required contact details" });
    }
    await sendContactFormEmails({ name, email, subject, message });
    res.status(200).json({ message: "Inquiry received successfully" });
  } catch (error) {
    console.error("Contact Submission Error:", error);
    res.status(500).json({ error: "Server error processing contact inquiry" });
  }
});

// ── START SERVER ──────────────────────────────────────────────────────────────
async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Mela Celebrations Backend running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
