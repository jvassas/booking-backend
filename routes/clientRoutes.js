import express from "express";
import {
  registerClient,
  clientLogin,
  bookAppointment,
} from "../controller/clientController.js";

const clientRouter = express.Router();

clientRouter.post("/register-client", registerClient);
clientRouter.post("/login", clientLogin);
clientRouter.post("/book-appointment", bookAppointment);

export default clientRouter;
