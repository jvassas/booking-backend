import bcrypt from "bcrypt";
import clientModel from "../model/clientModel.js";
import jwt from "jsonwebtoken";
import providerModel from "../model/providerModel.js";
import appointmentModel from "../model/appointmentModel.js";

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

const clientLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const client = await clientModel.findOne({ email });

    if (!client) {
      return res.json({ success: false, message: "No user found" });
    }

    const pwMatch = await bcrypt.compare(password, client.password);

    if (pwMatch) {
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

const bookAppointment = async (req, res) => {
  try {
    const { clientId, providerId, slotDate, slotTime } = req.body;

    const providerData = await providerModel
      .findById(providerId)
      .select("-password");

    if (!providerData.available) {
      return res.json({ success: false, message: "Doctor not available" });
    }

    let slots_booked = providerData.slots_booked;

    // Check if the slot is already booked or update the slots for the date
    slots_booked[slotDate] = slots_booked[slotDate] || [];
    if (slots_booked[slotDate].includes(slotTime)) {
      return res.json({ success: false, message: "Doctor not available" });
    }
    slots_booked[slotDate].push(slotTime);

    const clientData = await clientModel.findById(clientId).select("-password");

    // Remove unnecessary data
    delete providerData.slots_booked;

    const appointmentData = {
      clientId,
      providerId,
      clientData,
      providerData,
      slotDate,
      slotTime,
      date: Date.now(),
    };

    // Save appointment to DB
    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    // Update slots in DB
    await providerModel.findByIdAndUpdate(providerId, { slots_booked });

    // Return a success response if everything passes
    res.json({ success: true, message: "Appointment booked successfully" });
  } catch (error) {
    // Handle the error
    console.error("Error booking appointment:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export { registerClient, clientLogin, bookAppointment };
