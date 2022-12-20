import { Router } from "express";
import { addNewFile } from "../controllers/file.controller.js";
import { uploadsFile } from "../modules/index.js";

const fileRouter = Router();

fileRouter.route("/").post(uploadsFile().single("file"), addNewFile);

export default fileRouter;
