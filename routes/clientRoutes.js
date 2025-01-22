import express from "express";
import {
  registerClient,
  clientLogin,
  bookAppointment,
  getClientAppointments,
  cancelAppointment,
} from "../controller/clientController.js";
import clientAuth from "../middleware/clientAuth.js";

const clientRouter = express.Router();

clientRouter.post("/register-client", registerClient);
clientRouter.post("/login", clientLogin);
clientRouter.post("/book-appointment", clientAuth, bookAppointment);
clientRouter.get("/appointments", clientAuth, getClientAppointments);
clientRouter.post("/cancel-appointment", clientAuth, cancelAppointment);

export default clientRouter;
