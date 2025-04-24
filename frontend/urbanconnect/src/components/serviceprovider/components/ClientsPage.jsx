"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Phone,
  Mail,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function ClientsPage() {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [clients, setClients] = useState([]);
  const clientsPerPage = 5;

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get("http://localhost:5000/clients", {
          withCredentials: true,
        });
        console.log("Response data:", response.data);
        console.log("Fetched clients:", response.data.data);
        setClients(response.data.data || []);
      } catch (error) {
        console.error("Error fetching clients:", error);
        alert("Failed to load clients: " + error.message);
      }
    };
    fetchClients();
  }, []);

  // Filter and search clients
  const filteredClients = clients.filter(
    (client) =>
      client.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredClients.length / clientsPerPage);
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredClients.slice(
    indexOfFirstClient,
    indexOfLastClient
  );

  // Handlers
  const handleViewClient = (client) => {
    setSelectedClient(client);
    setViewModalOpen(true);
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

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
  };

  return (
    <motion.div
      className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8 font-sans"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          variants={cardVariants}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 rounded-lg p-2 shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-blue-600">Client Management</h1>
          </div>
          <div className="text-sm text-blue-500 font-medium">
            Total Clients: {clients.length}
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          variants={cardVariants}
          className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden transition-all duration-300"
        >
          <div className="p-8">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row justify-between gap-5 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-400" />
                <input
                  type="text"
                  placeholder="Search clients by name or email..."
                  className="w-full pl-11 pr-4 py-3.5 bg-white rounded-xl border border-blue-200 text-blue-800 placeholder-blue-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-blue-100 shadow-sm">
              <table className="min-w-full divide-y divide-blue-100">
                <thead className="bg-blue-50">
                  <tr>
                    {["Name", "Email", "Phone", "Next Appointment", "Actions"].map(
                      (col) => (
                        <th
                          key={col}
                          className="py-4 px-6 text-left text-sm font-semibold text-blue-700 tracking-wider"
                        >
                          {col}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-50 bg-white">
                  <AnimatePresence>
                    {currentClients.map((client) => (
                      <motion.tr
                        key={client._id}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, x: 20 }}
                        className="hover:bg-blue-50 transition-colors duration-200"
                      >
                        <td className="py-4 px-6 text-sm font-medium text-blue-900">
                          {client.fullName}
                        </td>
                        <td className="py-4 px-6 text-sm text-blue-700">
                          <span className="flex items-center">
                            <Mail className="h-4 w-4 mr-1.5 text-blue-400" />
                            {client.email}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-blue-700">
                          <span className="flex items-center">
                            <Phone className="h-4 w-4 mr-1.5 text-blue-400" />
                            {client.phone}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-blue-700">
                          {client.nextAppointment ? (
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1.5 text-blue-500" />
                              <span className="font-medium">
                                {client.nextAppointment}
                              </span>
                            </span>
                          ) : (
                            <span className="text-blue-300 italic flex items-center">
                              <Calendar className="h-4 w-4 mr-1.5" />
                              None scheduled
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-sm text-blue-700">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleViewClient(client)}
                            className="inline-flex items-center px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors duration-200"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                  
                  {currentClients.length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-blue-400 italic">
                        No clients match your search criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredClients.length > clientsPerPage && (
              <div className="mt-8 flex items-center justify-between px-2">
                <p className="text-sm text-blue-600 font-medium">
                  Showing {indexOfFirstClient + 1} to{" "}
                  {Math.min(indexOfLastClient, filteredClients.length)} of{" "}
                  {filteredClients.length} clients
                </p>
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className={`p-2 rounded-full ${
                      currentPage === 1
                        ? "bg-blue-50 text-blue-300 cursor-not-allowed"
                        : "bg-blue-100 text-blue-600 hover:bg-blue-200 shadow-sm"
                    } transition-all duration-200`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </motion.button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <motion.button
                        key={page}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3.5 py-1.5 rounded-xl text-sm font-medium ${
                          currentPage === page
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                        } transition-all duration-200`}
                      >
                        {page}
                      </motion.button>
                    )
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className={`p-2 rounded-full ${
                      currentPage === totalPages
                        ? "bg-blue-50 text-blue-300 cursor-not-allowed"
                        : "bg-blue-100 text-blue-600 hover:bg-blue-200 shadow-sm"
                    } transition-all duration-200`}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* View Client Modal */}
      <AnimatePresence>
        {viewModalOpen && selectedClient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-blue-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden border border-blue-100"
            >
              <div className="bg-blue-600 p-6">
                <h3 className="text-xl font-bold text-white">
                  Client Details
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-blue-400 font-medium">Full Name</p>
                  <p className="text-blue-900 font-medium">{selectedClient.fullName}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-blue-400 font-medium">Email</p>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-blue-500" />
                    <p className="text-blue-700">{selectedClient.email}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-blue-400 font-medium">Phone</p>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-blue-500" />
                    <p className="text-blue-700">{selectedClient.phone}</p>
                  </div>
                </div>
                {selectedClient.nextAppointment && (
                  <div className="space-y-2">
                    <p className="text-sm text-blue-400 font-medium">Next Appointment</p>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                      <p className="text-blue-700">{selectedClient.nextAppointment}</p>
                    </div>
                  </div>
                )}
                <div className="pt-4 flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setViewModalOpen(false)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Close
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}