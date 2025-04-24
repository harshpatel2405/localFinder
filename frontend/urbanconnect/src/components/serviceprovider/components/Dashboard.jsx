"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  CheckCircle,
  DollarSign,
  Clock,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Loader2,
  User,
  Mail,
  Phone
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function Dashboard() {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [userData, setUserData] = useState([]);
  const itemsPerPage = 5;

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch statistics data
        try {
          const statsResponse = await fetch('/api/dashboard/stats');
          const statsData = await statsResponse.json();
          
          // Transform API data to match our component structure
          const formattedStats = [
            {
              title: "Total Users",
              value: statsData.totalUsers?.toLocaleString() || "0",
              icon: Calendar,
              color: "bg-blue-50 text-blue-600",
            },
            {
              title: "Service Providers",
              value: statsData.serviceProviders?.toLocaleString() || "0",
              icon: CheckCircle,
              color: "bg-blue-100 text-blue-700",
            },
            {
              title: "Revenue",
              value: `$${statsData.revenue?.toLocaleString() || "0"}`,
              icon: DollarSign,
              color: "bg-blue-200 text-blue-800",
            },
            {
              title: "Active Users",
              value: statsData.activeUsers?.toLocaleString() || "0",
              icon: Clock,
              color: "bg-blue-300 text-blue-900",
            },
          ];
          setStats(formattedStats);
        } catch (error) {
          console.error("Error fetching stats:", error);
          // Fallback stats data
          setStats([
            {
              title: "Total Users",
              value: "3",
              icon: User,
              color: "bg-blue-50 text-blue-600",
            },
            {
              title: "Service Providers",
              value: "1", 
              icon: CheckCircle,
              color: "bg-blue-100 text-blue-700",
            },
            {
              title: "Revenue",
              value: "$0",
              icon: DollarSign,
              color: "bg-blue-200 text-blue-800",
            },
            {
              title: "Active Users",
              value: "3",
              icon: Clock,
              color: "bg-blue-300 text-blue-900",
            },
          ]);
        }
        
        // Process the users data from your provided response
        // In a real implementation, this would come from your API
        const usersData = [
          {"role":"USER","_id":"68093d95c7123bea2f4802c6","fullName":"Harsh Patel","email":"demo@yopmail.com","password":"$2b$10$hglN7is0q5oKh4t34SBTr.ac3tf4ETeNyZx/Nd2OgyLqT5H6Xh26W","phone":9966388552,"userType":"user","address":"","bio":"","profilePicture":"","createdAt":"2025-04-23T19:20:53.871Z","updatedAt":"2025-04-23T19:20:53.871Z","__v":0},
          {"role":"USER","_id":"68093defc7123bea2f4802cb","fullName":"Harsh","email":"harsh123@yopmail.com","password":"$2b$10$Vl7MW0umPzG1jI.fllY8IucSw4YyJ/QQpD1GVzLIjVb1zVJb8vwMe","phone":9966388552,"userType":"user","address":"","bio":"","profilePicture":"","createdAt":"2025-04-23T19:22:23.085Z","updatedAt":"2025-04-23T19:22:23.085Z","__v":0},
          {"role":"USER","_id":"68093efbc7123bea2f4802fa","fullName":"Sarjan","email":"sarjan@yopmail.com","password":"$2b$10$0i9kdo.YRn.H.XKdF/9ur.4JOtRpnAO5PnrKZY6OTYQ1KjICqnKIO","phone":9988566993,"userType":"provider","address":"","bio":"","profilePicture":"","createdAt":"2025-04-23T19:26:51.352Z","updatedAt":"2025-04-23T19:26:51.352Z","__v":0}
        ];
        
        // In a real implementation, you would get this from your API:
        // const response = await axios.get('http://localhost:5000/auth/users');
        // const usersData = response.data;
        
        setUserData(usersData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Pagination for users
  const totalPages = Math.ceil(userData.length / itemsPerPage);
  const indexOfLast = page * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentUsers = userData.slice(indexOfFirst, indexOfLast);

  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get user type style
  const getUserTypeStyles = (userType) => {
    switch (userType.toLowerCase()) {
      case "provider":
        return "bg-blue-50 text-blue-700 border border-blue-300";
      case "user":
        return "bg-green-50 text-green-700 border border-green-300";
      case "admin":
        return "bg-purple-50 text-purple-700 border border-purple-300";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-300";
    }
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
      className="min-h-screen bg-white py-6 px-4 sm:px-6 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-blue-900">User Management</h1>
            <p className="text-blue-500">Manage your platform's user accounts</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-4 md:mt-0 flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
          >
            <BarChart3 className="h-4 w-4" />
            <span>View Analytics</span>
          </motion.button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
            <span className="ml-3 text-blue-500 text-lg font-medium">Loading user data...</span>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <motion.div
              variants={cardVariants}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100"
                >
                  <div className="flex items-center p-6">
                    <div className={`p-3 rounded-full ${stat.color}`}>
                      <stat.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <div className="ml-5 flex-1">
                      <p className="text-sm font-medium text-blue-400">
                        {stat.title}
                      </p>
                      <p className="text-xl font-bold text-blue-900">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                  <div className={`h-1 w-full ${stat.color.split(" ")[0]}`}></div>
                </motion.div>
              ))}
            </motion.div>

            {/* User List */}
            <motion.div
              variants={cardVariants}
              className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-blue-900">
                    User Accounts
                  </h3>
                  <span className="text-sm text-blue-500">
                    {userData.length} registered users
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-blue-100">
                        {["Name", "Email", "Phone", "User Type", "Created"].map(
                          (col) => (
                            <th
                              key={col}
                              className="py-3 px-4 text-left text-sm font-semibold text-blue-500"
                            >
                              {col}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {currentUsers.map((user) => (
                          <motion.tr
                            key={user._id}
                            variants={rowVariants}
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0, x: 20 }}
                            className="hover:bg-blue-50 transition-colors duration-200"
                          >
                            <td className="py-4 px-4 text-sm font-medium text-blue-900">
                              {user.fullName || "N/A"}
                            </td>
                            <td className="py-4 px-4 text-sm text-blue-700">
                              {user.email}
                            </td>
                            <td className="py-4 px-4 text-sm text-blue-700">
                              {user.phone ? `+${user.phone}` : "N/A"}
                            </td>
                            <td className="py-4 px-4 text-sm">
                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getUserTypeStyles(user.userType)}`}
                              >
                                {user.userType.charAt(0).toUpperCase() + user.userType.slice(1)}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-sm text-blue-700">
                              {formatDate(user.createdAt)}
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                {userData.length > itemsPerPage && (
                  <div className="mt-6 flex items-center justify-between">
                    <p className="text-sm text-blue-500">
                      Showing {indexOfFirst + 1} to{" "}
                      {Math.min(indexOfLast, userData.length)} of{" "}
                      {userData.length} users
                    </p>
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className={`p-2 rounded-full ${
                          page === 1
                            ? "bg-blue-100 text-blue-300 cursor-not-allowed"
                            : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                        } transition-all duration-200`}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </motion.button>
                      {Array.from(
                        { length: totalPages },
                        (_, i) => i + 1
                      ).map((pageNum) => (
                        <motion.button
                          key={pageNum}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setPage(pageNum)}
                          className={`w-8 h-8 flex items-center justify-center rounded-full text-sm ${
                            page === pageNum
                              ? "bg-blue-600 text-white"
                              : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                          } transition-all duration-200`}
                        >
                          {pageNum}
                        </motion.button>
                      ))}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                        className={`p-2 rounded-full ${
                          page === totalPages
                            ? "bg-blue-100 text-blue-300 cursor-not-allowed"
                            : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                        } transition-all duration-200`}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
}