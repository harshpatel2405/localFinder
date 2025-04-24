"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Loader2,
  CalendarIcon,
  RefreshCcw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function AdminPaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const paymentsPerPage = 5;

  // Fetch payments data
  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/auth/admin/payments");
      console.log("Fetched payments:", response.data);
      
      // Transform the data to match our UI needs
      const formattedPayments = response.data.map(payment => ({
        id: payment.razorpay_payment_id,
        orderId: payment.razorpay_order_id,
        signature: payment.razorpay_signature,
        date: new Date(payment.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric"
        }),
        // Determine status based on existence of signature
        status: payment.razorpay_signature ? "paid" : "pending"
      }));
      
      setPayments(formattedPayments);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch payments");
      console.error("Error fetching payments:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search payments
  const filteredPayments = payments
    .filter(
      (payment) => statusFilter === "all" || payment.status === statusFilter
    )
    .filter(
      (payment) =>
        payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.orderId.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Pagination logic
  const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage);
  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentPayments = filteredPayments.slice(
    indexOfFirstPayment,
    indexOfLastPayment
  );

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      "Payment ID",
      "Order ID",
      "Signature",
      "Date",
      "Status",
    ];
    const csvData = filteredPayments.map((payment) => [
      payment.id,
      payment.orderId,
      payment.signature,
      payment.date,
      payment.status,
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "payments.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-6 px-4 sm:px-6 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div
          variants={cardVariants}
          className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden"
        >
          <div className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
              <div className="flex items-center">
                <div className="bg-blue-600 w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                  <CalendarIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Payments Overview</h2>
                  <p className="text-sm text-gray-500">Manage and monitor all transactions</p>
                </div>
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800 px-3 py-1 border border-blue-200 rounded-lg"
                  onClick={fetchPayments}
                >
                  <RefreshCcw size={16} className="mr-2" />
                  Refresh
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800 px-3 py-1 border border-blue-200 rounded-lg"
                >
                  View All <ArrowRight size={16} className="ml-1" />
                </motion.button>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-xl mb-6">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-400" />
                  <input
                    type="text"
                    placeholder="Search by payment ID or order ID..."
                    className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-blue-200 text-sm placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-blue-500" />
                    <select
                      className="px-4 py-2 bg-white rounded-xl border border-blue-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Statuses</option>
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition-all duration-200"
                    onClick={exportToCSV}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </motion.button>
                </div>
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                <span className="ml-2 text-blue-500">Loading payments...</span>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-500 p-4 rounded-xl text-center">
                {error}
                <button 
                  className="ml-2 underline"
                  onClick={fetchPayments}
                >
                  Try again
                </button>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-blue-100">
                    <thead className="bg-blue-50">
                      <tr>
                        {[
                          "Payment ID",
                          "Order ID",
                          "Date",
                          "Status",
                          "Actions",
                        ].map((col, index) => (
                          <th
                            key={index}
                            className="py-3 px-4 text-left text-sm font-semibold text-blue-700"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-100">
                      <AnimatePresence>
                        {currentPayments.length > 0 ? (
                          currentPayments.map((payment) => (
                            <motion.tr
                              key={payment.id}
                              variants={rowVariants}
                              initial="hidden"
                              animate="visible"
                              exit={{ opacity: 0, x: 20 }}
                              className="hover:bg-blue-50 transition-colors duration-200"
                            >
                              <td className="py-3 px-4 text-sm font-medium text-gray-800">
                                {payment.id}
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600">
                                {payment.orderId}
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600">
                                {payment.date}
                              </td>
                              <td className="py-3 px-4 text-sm">
                                <span
                                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                    payment.status === "paid"
                                      ? "bg-green-100 text-green-800"
                                      : payment.status === "pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {payment.status.charAt(0).toUpperCase() +
                                    payment.status.slice(1)}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-sm">
                                <div className="flex space-x-2">
                                  <button className="text-blue-600 hover:text-blue-800 transition-colors">
                                    View
                                  </button>
                                  <button className="text-blue-600 hover:text-blue-800 transition-colors">
                                    Details
                                  </button>
                                </div>
                              </td>
                            </motion.tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="py-8 text-center text-gray-500">
                              No payments found matching your criteria
                            </td>
                          </tr>
                        )}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
                {/* Pagination */}
                {filteredPayments.length > paymentsPerPage && (
                  <div className="mt-6 flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Showing {indexOfFirstPayment + 1} to{" "}
                      {Math.min(indexOfLastPayment, filteredPayments.length)} of{" "}
                      {filteredPayments.length} payments
                    </p>
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={`p-2 rounded-full ${
                          currentPage === 1
                            ? "bg-blue-100 text-blue-300 cursor-not-allowed"
                            : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                        } transition-all duration-200`}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </motion.button>
                      {Array.from(
                        { length: totalPages },
                        (_, index) => index + 1
                      ).map((page) => (
                        <motion.button
                          key={page}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1 rounded-xl text-sm ${
                            currentPage === page
                              ? "bg-blue-600 text-white"
                              : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                          } transition-all duration-200`}
                        >
                          {page}
                        </motion.button>
                      ))}
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={`p-2 rounded-full ${
                          currentPage === totalPages
                            ? "bg-blue-100 text-blue-300 cursor-not-allowed"
                            : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                        } transition-all duration-200`}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>

        {/* Payment Analytics Card */}
        <motion.div
          variants={cardVariants}
          className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden"
        >
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <p className="text-sm text-blue-600 mb-1">Total Transactions</p>
                <p className="text-2xl font-bold">{payments.length}</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <p className="text-sm text-blue-600 mb-1">Successful Payments</p>
                <p className="text-2xl font-bold">{payments.filter(p => p.status === "paid").length}</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <p className="text-sm text-blue-600 mb-1">Pending Payments</p>
                <p className="text-2xl font-bold">{payments.filter(p => p.status === "pending").length}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}