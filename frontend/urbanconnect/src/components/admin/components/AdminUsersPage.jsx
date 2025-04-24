"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Eye, Edit, Trash, ChevronLeft, ChevronRight, UserPlus, Loader2 } from "lucide-react";
import axios from "axios";

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isRoleFilterOpen, setIsRoleFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const usersPerPage = 5;

  // Fetch users data from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/auth/admin/bookings");
        setUsers(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter and search
  const filteredUsers = users
    .filter((user) => roleFilter === "all" || user.userType?.toLowerCase() === roleFilter)
    .filter(
      (user) =>
        user._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // User actions
  const handleView = (user) => console.log("View user:", user._id);
  const handleEdit = (user) => console.log("Edit user:", user._id);
  
  const handleDelete = async (user) => {
    if (window.confirm(`Are you sure you want to delete user: ${user.fullName}?`)) {
      try {
        console.log("Delete user:", user._id);
      } catch (err) {
        console.error("Error deleting user:", err);
        alert("Failed to delete user. Please try again.");
      }
    }
  };
  
  const handleAddUser = () => console.log("Add new user");

  // Format date
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return "Invalid date";
    }
  };

  // Role badge styling
  const getRoleBadgeColor = (userType) => {
    switch (userType?.toLowerCase()) {
      case 'admin':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'provider':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      default:
        return 'bg-blue-100 text-blue-800 border border-blue-200';
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      {/* Decorative elements */}
      <div className="fixed top-20 right-20 w-64 h-64 bg-blue-50 rounded-full filter blur-3xl opacity-20 -z-10"></div>
      <div className="fixed bottom-20 left-20 w-80 h-80 bg-blue-50 rounded-full filter blur-3xl opacity-20 -z-10"></div>
      
      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
            <p className="text-blue-600 mt-1">Manage all platform users efficiently</p>
          </div>
          <button 
            onClick={handleAddUser}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add New User</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, email or ID..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative">
                <button
                  className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 hover:border-blue-300 transition-all duration-200"
                  onClick={() => setIsRoleFilterOpen(!isRoleFilterOpen)}
                >
                  <Filter className="h-4 w-4" />
                  {roleFilter === "all" ? "All Roles" : roleFilter.charAt(0).toUpperCase() + roleFilter.slice(1)}
                </button>
                {isRoleFilterOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10 overflow-hidden">
                    {["all", "user", "provider", "admin"].map((role) => (
                      <button
                        key={role}
                        className={`block w-full text-left px-4 py-2.5 text-sm ${
                          roleFilter === role 
                            ? "bg-blue-50 text-blue-600" 
                            : "text-gray-700 hover:bg-gray-50"
                        } transition-all duration-200`}
                        onClick={() => {
                          setRoleFilter(role);
                          setIsRoleFilterOpen(false);
                        }}
                      >
                        {role === "all" ? "All Roles" : role.charAt(0).toUpperCase() + role.slice(1)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Users Table */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                <span className="ml-2 text-gray-600">Loading users...</span>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <div className="text-red-500 mb-2">{error}</div>
                <button 
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </button>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">User ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Joined</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-blue-800 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentUsers.length ? (
                        currentUsers.map((user) => (
                          <tr key={user._id} className="hover:bg-blue-50/30 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user._id?.substring(0, 8)}...</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.fullName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.userType)}`}>
                                {user.userType || "User"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatDate(user.createdAt)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => handleView(user)}
                                  className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all duration-200"
                                  title="View details"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleEdit(user)}
                                  className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all duration-200"
                                  title="Edit user"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(user)}
                                  className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-200"
                                  title="Delete user"
                                >
                                  <Trash className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="py-12 text-center text-gray-500">
                            No users found matching your criteria
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {filteredUsers.length > usersPerPage && (
                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-4 sm:mb-0">
                      Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of{" "}
                      {filteredUsers.length} users
                    </p>
                    <div className="flex items-center space-x-2">
                      <button
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={`p-2 rounded-lg ${
                          currentPage === 1
                            ? "bg-gray-50 text-gray-300 cursor-not-allowed"
                            : "bg-white text-gray-700 border border-gray-200 hover:bg-blue-50 hover:border-blue-200"
                        } transition-all duration-200`}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`h-8 w-8 flex items-center justify-center rounded-lg text-sm ${
                            currentPage === page
                              ? "bg-blue-600 text-white"
                              : "bg-white text-gray-700 border border-gray-200 hover:bg-blue-50 hover:border-blue-200"
                          } transition-all duration-200`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={`p-2 rounded-lg ${
                          currentPage === totalPages
                            ? "bg-gray-50 text-gray-300 cursor-not-allowed"
                            : "bg-white text-gray-700 border border-gray-200 hover:bg-blue-50 hover:border-blue-200"
                        } transition-all duration-200`}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}