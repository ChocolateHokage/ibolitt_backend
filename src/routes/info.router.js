import { Router } from "express";
import { deleteInfo, getLegend, updateInfo } from "../controllers/info.controller.js";

const infoRouter = Router();

infoRouter.route('/').get(getLegend)
infoRouter.route("/:info_name")
    .put(updateInfo)
    .delete(deleteInfo)

export default infoRouter;