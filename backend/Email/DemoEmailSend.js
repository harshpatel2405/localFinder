var SendEmailModule = require("./SendEmail.js");
var SendEmail = SendEmailModule.SendEmail;

var Templates = require("./Templates.js");
var welcomeEmail = Templates.welcomeEmail;
var passwordResetEmail = Templates.passwordResetEmail;
var accountVerificationEmail = Templates.accountVerificationEmail;

// ✅ Define recipient email & user name
var recipientEmail = "technorex439@gmail.com"; // Use actual recipient email
var userName = "Harsh Patel"; // Use actual user name

// ✅ Send the welcome email
function sendWelcomeEmail() {
  SendEmail(recipientEmail, "🎉 Welcome to WedJoy!", accountVerificationEmail("https://wedjoyy.vercel.app"))
    .then(function () {
      console.log("✅ Welcome email sent successfully!");
    })
    .catch(function (err) {
      console.error("❌ Failed to send email:", err.message || err);
    });
}

// ✅ Run the email function
sendWelcomeEmail();
