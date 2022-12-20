import { Router } from "express";
import requestsRouter from "./request.router.js";
import fileRouter from "./file.router.js";
import deviceRouter from "./device.router.js"
import infoRouter from "./info.router.js"
import authRouter from "./auth.router.js";

const router = Router();

router.use("/requests", requestsRouter)
router.use("/files", fileRouter)
router.use("/devices", deviceRouter)
router.use("/info", infoRouter)
router.use('/', authRouter)

export default router;
    