"use client";

import { useState } from "react";
import { Upload, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profile, setProfile] = useState({
    fullName: "Dr. Alex Johnson",
    specialty: "Orthopedic Surgeon",
    email: "alex.johnson@medical.org",
    phone: "(555) 123-4567",
    bio: "Dr. Alex Johnson is a board-certified orthopedic surgeon specializing in sports medicine and joint reconstruction with over 8 years of clinical experience.",
  });
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    payment: true,
  });
  const [passwordError, setPasswordError] = useState("");

  // Handlers
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
        alert("Please upload an image file under 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => setProfilePhoto(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setProfilePhoto(null);
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const updatedProfile = {
      fullName: form["full-name"].value,
      specialty: form.specialty.value,
      email: form.email.value,
      phone: form.phone.value,
      bio: form.bio.value,
    };
    if (!updatedProfile.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      alert("Please enter a valid email address.");
      return;
    }
    setProfile(updatedProfile);
    alert("Profile updated successfully!"); // Replace with API call
  };

  const handleNotificationToggle = (type) => {
    setNotifications((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const currentPassword = form["current-password"].value;
    const newPassword = form["new-password"].value;
    const confirmPassword = form["confirm-password"].value;

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    setPasswordError("");
    alert("Password updated successfully!"); // Replace with API call
    form.reset();
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8 px-4 sm:px-6 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800">Account Settings</h1>
          <p className="text-blue-600 mt-2">Manage your profile and preferences</p>
        </div>

        {/* Profile Settings Card */}
        <motion.div
          variants={cardVariants}
          className="bg-white rounded-xl shadow-md border border-blue-200"
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold text-blue-900 mb-6 flex items-center">
              <span className="bg-blue-100 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-700" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </span>
              Profile Settings
            </h2>
            <form className="space-y-6" onSubmit={handleProfileSubmit}>
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center sm:space-x-6">
                  <div className="h-24 w-24 bg-blue-50 rounded-full flex items-center justify-center overflow-hidden mb-4 sm:mb-0 border-2 border-blue-200">
                    {profilePhoto ? (
                      <img
                        src={profilePhoto}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-blue-400 text-xs text-center">
                        No photo
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-all duration-200">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Photo
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        aria-label="Upload profile photo"
                      />
                    </label>
                    {profilePhoto && (
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        className="flex items-center px-4 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-all duration-200"
                        onClick={handleRemovePhoto}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </motion.button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="full-name"
                      required
                      className="w-full px-4 py-3 bg-blue-50 rounded-lg border border-blue-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                      defaultValue={profile.fullName}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-1">
                      Specialty
                    </label>
                    <input
                      type="text"
                      name="specialty"
                      required
                      className="w-full px-4 py-3 bg-blue-50 rounded-lg border border-blue-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                      defaultValue={profile.specialty}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 bg-blue-50 rounded-lg border border-blue-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                      defaultValue={profile.email}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      className="w-full px-4 py-3 bg-blue-50 rounded-lg border border-blue-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                      defaultValue={profile.phone}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-blue-800 mb-1">
                      Professional Bio
                    </label>
                    <textarea
                      name="bio"
                      className="w-full px-4 py-3 bg-blue-50 rounded-lg border border-blue-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                      rows={4}
                      defaultValue={profile.bio}
                    />
                  </div>
                </div>
              </div>
              <div>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium"
                >
                  Save Changes
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Notification Settings Card */}
        <motion.div
          variants={cardVariants}
          className="bg-white rounded-xl shadow-md border border-blue-200"
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold text-blue-900 mb-6 flex items-center">
              <span className="bg-blue-100 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-700" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
              </span>
              Notification Preferences
            </h2>
            <div className="space-y-5">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <h3 className="text-sm font-medium text-blue-900">
                    Email Notifications
                  </h3>
                  <p className="text-xs text-blue-600">
                    Receive appointment confirmations and updates via email
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notifications.email}
                    onChange={() => handleNotificationToggle("email")}
                    aria-label="Toggle email notifications"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <h3 className="text-sm font-medium text-blue-900">
                    SMS Notifications
                  </h3>
                  <p className="text-xs text-blue-600">
                    Receive appointment reminders via text message
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notifications.sms}
                    onChange={() => handleNotificationToggle("sms")}
                    aria-label="Toggle SMS notifications"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <h3 className="text-sm font-medium text-blue-900">
                    Payment Notifications
                  </h3>
                  <p className="text-xs text-blue-600">
                    Receive alerts about billing and payment status
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notifications.payment}
                    onChange={() => handleNotificationToggle("payment")}
                    aria-label="Toggle payment notifications"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Change Password Card */}
        <motion.div
          variants={cardVariants}
          className="bg-white rounded-xl shadow-md border border-blue-200"
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold text-blue-900 mb-6 flex items-center">
              <span className="bg-blue-100 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-700" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </span>
              Security Settings
            </h2>
            <form className="space-y-6" onSubmit={handlePasswordSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="current-password"
                    required
                    className="w-full px-4 py-3 bg-blue-50 rounded-lg border border-blue-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                    placeholder="Enter your current password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="new-password"
                    required
                    className="w-full px-4 py-3 bg-blue-50 rounded-lg border border-blue-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                    placeholder="Create a new password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirm-password"
                    required
                    className="w-full px-4 py-3 bg-blue-50 rounded-lg border border-blue-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                    placeholder="Confirm your new password"
                  />
                </div>
                {passwordError && (
                  <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{passwordError}</p>
                )}
              </div>
              <div>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium"
                >
                  Update Password
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}