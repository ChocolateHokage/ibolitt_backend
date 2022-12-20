import { Router } from "express";
import { login, refresh, logout, updateData } from "../controllers/authentication.controller.js";
import { checkAuth } from "../modules/index.js";

const authRouter = Router()

authRouter.route('/sign').post(login)
authRouter.route('/sign').delete(checkAuth, logout)
authRouter.route('/refresh').get(checkAuth, refresh)
authRouter.route('/profile').put(checkAuth, updateData)

export default authRouter