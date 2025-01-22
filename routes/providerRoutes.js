import express from "express";
import {
  changeAvailability,
  providerLogin,
  providerList,
} from "../controller/providerController.js";

const providerRouter = express.Router();

providerRouter.post("/login", providerLogin);
providerRouter.post("/change-avail", changeAvailability); // Not used
providerRouter.get("/list", providerList);

export default providerRouter;
