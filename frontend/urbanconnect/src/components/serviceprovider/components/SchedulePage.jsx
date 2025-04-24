"use client";

import { useState } from "react";
import { Calendar, Plus, Edit, Trash2, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SchedulePage() {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [schedules, setSchedules] = useState([
    { day: "Monday", start: "09:00", end: "17:00", slots: 16, active: true },
    { day: "Tuesday", start: "09:00", end: "17:00", slots: 16, active: true },
    { day: "Wednesday", start: "09:00", end: "17:00", slots: 16, active: true },
    { day: "Thursday", start: "09:00", end: "17:00", slots: 16, active: true },
    { day: "Friday", start: "09:00", end: "13:00", slots: 8, active: true },
    { day: "Saturday", start: "10:00", end: "14:00", slots: 8, active: false },
    { day: "Sunday", start: "00:00", end: "00:00", slots: 0, active: false },
  ]);
  const [holidays, setHolidays] = useState([
    {
      id: "HOL-001",
      date: "2025-05-26",
      description: "Memorial Day",
      status: "closed",
    },
    {
      id: "HOL-002",
      date: "2025-07-04",
      description: "Independence Day",
      status: "closed",
    },
    {
      id: "HOL-003",
      date: "2025-09-01",
      description: "Labor Day",
      status: "closed",
    },
    {
      id: "HOL-004",
      date: "2025-12-25",
      description: "Christmas Day",
      status: "closed",
    },
  ]);

  // Handlers
  const handleEditSchedule = (schedule) => {
    setSelectedSchedule(schedule);
    setEditModalOpen(true);
  };

  const handleDeleteHoliday = (id) => {
    setHolidays(holidays.filter((holiday) => holiday.id !== id));
  };

  const handleAddHoliday = (e) => {
    e.preventDefault();
    const form = e.target;
    const newHoliday = {
      id: `HOL-${Math.random().toString(36).substr(2, 9)}`,
      date: form.date.value,
      description: form.description.value,
      status: "closed",
    };
    if (!newHoliday.date || !newHoliday.description) return;
    setHolidays([...holidays, newHoliday]);
    setAddModalOpen(false);
    form.reset();
  };

  const handleSaveSchedule = (e) => {
    e.preventDefault();
    const form = e.target;
    const updatedSchedule = {
      day: selectedSchedule.day,
      start: form["start-time"].value,
      end: form["end-time"].value,
      slots: form["available-status"].checked
        ? Math.floor(
            (new Date(`2000-01-01T${form["end-time"].value}`) -
              new Date(`2000-01-01T${form["start-time"].value}`)) /
              (1000 * 60 * 30)
          ) * 2
        : 0,
      active: form["available-status"].checked,
    };
    if (updatedSchedule.start >= updatedSchedule.end && updatedSchedule.active)
      return;
    setSchedules(
      schedules.map((s) =>
        s.day === selectedSchedule.day ? updatedSchedule : s
      )
    );
    setEditModalOpen(false);
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
      className="min-h-screen bg-white py-6 px-4 sm:px-6 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-blue-800">
            Schedule Management
          </h1>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md"
            onClick={() => setAddModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Holiday
          </motion.button>
        </div>

        {/* Weekly Schedule Card */}
        <motion.div
          variants={cardVariants}
          className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden"
        >
          <div className="bg-blue-600 text-white p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <h2 className="text-xl font-bold">Weekly Schedule</h2>
            </div>
          </div>
          <div className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-blue-100">
                <thead className="bg-blue-50">
                  <tr>
                    {[
                      "Day",
                      "Working Hours",
                      "Status",
                      "Available Slots",
                      "Actions",
                    ].map((col) => (
                      <th
                        key={col}
                        className="py-3.5 px-4 text-left text-sm font-semibold text-blue-800"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100">
                  {schedules.map((schedule) => (
                    <tr
                      key={schedule.day}
                      className="hover:bg-blue-50/70 transition-colors duration-200"
                    >
                      <td className="py-4 px-4 text-sm font-medium text-blue-900">
                        {schedule.day}
                      </td>
                      <td className="py-4 px-4 text-sm text-blue-700">
                        {schedule.active
                          ? `${schedule.start} - ${schedule.end}`
                          : "Not Available"}
                      </td>
                      <td className="py-4 px-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            schedule.active
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {schedule.active ? "Available" : "Not Available"}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-blue-700">
                        {schedule.slots}
                      </td>
                      <td className="py-4 px-4 text-sm">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEditSchedule(schedule)}
                          className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all duration-200"
                        >
                          <Edit className="h-4 w-4" />
                        </motion.button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Holidays Card */}
        <motion.div
          variants={cardVariants}
          className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden"
        >
          <div className="bg-blue-600 text-white p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <h2 className="text-xl font-bold">Holidays & Time Off</h2>
            </div>
          </div>
          <div className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-blue-100">
                <thead className="bg-blue-50">
                  <tr>
                    {["Date", "Description", "Status", "Actions"].map((col) => (
                      <th
                        key={col}
                        className="py-3.5 px-4 text-left text-sm font-semibold text-blue-800"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100">
                  {holidays.map((holiday) => (
                    <tr
                      key={holiday.id}
                      className="hover:bg-blue-50/70 transition-colors duration-200"
                    >
                      <td className="py-4 px-4 text-sm font-medium text-blue-900">
                        {new Date(holiday.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="py-4 px-4 text-sm text-blue-700">
                        {holiday.description}
                      </td>
                      <td className="py-4 px-4 text-sm">
                        <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold bg-red-100 text-red-700">
                          Closed
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDeleteHoliday(holiday.id)}
                          className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </motion.button>
                      </td>
                    </tr>
                  ))}
                  {holidays.length === 0 && (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-blue-500">
                        No holidays have been added yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Add Holiday Modal */}
        <AnimatePresence>
          {addModalOpen && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-blue-900/30 backdrop-blur-sm"
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
                className="bg-white rounded-xl shadow-xl border border-blue-200 w-full max-w-md mx-4 overflow-hidden"
              >
                <div className="bg-blue-600 text-white p-4">
                  <h3 className="text-lg font-semibold">Add Holiday/Time Off</h3>
                </div>
                <form className="p-6 space-y-4" onSubmit={handleAddHoliday}>
                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-1">
                      Date
                    </label>
                    <div className="relative rounded-lg">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-blue-400" />
                      </div>
                      <input
                        type="date"
                        name="date"
                        required
                        className="block w-full pl-10 px-3 py-2.5 bg-white rounded-lg border border-blue-200 text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      name="description"
                      required
                      className="block w-full px-3 py-2.5 bg-white rounded-lg border border-blue-200 text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      placeholder="Holiday or Time Off reason"
                    />
                  </div>
                  <div className="pt-4 flex justify-end space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all duration-200"
                      onClick={() => setAddModalOpen(false)}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
                    >
                      Add Holiday
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Schedule Modal */}
        <AnimatePresence>
          {editModalOpen && selectedSchedule && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-blue-900/30 backdrop-blur-sm"
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
                className="bg-white rounded-xl shadow-xl border border-blue-200 w-full max-w-md mx-4 overflow-hidden"
              >
                <div className="bg-blue-600 text-white p-4">
                  <h3 className="text-lg font-semibold">Edit Schedule</h3>
                </div>
                <form className="p-6 space-y-4" onSubmit={handleSaveSchedule}>
                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-1">
                      Day
                    </label>
                    <input
                      type="text"
                      className="block w-full px-3 py-2.5 bg-blue-50 rounded-lg border border-blue-200 text-blue-800"
                      value={selectedSchedule.day}
                      readOnly
                    />
                  </div>
                  <div className="flex items-center py-2">
                    <input
                      id="available-status"
                      name="available-status"
                      type="checkbox"
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-blue-300 rounded"
                      defaultChecked={selectedSchedule.active}
                    />
                    <label
                      htmlFor="available-status"
                      className="ml-3 block text-sm text-blue-800"
                    >
                      Available for Appointments
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-800 mb-1">
                        Start Time
                      </label>
                      <div className="relative rounded-lg">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Clock className="h-5 w-5 text-blue-400" />
                        </div>
                        <input
                          type="time"
                          name="start-time"
                          required
                          className="block w-full pl-10 px-3 py-2.5 bg-white rounded-lg border border-blue-200 text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                          defaultValue={selectedSchedule.start}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-800 mb-1">
                        End Time
                      </label>
                      <div className="relative rounded-lg">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Clock className="h-5 w-5 text-blue-400" />
                        </div>
                        <input
                          type="time"
                          name="end-time"
                          required
                          className="block w-full pl-10 px-3 py-2.5 bg-white rounded-lg border border-blue-200 text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                          defaultValue={selectedSchedule.end}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all duration-200"
                      onClick={() => setEditModalOpen(false)}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
                    >
                      Save Changes
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}