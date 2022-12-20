import winston from "winston";

class Logger {
    static #dev() {
        const log_dev_format = winston.format.printf(({ level, message, timestamp, stack }) => {
            return `[${new Date(timestamp).toLocaleTimeString()}] ${level}: ${stack ?? message}`
        })
        return winston.createLogger({
            level: "debug",
            exitOnError: false,
            transports: [new winston.transports.Console()],
            format: winston.format.combine(winston.format.timestamp(), winston.format.errors({ stack: true }), log_dev_format)
        })
    }
    static #prod() {
        const log_prod_format = winston.format.printf(({ level, message, timestamp, stack }) => {
            return `[${new Date(timestamp).toLocaleTimeString()}] ${level}: ${stack ?? message}`
        })
        return winston.createLogger({
            level: "info",
            exitOnError: false,
            format: winston.format.combine(winston.format.timestamp(), winston.format.errors({ stack: true }), log_prod_format),
            transports: [new winston.transports.File({ filename: `logs/${Date.now()}.log` })],
            defaultMeta: {
                service: "user-service"
            }
        })
    }

    static logger() {
        if (process.env.NODE_ENV === "production") {
            return this.#prod()
        } else {
            return this.#dev()
        }
    }
}

export default Logger.logger()