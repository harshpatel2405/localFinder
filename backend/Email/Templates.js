// templates.js

const welcomeEmail = (name) => {
  return `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; text-align: center;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);">

        <img src="https://urbanservice.com/logo.png" alt="Urban Service Logo" style="max-width: 160px; margin-top: 10px;">

        <h1 style="color: #34495e;">👋 Welcome to Urban Service, ${name}!</h1>

        <p style="font-size: 17px; color: #555;">We're thrilled to have you on board! 🚀</p>

        <p style="font-size: 15px; color: #666; margin-top: 20px;">
          Discover top-rated local professionals, book trusted services, and simplify your daily life with Urban Service. 🛠🏠
        </p>

        <a href="https://urbanservice.com/dashboard"
          style="display: inline-block; padding: 12px 20px; margin-top: 20px; background: #3498db; color: white; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 5px;">
          Visit Dashboard ➡
        </a>

        <p style="font-size: 14px; color: #888; margin-top: 25px;">Need help? We're here for you anytime.</p>

        <div style="margin-top: 10px; padding: 10px; background: #f1f1f1; border-radius: 8px;">
          <p style="font-size: 13px; color: #777;">
            📧 <strong>Email:</strong> <a href="mailto:support@urbanservice.com" style="color: #3498db; text-decoration: none;">support@urbanservice.com</a><br>
            📱 <strong>Call Us:</strong> +1-234-567-8901
          </p>
        </div>

        <p style="font-size: 13px; color: #aaa; margin-top: 15px;">This is an automated message. Please do not reply.</p>

        <p style="font-size: 15px; font-weight: bold; color: #444;">- The Urban Service Team 🏙</p>
      </div>
    </div>
  `;
};

const passwordResetEmail = (otp) => `
  <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center;">
    <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);">
      <img src="https://img.freepik.com/free-photo/mysterious-glowing-galaxy-creates-deep-blue-backdrop-generated-by-ai_188544-9577.jpg?ga=GA1.1.613577462.1730049949&semt=ais_hybrid" 
        alt="WedJoy Logo" 
        style="max-width: 150px; margin-top: 20px; border-radius: 50%;">
      <h2 style="color: #2c3e50;">🔐 Password Reset Verification</h2>
      <p style="font-size: 18px; color: #555;">
        To reset your password, please use the OTP below:
      </p>
      <div style="font-size: 26px; font-weight: bold; background: #ffebcc; color: #d35400; padding: 12px; display: inline-block; border-radius: 8px; margin: 20px 0;">
        ${otp}
      </div>
      <p style="font-size: 16px; color: #777;">
        Enter this OTP on the password reset page to proceed. This OTP is valid for <strong>10 minutes</strong>.
      </p>
      <p style="font-size: 14px; color: #777; margin-top: 20px;">
        If you did not request this, please ignore this email or contact our support team.
      </p>
      <div style="margin-top: 20px; padding: 15px; background: #f4f4f4; border-radius: 8px;">
        <p style="font-size: 14px; color: #777;">
          📞 <strong>Support Team:</strong> +1-800-123-4567 <br>
          📧 <strong>Email:</strong> <a href="mailto:support@wedjoy.com" style="color: #007BFF; text-decoration: none;">support@wedjoy.com</a>
        </p>
      </div>
      <p style="font-size: 14px; color: #999; margin-top: 20px;">
        This is an automated email. Please do not reply.
      </p>
      <p style="font-size: 16px; font-weight: bold; color: #333; margin-bottom: 20px;">
        - The WedJoy Team
      </p>
    </div>
  </div>
`;

const eventNotificationEmail = (eventName, eventDate, eventLink) => `
  <div style="font-family: Arial, sans-serif; padding: 20px;">
    <h2>Upcoming Event: ${eventName}</h2>
    <p>Join us on <strong>${eventDate}</strong> for an exciting event.</p>
    <a href="${eventLink}" style="display:inline-block; padding: 10px 20px; color: white; background: #28A745; text-decoration: none; border-radius: 5px;">View Event</a>
    <p>We hope to see you there!</p>
    <p>Best regards,</p>
    <p><strong>The WedJoy Team</strong></p>
  </div>
`;

