var transporterModule = require("./emailSetup.js");
var transporter = transporterModule.transporter;

/**
 * Sends an email using Nodemailer.
 *
 * @param {string} to - Recipient email address.
 * @param {string} subject - Email subject.
 * @param {string} htmlContent - HTML content of the email.
 * @returns {Promise<object>} - Resolves with email info or throws an error.
 */
function SendEmail(to, subject, htmlContent) {
  console.log("📤 Sending email to: " + to + "...");

  var mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER, // Default sender email
    to: to,
    subject: subject,
    html: htmlContent,
  };

  return transporter.sendMail(mailOptions)
    .then(function (info) {
      console.log("✅ Email sent successfully! Message ID: " + info.messageId);
      return info;
    })
    .catch(function (error) {
      console.error("❌ Failed to send email:", error.message || error);
      throw error; // Rethrow for handling in the caller function
    });
}

// ✅ Export function for reuse
module.exports = { SendEmail };
