const Admin = require("../models/AdminModel");
const bcrypt = require("bcrypt");
const User = require("../models/UserModel");
const Payment=require("../models/RazorModel");
const Appointment = require("../models/AppointmentModel");
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if admin already exists
    let admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Create new admin
    admin = new Admin({ name, email, password });
    await admin.save();

    // Store admin info in session
    req.session.admin = {
      id: admin._id,
      email: admin.email,
      role: admin.role,
    };

    res.status(201).json({ message: "Admin account created successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error during signup" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Store admin info in session
    req.session.admin = {
      id: admin._id,
      email: admin.email,
      role: admin.role,
    };

    res.status(200).json({ message: "Logged in successfully" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

exports.logout = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to log out" });
      }
      res.clearCookie("connect.sid"); // Clear session cookie
      res.status(200).json({ message: "Logged out successfully" });
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error during logout" });
  }
};

exports.getAllUsers=async (req, res) => {
  try {
    const users = await User.find({userType: "user"});
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
}


exports.getAllPayments=async (req, res) => {
  try {
    const payments = await Payment.find();
    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ message: "Server error" });
  }
}


exports.getAllServiceProviders=async(req, res) => {
  try {
    const serviceProviders = await User.find({userType: "provider"});
    res.status(200).json(serviceProviders);
  } catch (error) {
    console.error("Error fetching service providers:", error);
    res.status(500).json({ message: "Server error" });
  }
}

exports.getAllAppointments=async(req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Server error" });
  }
}