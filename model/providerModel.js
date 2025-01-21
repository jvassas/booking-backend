import mongoose from "mongoose";

const providerSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    available: { type: Boolean, default: true },
    date: { type: Number, required: true },
    slots_booked: { type: Object, default: {} },
  },
  { minimize: false }
);

const providerModel =
  mongoose.models.provider || mongoose.model("provider", providerSchema);

export default providerModel;
