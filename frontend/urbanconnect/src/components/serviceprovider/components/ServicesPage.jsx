"use client";

import { useState, useEffect } from "react";
import {
  Edit,
  Trash2,
  Plus,
  DollarSign,
  Clock,
  ChevronLeft,
  ChevronRight,
  X,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useForm } from "react-hook-form";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const servicesPerPage = 5;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/pservices/services",
          {
            withCredentials: true,
          }
        );
        setServices(response.data);
      } catch (error) {
        console.error(
          "Error fetching services:",
          error.response ? error.response.data : error.message
        );
      }
    };
    fetchServices();
  }, []);

  const totalPages = Math.ceil(services.length / servicesPerPage);
  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = services.slice(
    indexOfFirstService,
    indexOfLastService
  );

  const resizeImage = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      img.onload = () => {
        const maxWidth = 320;
        const maxHeight = 192;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) reject(new Error("Failed to create blob"));
            resolve(blob);
          },
          "image/jpeg",
          0.95
        );
      };
      img.onerror = () => reject(new Error("Invalid image file"));
      img.src = URL.createObjectURL(file);
      img.crossOrigin = "anonymous";
    });
  };

  const validateImage = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) return reject("No file selected");
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        return reject("Only JPEG or PNG images are allowed");
      }
      if (file.size > 5 * 1024 * 1024) {
        return reject("Image size must be less than 5MB");
      }
      resolve();
    });
  };

  const handleAddService = async (data) => {
    let imageBlob = data.image[0];
    try {
      await validateImage(imageBlob);
      imageBlob = await resizeImage(imageBlob);
    } catch (error) {
      console.error("Image validation or resizing error:", error);
      alert(error.message || "Failed to process image. Please try again.");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("category", data.category);
    formData.append("description", data.description);
    formData.append("duration", parseInt(data.duration));
    formData.append("price", parseFloat(data.price));
    formData.append("active", data.active ? "true" : "false");
    formData.append("rating", data.rating || "4.5/5");
    formData.append("provider", data.provider);
    formData.append("providerBio", data.providerBio);
    formData.append("availability", data.availability);
    formData.append("image", imageBlob, "resized-image.jpg");

    try {
      const response = await axios.post(
        "http://localhost:5000/pservices/services/create",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setServices([...services, response.data]);
      setAddModalOpen(false);
      reset();
    } catch (error) {
      console.error(
        "Error adding service:",
        error.response ? error.response.data : error.message
      );
      alert(
        error.response?.data?.message ||
          "Failed to add service. Check if the backend is running at http://localhost:5000/pservices/services/create."
      );
    }
  };

  const handleEditService = (service) => {
    setSelectedService(service);
    setValue("name", service.name);
    setValue("category", service.category);
    setValue("description", service.description);
    setValue("duration", service.duration);
    setValue("price", service.price);
    setValue("active", service.active);
    setValue("rating", service.rating);
    setValue("provider", service.provider);
    setValue("providerBio", service.providerBio);
    setValue("availability", service.availability);
    setEditModalOpen(true);
  };

  const handleSaveService = async (data) => {
    let imageBlob = data.image && data.image[0] ? data.image[0] : null;
    if (imageBlob) {
      try {
        await validateImage(imageBlob);
        imageBlob = await resizeImage(imageBlob);
      } catch (error) {
        console.error("Image validation or resizing error:", error);
        alert(error.message || "Failed to process image. Please try again.");
        return;
      }
    }

    const formData = new FormData();
    formData.append("id", selectedService.id);
    formData.append("name", data.name);
    formData.append("category", data.category);
    formData.append("description", data.description);
    formData.append("duration", parseInt(data.duration));
    formData.append("price", parseFloat(data.price));
    formData.append("active", data.active ? "true" : "false");
    formData.append("rating", data.rating || "4.5/5");
    formData.append("provider", data.provider);
    formData.append("providerBio", data.providerBio);
    formData.append("availability", data.availability);
    if (imageBlob) {
      formData.append("image", imageBlob, "resized-image.jpg");
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/pservices/services/update/${selectedService.id}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setServices(
        services.map((s) => (s.id === selectedService.id ? response.data : s))
      );
      setEditModalOpen(false);
      reset();
    } catch (error) {
      console.error(
        "Error updating service:",
        error.response ? error.response.data : error.message
      );
      alert(
        error.response?.data?.message ||
          "Failed to update service. Check if the backend is running."
      );
    }
  };

  const handleDeleteService = (id) => {
    axios
      .delete(`http://localhost:5000/pservices/services/delete/${id}`, {
        withCredentials: true,
      })
      .then(() => {
        setServices(services.filter((service) => service.id !== id));
      })
      .catch((error) => {
        console.error(
          "Error deleting service:",
          error.response ? error.response.data : error.message
        );
        alert(
          error.response?.data?.message ||
            "Failed to delete service. Check if the backend is running."
        );
      });
  };

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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-blue-800">Service Management</h1>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
            onClick={() => setAddModalOpen(true)}
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Service
          </motion.button>
        </div>

        <motion.div
          variants={cardVariants}
          className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden transition-all duration-300"
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold text-blue-800 mb-6 flex items-center">
              <span className="inline-block w-1 h-6 bg-blue-500 mr-3 rounded"></span>
              My Services
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-blue-100">
                <thead className="bg-blue-50">
                  <tr>
                    {[
                      "Service Name",
                      "Duration",
                      "Price",
                      "Status",
                      "Actions",
                    ].map((col) => (
                      <th
                        key={col}
                        className="py-4 px-6 text-left text-sm font-semibold text-blue-700 tracking-wider"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100 bg-white">
                  {currentServices.length > 0 ? (
                    currentServices.map((service) => (
                      <tr
                        key={service.id}
                        className="hover:bg-blue-50 transition-colors duration-200"
                      >
                        <td className="py-4 px-6 text-sm font-medium text-blue-900">
                          {service.name || "N/A"}
                        </td>
                        <td className="py-4 px-6 text-sm text-blue-700">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-blue-400" />
                            {service.duration ? `${service.duration} min` : "N/A"}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-blue-700">
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1 text-blue-400" />
                            {service.price ? service.price.toFixed(2) : "0.00"}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                              service.active
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {service.active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm">
                          <div className="flex space-x-3">
                            <motion.button
                              whileHover={{
                                scale: 1.05,
                                backgroundColor: "#e0f2fe",
                              }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleEditService(service)}
                              className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-200"
                            >
                              <Edit className="h-4 w-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{
                                scale: 1.05,
                                backgroundColor: "#fee2e2",
                              }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDeleteService(service.id)}
                              className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200"
                            >
                              <Trash2 className="h-4 w-4" />
                            </motion.button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-blue-600">
                        <div className="flex flex-col items-center">
                          <AlertCircle className="h-8 w-8 mb-2 text-blue-400" />
                          <p>No services found. Add your first service to get started.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {services.length > servicesPerPage && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-blue-600 font-medium">
                  Showing {indexOfFirstService + 1} to{" "}
                  {Math.min(indexOfLastService, services.length)} of{" "}
                  {services.length} services
                </p>
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: "#e0f2fe" }}
                    whileTap={{ scale: 0.95 }}
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className={`p-2 rounded-lg ${
                      currentPage === 1
                        ? "bg-blue-50 text-blue-300 cursor-not-allowed"
                        : "bg-blue-50 text-blue-600 hover:bg-blue-100"
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
                        className={`px-3.5 py-1.5 rounded-lg text-sm font-medium ${
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
                    whileHover={{ scale: 1.05, backgroundColor: "#e0f2fe" }}
                    whileTap={{ scale: 0.95 }}
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className={`p-2 rounded-lg ${
                      currentPage === totalPages
                        ? "bg-blue-50 text-blue-300 cursor-not-allowed"
                        : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                    } transition-all duration-200`}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <AnimatePresence>
          {(addModalOpen || editModalOpen) && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-blue-900/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white rounded-xl shadow-xl border border-blue-100 w-full max-w-md mx-4 p-6 max-h-[85vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-blue-800 flex items-center">
                    <span className="inline-block w-1 h-6 bg-blue-500 mr-3 rounded"></span>
                    {addModalOpen ? "Add New Service" : "Edit Service"}
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setAddModalOpen(false);
                      setEditModalOpen(false);
                      reset();
                    }}
                    className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                  >
                    <X className="text-xl" />
                  </motion.button>
                </div>

                <form
                  onSubmit={handleSubmit(
                    addModalOpen ? handleAddService : handleSaveService
                  )}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1.5">
                      Service Name
                    </label>
                    <input
                      {...register("name", { required: "Name is required" })}
                      className="w-full rounded-lg border-blue-200 bg-blue-50 p-3 text-blue-800 placeholder-blue-400 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200"
                      placeholder="Enter service name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1.5">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1.5">
                      Category
                    </label>
                    <select
                      {...register("category", {
                        required: "Category is required",
                      })}
                      className="w-full rounded-lg border-blue-200 bg-blue-50 p-3 text-blue-800 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200"
                    >
                      <option value="">Select a category</option>
                      {[
                        "Beauty & Wellness",
                        "Home Repairs & Maintenance",
                        "Home Improvement",
                        "Health & Fitness",
                        "Events & Occasions",
                        "Home Services",
                      ].map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-red-500 text-sm mt-1.5">
                        {errors.category.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1.5">
                      Description
                    </label>
                    <textarea
                      {...register("description", {
                        required: "Description is required",
                      })}
                      className="w-full rounded-lg border-blue-200 bg-blue-50 p-3 text-blue-800 placeholder-blue-400 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 h-24 resize-none"
                      placeholder="Enter service description"
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1.5">
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-1.5">
                        Duration (minutes)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Clock className="text-blue-400 h-5 w-5" />
                        </div>
                        <input
                          type="number"
                          {...register("duration", {
                            required: "Duration is required",
                            min: { value: 5, message: "Minimum 5 minutes" },
                          })}
                          className="w-full pl-10 rounded-lg border-blue-200 bg-blue-50 p-3 text-blue-800 placeholder-blue-400 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200"
                          placeholder="30"
                          min="5"
                          step="5"
                        />
                      </div>
                      {errors.duration && (
                        <p className="text-red-500 text-sm mt-1.5">
                          {errors.duration.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-1.5">
                        Price
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DollarSign className="text-blue-400 h-5 w-5" />
                        </div>
                        <input
                          type="number"
                          {...register("price", {
                            required: "Price is required",
                            min: { value: 0, message: "Price must be positive" },
                          })}
                          className="w-full pl-10 rounded-lg border-blue-200 bg-blue-50 p-3 text-blue-800 placeholder-blue-400 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      {errors.price && (
                        <p className="text-red-500 text-sm mt-1.5">
                          {errors.price.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1.5">
                      Service Image (JPEG/PNG, max 5MB)
                    </label>
                    <div className="border-2 border-dashed border-blue-200 rounded-lg p-4 bg-blue-50">
                      <input
                        type="file"
                        {...register("image", {
                          required: addModalOpen ? "Image is required" : false,
                          validate: (fileList) =>
                            !fileList || fileList.length === 0
                              ? true
                              : validateImage(fileList[0]),
                        })}
                        className="w-full text-sm text-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 transition-all duration-200"
                        accept="image/jpeg,image/png"
                      />
                    </div>
                    {errors.image && (
                      <p className="text-red-500 text-sm mt-1.5">
                        {errors.image.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1.5">
                      Provider Name
                    </label>
                    <input
                      {...register("provider", {
                        required: "Provider name is required",
                      })}
                      className="w-full rounded-lg border-blue-200 bg-blue-50 p-3 text-blue-800 placeholder-blue-400 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200"
                      placeholder="Enter provider name"
                    />
                    {errors.provider && (
                      <p className="text-red-500 text-sm mt-1.5">
                        {errors.provider.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1.5">
                      Provider Bio
                    </label>
                    <textarea
                      {...register("providerBio", {
                        required: "Bio is required",
                      })}
                      className="w-full rounded-lg border-blue-200 bg-blue-50 p-3 text-blue-800 placeholder-blue-400 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 h-24 resize-none"
                      placeholder="Enter provider bio"
                    />
                    {errors.providerBio && (
                      <p className="text-red-500 text-sm mt-1.5">
                        {errors.providerBio.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1.5">
                      Availability
                    </label>
                    <input
                      {...register("availability", {
                        required: "Availability is required",
                      })}
                      className="w-full rounded-lg border-blue-200 bg-blue-50 p-3 text-blue-800 placeholder-blue-400 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200"
                      placeholder="E.g., Mon-Sat, 9 AM - 5 PM"
                    />
                    {errors.availability && (
                      <p className="text-red-500 text-sm mt-1.5">
                        {errors.availability.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center bg-blue-50 p-3 rounded-lg">
                    <input
                      type="checkbox"
                      {...register("active")}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-blue-300 rounded transition-all duration-200"
                      defaultChecked={selectedService?.active || true}
                    />
                    <label className="ml-2 block text-sm text-blue-700">
                      Service Active
                    </label>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01, backgroundColor: "#1e40af" }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6 flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    {addModalOpen ? "Add Service" : "Save Changes"}
                  </motion.button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}