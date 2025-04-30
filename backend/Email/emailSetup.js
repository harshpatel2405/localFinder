const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables

// ✅ Validate Required Environment Variables
var requiredEnv = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"];
var missingEnv = requiredEnv.filter(function (key) {
  return !process.env[key];
});

if (missingEnv.length) {
  console.error("❌ Missing required environment variables: " + missingEnv.join(", "));
  process.exit(1);
}

// ✅ Configure SMTP Transporter Securely
var transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_PORT === "465", // Use TLS for port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Allows self-signed certificates (useful for testing)
  },
});

// ✅ Function to Verify SMTP Connection
function verifySMTPConnection() {
  console.log("🔄 Checking SMTP connection...");

  transporter.verify(function (error, success) {
    if (error) {
      console.error("❌ SMTP Connection Error:", error.message || error);
      process.exit(1); // Exit process if SMTP setup fails
    } else {
      console.log("✅ SMTP Connection Successful! Ready to send emails.");
    }
  });
}

// ✅ Run SMTP Verification When File Is Loaded
verifySMTPConnection();

module.exports = { transporter };
