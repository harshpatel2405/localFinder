"use client";

import { useState, useEffect } from "react";
import { Search, Filter, ArrowRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function AdminAppointmentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:5000/appointments/provider",
          {
            withCredentials: true,
          }
        );
        console.log("Fetched appointments:", response.data.data);
        setAppointments(response.data.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("Failed to load appointments. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Filter and search appointments
  const filteredAppointments = appointments
    .filter(
      (appointment) =>
        statusFilter === "all" || appointment.status === statusFilter
    )
    .filter(
      (appointment) =>
        (appointment.user?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (appointment.provider?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (appointment.service?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

  // Format appointment data for table
  const appointmentData = filteredAppointments.map((appointment) => ({
    user: appointment.fullName,
    phone: appointment.phone,
    service: appointment.serviceName,
    dateTime: `${appointment.date}, ${appointment.time}`,
    status: (
      <span
        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
          appointment.status === "confirmed"
            ? "bg-blue-100 text-blue-800"
            : appointment.status === "pending"
            ? "bg-indigo-100 text-indigo-800"
            : appointment.status === "completed"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {appointment.status?.charAt(0).toUpperCase() +
          appointment.status?.slice(1)}
      </span>
    ),
    action: (
      <select
        className="px-2 py-1 bg-blue-50 rounded-md text-xs border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
        value={appointment.status}
        onChange={(e) =>
          console.log(
            `Update status for ${appointment.id} to ${e.target.value}`
          )
        }
      >
        <option value="confirmed">Confirmed</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>
    ),
  }));

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
    hover: {
      scale: 1.01,
      boxShadow: "0 8px 16px rgba(59, 130, 246, 0.15)",
      transition: { duration: 0.3 },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-6 px-4 sm:px-6 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div
          variants={cardVariants}
          whileHover="hover"
          className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-blue-800">Appointments</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                View All <ArrowRight size={16} className="ml-1" />
              </motion.button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500" />
                <input
                  type="text"
                  placeholder="Search appointments..."
                  className="w-full pl-10 pr-4 py-2.5 bg-blue-50 rounded-xl border border-blue-100 text-sm placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-blue-500" />
                <select
                  className="px-4 py-2.5 bg-blue-50 rounded-xl border border-blue-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                <span className="ml-2 text-blue-700">Loading appointments...</span>
              </div>
            ) : error ? (
              <div className="bg-red-50 p-4 rounded-lg text-red-700 text-center">
                {error}
              </div>
            ) : appointmentData.length === 0 ? (
              <div className="bg-blue-50 p-8 rounded-lg text-blue-700 text-center">
                No appointments found. Try adjusting your search or filter.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-blue-100">
                <table className="min-w-full divide-y divide-blue-100">
                  <thead className="bg-blue-50">
                    <tr>
                      {[
                        "User",
                        "Phone",
                        "Service",
                        "Date & Time",
                        "Status",
                        "Action",
                      ].map((col, index) => (
                        <th
                          key={index}
                          className="py-3.5 px-4 text-left text-sm font-semibold text-blue-900"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-blue-50">
                    <AnimatePresence>
                      {appointmentData.map((row, index) => (
                        <motion.tr
                          key={index}
                          variants={rowVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          className="hover:bg-blue-50/50 transition-colors duration-200"
                        >
                          <td className="py-4 px-4 text-sm font-medium text-blue-900">
                            {row.user}
                          </td>
                          <td className="py-4 px-4 text-sm text-blue-700">
                            {row.phone}
                          </td>
                          <td className="py-4 px-4 text-sm text-blue-700">
                            {row.service}
                          </td>
                          <td className="py-4 px-4 text-sm text-blue-700">
                            {row.dateTime}
                          </td>
                          <td className="py-4 px-4 text-sm">{row.status}</td>
                          <td className="py-4 px-4 text-sm">{row.action}</td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}