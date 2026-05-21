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
  const bookingsToNotify = [];

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
        bookingsToNotify.push(b);
        console.log(`🤖 [Date Automation] Booking ${b.id} set to 'In Progress' (Event is today: ${b.date})`);
      }
      // 2. Confirmed or In Progress -> Completed (when event day passes)
      else if ((b.status === "Confirmed" || b.status === "In Progress") && todayMidnight > eventMidnight) {
        b.status = "Completed";
        modified = true;
        bookingsToNotify.push(b);
        console.log(`🤖 [Date Automation] Booking ${b.id} set to 'Completed' (Event has passed: ${b.date})`);
      }
      
      return b;
    });
  }

  if (modified) {
    // Write directly to file (avoiding loops, writeDB does not readDB)
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf8");
    // Send status update emails asynchronously so we don't block
    for (const b of bookingsToNotify) {
      sendBookingStatusUpdateEmail(b).catch(err => console.error("Auto status update email error:", err));
    }
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

async function sendWelcomeEmail(user) {
  const subject = `Welcome to Mela Celebrations, ${user.name}! ✨`;
  const dashboardUrl = process.env.INVOICE_URL || "http://localhost:5173/dashboard";

  const html = `
  <div style="font-family:Arial, sans-serif; color:#333; line-height:1.5;">
    <h2 style="color:#0c4a6e;">Welcome to Mela Celebrations! 🎉</h2>
    <p>Dear ${user.name},</p>
    <p>Thank you for registering an account with <strong>Mela Celebrations</strong>. We are delighted to support you in planning your special events.</p>
    <h3 style="margin-top:24px;">With your new account, you can:</h3>
    <ul>
      <li>Explore and save premium decoration setups to your wishlist.</li>
      <li>Use our interactive Budget Estimator and Event Customizer tools.</li>
      <li>Track your booking requests and view invoices in real time from your dashboard.</li>
    </ul>
    <p style="margin-top:24px;">Manage your account and start planning: <a href="${dashboardUrl}" style="color:#2563eb; font-weight:bold;">View your dashboard</a></p>
    <p>If you have any questions or need custom requests, click the WhatsApp button on our website or reply to this email.</p>
    <p>Best regards,<br>The Mela Celebrations Team</p>
  </div>
  `;

  const text = `Welcome to Mela Celebrations, ${user.name}!\n\n` +
               `Thank you for registering an account with Mela Celebrations. We are delighted to support you in planning your special events.\n\n` +
               `With your new account, you can:\n` +
               `1. Explore and save premium decoration setups to your wishlist.\n` +
               `2. Use our interactive Budget Estimator and Event Customizer tools.\n` +
               `3. Track your booking requests and view invoices in real-time.\n\n` +
               `Manage your account: ${dashboardUrl}\n\n` +
               `If you have any questions, click the WhatsApp button on our website or reply to this email.\n\n` +
               `Best regards,\nThe Mela Celebrations Team\n`;

  const mailOptions = {
    from: process.env.EMAIL_FROM || "Mela Celebrations <no-reply@melacelebrations.com>",
    to: user.email,
    subject,
    text,
    html,
    replyTo: process.env.EMAIL_REPLY_TO || process.env.SMTP_USER,
  };

  if (!isEmailConfigured) {
    console.warn("⚠️ SMTP not configured. Falling back to logging the welcome email to console.");
    logSimulatedWelcomeEmail(user);
    return;
  }

  try {
    const info = await emailTransporter.sendMail(mailOptions);
    console.log(`📧 Welcome email sent to ${user.email} (${info.messageId})`);
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    logSimulatedWelcomeEmail(user);
  }
}

function logSimulatedWelcomeEmail(user) {
  const emailHtml = `
=========================================
📧 EMAIL NOTIFICATION: WELCOME EMAIL
To: ${user.email}
Subject: Welcome to Mela Celebrations, ${user.name}! ✨
=========================================
Dear ${user.name},

Thank you for registering an account with Mela Celebrations! We are excited to help you plan your special events.

With your new account, you can:
- Explore and save premium decoration setups to your wishlist.
- Use our interactive Budget Estimator and Event Customizer tools.
- Track your booking requests and view invoices in real time from your dashboard.

Dashboard URL: http://localhost:5173/dashboard

If you have any questions, click the WhatsApp button on our website or reply to this email.

Best Regards,
The Mela Celebrations Team
=========================================
`;
  console.log(emailHtml);
}

async function sendBookingStatusUpdateEmail(booking) {
  const subject = `Booking Status Update - Mela Celebrations! (${booking.id})`;
  const dashboardUrl = process.env.INVOICE_URL || "http://localhost:5173/dashboard";

  const html = `
  <div style="font-family:Arial, sans-serif; color:#333; line-height:1.5;">
    <h2 style="color:#0c4a6e;">Booking Status Update</h2>
    <p>Dear ${booking.name},</p>
    <p>We wanted to let you know that the status of your booking <strong>${booking.id}</strong> has been updated.</p>
    
    <div style="background-color: #f7f4ef; padding: 16px; border-radius: 8px; border-left: 4px solid #c9a84c; margin: 20px 0;">
      <p style="margin: 0; font-size: 1.1rem; color: #0c4a6e;">
        New Status: <strong>${booking.status.toUpperCase()}</strong>
      </p>
    </div>
    
    <table style="width:100%; border-collapse:collapse; margin-bottom: 20px;">
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
      <tr>
        <td style="padding:8px 0; font-weight:600;">Package:</td>
        <td>${booking.packageName}</td>
      </tr>
    </table>

    <p style="margin-top:24px;">Track your booking progress and view invoice details: <a href="${dashboardUrl}" style="color:#2563eb; font-weight:bold;">View your dashboard</a></p>
    <p>If you have any questions, feel free to reply to this email.</p>
    <p>Best regards,<br>The Mela Celebrations Team</p>
  </div>
  `;

  const text = `Booking Status Update - Mela Celebrations!\n\n` +
               `Dear ${booking.name},\n\n` +
               `We wanted to let you know that the status of your booking ${booking.id} has been updated.\n\n` +
               `New Status: ${booking.status.toUpperCase()}\n\n` +
               `Booking Details:\n` +
               `- Booking ID: ${booking.id}\n` +
               `- Event Date: ${booking.date}\n` +
               `- Venue: ${booking.venue}\n` +
               `- Package: ${booking.packageName}\n\n` +
               `Track your booking progress: ${dashboardUrl}\n\n` +
               `If you have any questions, feel free to reply to this email.\n\n` +
               `Best regards,\nThe Mela Celebrations Team\n`;

  const mailOptions = {
    from: process.env.EMAIL_FROM || "Mela Celebrations <no-reply@melacelebrations.com>",
    to: booking.email,
    subject,
    text,
    html,
    replyTo: process.env.EMAIL_REPLY_TO || process.env.SMTP_USER,
  };

  if (!isEmailConfigured) {
    console.warn("⚠️ SMTP not configured. Falling back to logging the booking status update email to console.");
    logSimulatedStatusUpdateEmail(booking);
    return;
  }

  try {
    const info = await emailTransporter.sendMail(mailOptions);
    console.log(`📧 Booking status update email sent to ${booking.email} (${info.messageId})`);
  } catch (error) {
    console.error("Failed to send booking status update email:", error);
    logSimulatedStatusUpdateEmail(booking);
  }
}

function logSimulatedStatusUpdateEmail(booking) {
  const emailHtml = `
=========================================
📧 EMAIL NOTIFICATION: BOOKING STATUS UPDATE
To: ${booking.email}
Subject: Booking Status Update - Mela Celebrations! (${booking.id})
=========================================
Dear ${booking.name},

We wanted to let you know that the status of your booking ${booking.id} has been updated.

New Status: ${booking.status.toUpperCase()}

Booking Details:
- Booking ID: ${booking.id}
- Event Date: ${booking.date}
- Venue: ${booking.venue}
- Package: ${booking.packageName}

Dashboard URL: http://localhost:5173/dashboard

If you have any questions, reply to this email.

Best Regards,
The Mela Celebrations Team
=========================================
`;
  console.log(emailHtml);
}

async function sendContactFormEmails(contactData) {
  const adminSubject = `New Contact Inquiry: ${contactData.subject} - from ${contactData.name}`;
  const userSubject = `We received your message - Mela Celebrations`;
  
  const adminHtml = `
  <div style="font-family:Arial, sans-serif; color:#333; line-height:1.5;">
    <h2 style="color:#0c4a6e;">New Contact Us Submission</h2>
    <p>You have received a new contact submission with the following details:</p>
    <table style="width:100%; border-collapse:collapse;">
      <tr>
        <td style="padding:8px 0; font-weight:600; width:120px;">Name:</td>
        <td>${contactData.name}</td>
      </tr>
      <tr>
        <td style="padding:8px 0; font-weight:600;">Email:</td>
        <td><a href="mailto:${contactData.email}">${contactData.email}</a></td>
      </tr>
      <tr>
        <td style="padding:8px 0; font-weight:600;">Subject:</td>
        <td>${contactData.subject}</td>
      </tr>
      <tr>
        <td style="padding:8px 0; font-weight:600; vertical-align:top;">Message:</td>
        <td>${contactData.message}</td>
      </tr>
    </table>
    <p style="margin-top:20px; font-size:0.8rem; color:#888;">Submitted at: ${new Date().toLocaleString()}</p>
  </div>
  `;

  const userHtml = `
  <div style="font-family:Arial, sans-serif; color:#333; line-height:1.5;">
    <h2 style="color:#0c4a6e;">Thank you for contacting Mela Celebrations!</h2>
    <p>Dear ${contactData.name},</p>
    <p>We have successfully received your inquiry regarding <strong>"${contactData.subject}"</strong>.</p>
    <p>Our team will review your message and get back to you within 24–48 hours.</p>
    <div style="background-color: #f7f4ef; padding: 16px; border-radius: 8px; border: 1px solid #e2ddd6; margin: 20px 0;">
      <p style="margin: 0; font-style: italic; color: #555;">
        "${contactData.message}"
      </p>
    </div>
    <p>If your request is urgent, feel free to contact us via WhatsApp on our website.</p>
    <p>Best regards,<br>The Mela Celebrations Team</p>
  </div>
  `;

  const mailOptionsAdmin = {
    from: process.env.EMAIL_FROM || "Mela Celebrations <no-reply@melacelebrations.com>",
    to: process.env.EMAIL_REPLY_TO || process.env.SMTP_USER || "support@melacelebrations.com",
    replyTo: contactData.email,
    subject: adminSubject,
    text: `New Contact Submission:\nName: ${contactData.name}\nEmail: ${contactData.email}\nSubject: ${contactData.subject}\nMessage: ${contactData.message}\n`,
    html: adminHtml,
  };

  const mailOptionsUser = {
    from: process.env.EMAIL_FROM || "Mela Celebrations <no-reply@melacelebrations.com>",
    to: contactData.email,
    replyTo: process.env.EMAIL_REPLY_TO || process.env.SMTP_USER,
    subject: userSubject,
    text: `Dear ${contactData.name},\n\nWe have received your message:\n"${contactData.message}"\n\nOur support team will get back to you shortly.\n\nBest regards,\nThe Mela Celebrations Team\n`,
    html: userHtml,
  };

  if (!isEmailConfigured) {
    console.warn("⚠️ SMTP not configured. Falling back to logging the contact submission emails to console.");
    logSimulatedContactForm(contactData);
    return;
  }

  try {
    // Send to admin
    await emailTransporter.sendMail(mailOptionsAdmin);
    console.log(`📧 Contact Inquiry forwarded to Admin for ${contactData.email}`);
    // Send receipt to user
    await emailTransporter.sendMail(mailOptionsUser);
    console.log(`📧 Contact Receipt sent to user ${contactData.email}`);
  } catch (error) {
    console.error("Failed to send contact emails:", error);
    logSimulatedContactForm(contactData);
  }
}

function logSimulatedContactForm(contactData) {
  const emailHtml = `
=========================================
📧 EMAIL NOTIFICATION: CONTACT INQUIRY RECEIVED
To Admin: ${process.env.EMAIL_REPLY_TO || "support@melacelebrations.com"} (Reply-To: ${contactData.email})
Subject: New Contact Inquiry: ${contactData.subject} - from ${contactData.name}
Message: ${contactData.message}
-----------------------------------------
📧 EMAIL NOTIFICATION: USER CONTACT RECEIPT
To User: ${contactData.email}
Subject: We received your message - Mela Celebrations
Dear ${contactData.name},
We have received your message regarding "${contactData.subject}". Our team will reply shortly.
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

    // Send welcome email
    await sendWelcomeEmail(newUser).catch(err => console.error("Welcome email error:", err));

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

    // Send booking status update email notification
    await sendBookingStatusUpdateEmail(db.bookings[index]).catch(err => console.error("Booking status email error:", err));

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

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "Missing required contact details" });
    }

    const contactData = { name, email, subject, message };
    await sendContactFormEmails(contactData);

    res.status(200).json({ message: "Inquiry received successfully" });
  } catch (error) {
    console.error("Contact Submission Error:", error);
    res.status(500).json({ error: "Server error processing contact inquiry" });
  }
});

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
