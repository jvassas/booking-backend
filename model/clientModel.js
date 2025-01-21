import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const clientModel =
  mongoose.models.client || mongoose.model("client", clientSchema);

export default clientModel;