const accountVerificationEmail = (verificationLink) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px; margin: auto; background: #f9f9f9; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
    <div style="text-align: center;">
      <img src="https://your-logo-url.com/logo.png" alt="WedJoy Logo" style="max-width: 100px; margin-bottom: 15px;">
    </div>
    <div style="background: #ffffff; padding: 15px; border-radius: 8px; text-align: center;">
      <h2 style="color: #333; margin-bottom: 10px;">Confirm Your Email</h2>
      <p style="color: #555; font-size: 14px; margin-bottom: 15px;">Thank you for joining <strong>WedJoy</strong>! Please verify your email within <strong>24 hours</strong> to activate your account.</p>
      <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; color: white; background: #28A745; text-decoration: none; font-size: 14px; font-weight: bold; border-radius: 5px;">Verify Email</a>
      <p style="color: #777; font-size: 12px; margin-top: 12px;">This link will expire in <strong>24 hours</strong>. If you did not sign up, please ignore this email.</p>
    </div>
    <div style="text-align: center; margin-top: 15px; color: #888; font-size: 11px;">
      <p>Best regards,</p>
      <p><strong>The WedJoy Team</strong></p>
    </div>
  </div>
`;

const eventReminderEmail = (eventName, eventDate, eventLink) => `
  <div style="font-family: Arial, sans-serif; padding: 20px;">
    <h2>Reminder: ${eventName} is coming up!</h2>
    <p>Just a quick reminder that <strong>${eventName}</strong> is happening on <strong>${eventDate}</strong>.</p>
    <a href="${eventLink}" style="display:inline-block; padding: 10px 20px; color: white; background: #007BFF; text-decoration: none; border-radius: 5px;">View Event Details</a>
    <p>We can't wait to see you there!</p>
    <p>Best regards,</p>
    <p><strong>The WedJoy Team</strong></p>
  </div>
`;

const subscriptionConfirmationEmail = (subscriptionType) => `
  <div style="font-family: Arial, sans-serif; padding: 20px;">
    <h2>Subscription Confirmed!</h2>
    <p>Thank you for subscribing to <strong>${subscriptionType}</strong> on WedJoy. You will now receive the latest updates and exclusive offers.</p>
    <p>Best regards,</p>
    <p><strong>The WedJoy Team</strong></p>
  </div>
`;

const feedbackRequestEmail = (eventName, feedbackLink) => `
  <div style="font-family: Arial, sans-serif; padding: 20px;">
    <h2>We’d love your feedback!</h2>
    <p>Thank you for attending <strong>${eventName}</strong>. We’d love to hear your thoughts on how we can improve.</p>
    <a href="${feedbackLink}" style="display:inline-block; padding: 10px 20px; color: white; background: #FF8C00; text-decoration: none; border-radius: 5px;">Give Feedback</a>
    <p>Thank you for being a part of WedJoy!</p>
    <p>Best regards,</p>
    <p><strong>The WedJoy Team</strong></p>
  </div>
`;

const ForgotPasswordEmail = (otp) => `
  <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center;">
    <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);">
      <img src="https://wedjoy.com/logo.png" alt="WedJoy Logo" style="max-width: 150px; margin-top: 20px;">
      <h2 style="color: #2c3e50;">Forgot Your Password?</h2>
      <p style="font-size: 18px; color: #555;">No worries! Here's your OTP to reset your password:</p>
      <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; background: #f8f9fa; color: #2c3e50; padding: 15px; display: inline-block; border-radius: 8px; margin: 20px 0;">
        ${otp}
      </div>
      <p style="font-size: 16px; color: #777;">This OTP will expire in <strong>10 minutes</strong>. Please do not share this code with anyone.</p>
      <div style="margin: 30px 0; padding: 15px; background: #fff3cd; border-radius: 8px; color: #856404;">
        <p style="margin: 0; font-size: 14px;">🔒 If you didn't request this password reset, please ignore this email or contact support.</p>
      </div>
      <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
        <p style="font-size: 14px; color: #777;">Need help? Contact our support team:<br>📧 <a href="mailto:support@wedjoy.com" style="color: #007bff; text-decoration: none;">support@wedjoy.com</a></p>
      </div>
      <p style="font-size: 14px; color: #999; margin-top: 20px;">This is an automated email. Please do not reply.</p>
      <p style="font-size: 16px; font-weight: bold; color: #333; margin-bottom: 20px;">- The WedJoy Team</p>
    </div>
  </div>
`;

module.exports = {
  welcomeEmail,
  passwordResetEmail,
  eventNotificationEmail,
  accountVerificationEmail,
  eventReminderEmail,
  subscriptionConfirmationEmail,
  feedbackRequestEmail,
  ForgotPasswordEmail
};
