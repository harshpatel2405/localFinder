const express = require("express");
const router = express.Router();
const adminController = require("../controllers/AdminController");

router.post("/signup", adminController.signup);
router.post("/login", adminController.login);
router.post("/logout", adminController.logout);
router.get("/bookings", adminController.getAllUsers);
router.get("/payments", adminController.getAllPayments);
router.get("/getAllServiceProviders", adminController.getAllServiceProviders);
router.get("/getAllAppointments", adminController.getAllAppointments);

module.exports = router;
