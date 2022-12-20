import { Router } from "express";
import {
	getAllDevice,
	getAllDeviceModel,
	getAllDeviceProblem,
	getOneDeviceProblem,
	addDevice,
	updateDevice,
	addModel,
	updateModel,
	deleteDevice,
	deleteModel,
	getDeviceByName,
	getModelById,
} from "../controllers/device.controller.js";
import {
	addProblem,
	deleteProblem,
	updateProblem,
} from "../controllers/problem.controller.js";

const deviceRouter = Router();

deviceRouter.route("/")
	.get(getAllDevice)
	.post(addDevice);

deviceRouter.route("/:device_name")
	.get(getDeviceByName)
deviceRouter.route("/:device_id")
	.put(updateDevice)
	.delete(deleteDevice);

deviceRouter.route("/:device_name/models")
	.get(getAllDeviceModel)

deviceRouter.route("/:device_id/models")
	.post(addModel);

deviceRouter.route("/models/:model_id")
	.get(getModelById)
	.put(updateModel)
	.delete(deleteModel);

deviceRouter.route("/:device_name/models/:model_name/problems")
	.get(getAllDeviceProblem);

deviceRouter.route("/models/:model_id/problems")
	.post(addProblem)

deviceRouter.route("/:device_name/models/:model_name/problems/:problem_name")
	.get(getOneDeviceProblem)

deviceRouter.route("/problems/:problem_id")
	.put(updateProblem)
	.delete(deleteProblem);

export default deviceRouter;
