import nodemailer from "nodemailer"
import hbs from "nodemailer-express-handlebars"
import path from 'path'

export default class Mailer {
    transporter
    constructor(
        to,
        subject,
        payload,
    ) {
        this.to = to
        this.subject = subject
        this.payload = payload
        this.makeTransport()
    }

    makeTransport() {
        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: process.env.MAIL_SECURE,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        })
    }

    sendMail() {
        this.transporter.use(
            "compile",
            hbs({
                viewEngine: {
                    extname: ".handlebars",
                    partialsDir: path.resolve("./views"),
                    defaultLayout: false,
                },
                viewPath: path.resolve("./views"),
                extName: '.handlebars'
            })
        )

        return this.transporter.sendMail({
            from: `iBolitt <${process.env.MAIL_USER}>`,
            to: this.to,
            subject: this.subject,
            template: "index",
            context: { ...this.payload }
        })
    }
}

