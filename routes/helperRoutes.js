import express from "express";
import { addProvider, getProviders } from "../controller/helperController.js";
import upload from "../middleware/multer.js";

const helperRouter = express.Router();

helperRouter.post("/add-provider", addProvider);
helperRouter.post("/get-providers", getProviders);

export default helperRouter;
