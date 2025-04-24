"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Eye, Edit, Trash, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import axios from "axios";

export default function AdminProvidersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");
  const [isSpecialtyFilterOpen, setIsSpecialtyFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [providers, setProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const providersPerPage = 5;

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:5000/auth/admin/getAllServiceProviders");
        setProviders(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching providers:", err);
        setError("Failed to load providers. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviders();
  }, []);

  // Get unique specialties from providers for filter options
  const specialties = providers.length > 0 
    ? ["all", ...new Set(providers.filter(p => p.userType === "provider" && p.specialty).map(p => p.specialty.toLowerCase()))]
    : ["all"];

  // Filter and search
  const filteredProviders = providers
    .filter((provider) => provider.userType === "provider")
    .filter((provider) => specialtyFilter === "all" || 
      (provider.specialty && provider.specialty.toLowerCase() === specialtyFilter))
    .filter(
      (provider) =>
        (provider._id && provider._id.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (provider.fullName && provider.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (provider.email && provider.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  // Pagination
  const totalPages = Math.ceil(filteredProviders.length / providersPerPage);
  const indexOfLastProvider = currentPage * providersPerPage;
  const indexOfFirstProvider = indexOfLastProvider - providersPerPage;
  const currentProviders = filteredProviders.slice(indexOfFirstProvider, indexOfLastProvider);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Actions
  const handleView = (provider) => console.log("View provider:", provider._id);
  const handleEdit = (provider) => console.log("Edit provider:", provider._id);
  const handleDelete = (provider) => console.log("Delete provider:", provider._id);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
          <p className="text-blue-600 font-medium">Loading providers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
          <h3 className="text-red-600 font-semibold text-lg mb-2">Error</h3>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-blue-900">Service Providers</h2>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Add Provider
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-400" />
                <input
                  type="text"
                  placeholder="Search providers..."
                  className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-blue-200 text-sm placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative">
                <button
                  className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl border border-blue-200 text-sm text-blue-700 hover:bg-blue-50 transition-all duration-200"
                  onClick={() => setIsSpecialtyFilterOpen(!isSpecialtyFilterOpen)}
                >
                  <Filter className="h-4 w-4" />
                  {specialtyFilter === "all" ? "All Specialties" : specialtyFilter.charAt(0).toUpperCase() + specialtyFilter.slice(1)}
                </button>
                {isSpecialtyFilterOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-blue-100 z-10 overflow-hidden"
                  >
                    {specialties.map((specialty) => (
                      <button
                        key={specialty}
                        className="block w-full text-left px-4 py-2 text-sm text-blue-800 hover:bg-blue-50 transition-all duration-200"
                        onClick={() => {
                          setSpecialtyFilter(specialty);
                          setIsSpecialtyFilterOpen(false);
                        }}
                      >
                        {specialty === "all"
                          ? "All Specialties"
                          : specialty.charAt(0).toUpperCase() + specialty.slice(1)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {filteredProviders.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                  <Search className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-lg font-medium text-blue-900 mb-1">No providers found</h3>
                <p className="text-blue-600">Try adjusting your search or filter to find what you're looking for.</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto -mx-6">
                  <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden border border-blue-100 sm:rounded-lg">
                      <table className="min-w-full divide-y divide-blue-100">
                        <thead className="bg-blue-50">
                          <tr>
                            {["Provider ID", "Full Name", "Email", "Phone", "Joined", "Actions"].map((col) => (
                              <th key={col} className="py-3.5 px-4 text-left text-sm font-semibold text-blue-900">
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-100 bg-white">
                          {currentProviders.map((provider) => (
                            <tr
                              key={provider._id}
                              className="hover:bg-blue-50/50 transition-colors duration-200"
                            >
                              <td className="py-4 px-4 text-sm font-medium text-blue-900 whitespace-nowrap">
                                <span className="font-mono">{provider._id.slice(-8)}</span>
                              </td>
                              <td className="py-4 px-4 text-sm text-blue-800 whitespace-nowrap">
                                {provider.fullName || "N/A"}
                              </td>
                              <td className="py-4 px-4 text-sm text-blue-600 whitespace-nowrap">
                                {provider.email}
                              </td>
                              <td className="py-4 px-4 text-sm text-blue-600 whitespace-nowrap">
                                {provider.phone || "N/A"}
                              </td>
                              <td className="py-4 px-4 text-sm text-blue-600 whitespace-nowrap">
                                {formatDate(provider.createdAt)}
                              </td>
                              <td className="py-4 px-4 text-sm text-right whitespace-nowrap">
                                <div className="flex justify-end space-x-2">
                                  <button
                                    onClick={() => handleView(provider)}
                                    className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all duration-200"
                                    title="View details"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleEdit(provider)}
                                    className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all duration-200"
                                    title="Edit provider"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(provider)}
                                    className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-200"
                                    title="Delete provider"
                                  >
                                    <Trash className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {filteredProviders.length > providersPerPage && (
                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-blue-600">
                      Showing {indexOfFirstProvider + 1} to {Math.min(indexOfLastProvider, filteredProviders.length)} of{" "}
                      {filteredProviders.length} providers
                    </p>
                    <div className="flex items-center space-x-2">
                      <button
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={`p-2 rounded-full ${
                          currentPage === 1
                            ? "bg-blue-50 text-blue-300 cursor-not-allowed"
                            : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                        } transition-all duration-200`}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-8 h-8 flex items-center justify-center rounded-full text-sm ${
                            currentPage === page
                              ? "bg-blue-600 text-white"
                              : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                          } transition-all duration-200`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={`p-2 rounded-full ${
                          currentPage === totalPages
                            ? "bg-blue-50 text-blue-300 cursor-not-allowed"
                            : "bg-blue-100 text-blue-600 hover:bg-blue-200"
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