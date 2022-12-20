import express from "express";
import cors from "cors";
import compression from "compression";
import rate_limit from "express-rate-limit";
import helmet from "helmet";
import "dotenv/config";
import path from "path";
import cookieparser from "cookie-parser";

import { database, errorHandler, logger } from "./modules/index.js";
import router from "./routes/index.js";
import { expressSharp, FsAdapter } from "express-sharp";

const app = express();
const port = process.env.PORT ?? 4000;
const version = process.env.VERSION ?? "dev";

app
	.use(express.json())
	.use(
		cors({
			credentials: true,
			methods: ["POST", "PUT", "DELETE", "GET", "OPTIONS"],
			origin: (origin, cb) => {
				cb(null, true);
			},
		}),
	)
	.use(compression())
	// .use(
	// 	rate_limit({
	// 		message: "Too many requests",
	// 		max: 500,
	// 		windowMs: 1000 * 60 * 10,
	// 		legacyHeaders: false,
	// 	}),
	// )
	.use(cookieparser())
	.use(helmet({ crossOriginResourcePolicy: false }))
	.use(`/api/${version}`, router)
	.use("/api/static", express.static(path.resolve("./static")))
	.use(
		`/api/static/images`,
		expressSharp({
			imageAdapter: new FsAdapter(path.resolve("./static")),
		}),
	)
	.use(errorHandler);

database.authenticate().then(() => {
	logger.info("[server] DB connected");
	database
		.sync({
			alter: true,
			// force: true
		})
		.catch((err) => {
			logger.error(err);
			console.log(err);
		});
	app.listen(port, () => {
		logger.info("[server] (" + version + ") Started on port " + port);
	});
});
