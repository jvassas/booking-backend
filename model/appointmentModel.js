import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  clientId: { type: String, required: true },
  providerId: { type: String, required: true },
  slotDate: { type: String, required: true },
  slotTime: { type: String, required: true },
  cancelled: { type: Boolean, default: false },
  clientData: { type: Object, required: true },
  providerData: { type: Object, required: true },
  date: { type: Number, required: true },
});

const appointmentModel =
  mongoose.model.appointment ||
  mongoose.model("appointment", appointmentSchema);

export default appointmentModel;
