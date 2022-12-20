import { Router } from "express";
import {
	getAllRequests,
	createNewRequest,
	getOneRequestById,
} from "../controllers/request.controller.js";

const requestsRouter = Router();

requestsRouter.route("/").get(getAllRequests).post(createNewRequest);
requestsRouter.route("/:id").get(getOneRequestById);

export default requestsRouter;
