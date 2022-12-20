import Sequelize from "sequelize";
import { database } from "../modules/index.js"


const sessionModel = database.define("session", {
    refresh_token: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})
export default sessionModel;