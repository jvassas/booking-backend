import bcrypt from "bcrypt";
import clientModel from "../model/clientModel.js";
import jwt from "jsonwebtoken";
import providerModel from "../model/providerModel.js";
import appointmentModel from "../model/appointmentModel.js";

// Register Client API
const registerClient = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Basic data validations
    if (!firstName || !lastName || !email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Missing required fields" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPw = await bcrypt.hash(password, salt);

    const clientData = {
      firstName,
      lastName,
      email,
      password: hashedPw,
      date: Date.now(),
    };

    const newClient = new clientModel(clientData);
    const client = await newClient.save();
    const token = jwt.sign({ id: client._id }, process.env.JWT_SECRET);

    res.status(200).json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
};

// Login Client API
const clientLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const client = await clientModel.findOne({ email });

    if (!client) {
      return res.json({ success: false, message: "No user found" });
    }

    const isMatch = await bcrypt.compare(password, client.password);

    if (isMatch) {
      const token = jwt.sign({ id: client._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
};

// Book Client Appt API
const bookAppointment = async (req, res) => {
  try {
    // Extract and verify token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const clientId = decoded.id; // Extract client ID from token

    // Extract and validate request body
    const { providerId, openingDate, openingTime } = req.body;

    if (!providerId || !openingDate || !openingTime) {
      return res.status(400).json({
        success: false,
        message: "Provider ID, slot date, and slot time are required",
      });
    }

    // Fetch provider data
    const providerData = await providerModel
      .findById(providerId)
      .select("-password");

    if (!providerData) {
      return res
        .status(404)
        .json({ success: false, message: "Provider not found" });
    }

    if (!providerData.available) {
      return res
        .status(400)
        .json({ success: false, message: "Provider not available" });
    }

    let slots_booked = providerData.slots_booked || {};

    // Check if slot is already booked
    slots_booked[openingDate] = slots_booked[openingDate] || [];
    if (slots_booked[openingDate].includes(openingTime)) {
      return res
        .status(400)
        .json({ success: false, message: "Slot already booked" });
    }

    // Add slot to booked slots
    slots_booked[openingDate].push(openingTime);

    // Fetch client data
    const clientData = await clientModel.findById(clientId).select("-password");
    if (!clientData) {
      return res
        .status(404)
        .json({ success: false, message: "Client not found" });
    }

    // Prepare appointment data
    const appointmentData = {
      clientId,
      providerId,
      clientData,
      providerData,
      openingDate,
      openingTime,
      date: Date.now(),
    };

    // Save appointment to DB
    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    // Update provider's booked slots in DB
    await providerModel.findByIdAndUpdate(providerId, { slots_booked });

    // Return success response
    res.json({ success: true, message: "Appointment booked successfully" });
  } catch (error) {
    console.error("Error occurred while booking appointment:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get Client Appt's API
const getClientAppointments = async (req, res) => {
  const { clientId } = req.body; // `clientId` is added by clientAuth middleware

  try {
    // Fetch appointments for the client
    const appointments = await appointmentModel.find({ clientId });

    if (!appointments || appointments.length === 0) {
      return res.json({
        success: false,
        message: "No appointments found for this client.",
      });
    }
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Cancel Appointment API
const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.status(400).json({
        success: false,
        message: "Appointment ID required",
      });
    }

    // Fetch the appointment details
    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Update the appointment to mark it as cancelled
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
      completed: true,
    });

    // Extract provider and slot details
    const { providerId, openingDate, openingTime } = appointmentData;

    // Fetch provider details
    const providerData = await providerModel.findById(providerId);
    if (!providerData) {
      return res.status(404).json({
        success: false,
        message: "Provider not found",
      });
    }

    // Update the provider's booked slots
    const slots_booked = providerData.slots_booked || {};
    if (slots_booked[openingDate]) {
      slots_booked[openingDate] = slots_booked[openingDate].filter(
        (time) => time !== openingTime
      );

      // Save updated slots
      await providerModel.findByIdAndUpdate(providerId, { slots_booked });
    }

    res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while cancelling the appointment",
    });
  }
};

export {
  registerClient,
  clientLogin,
  bookAppointment,
  getClientAppointments,
  cancelAppointment,
};
