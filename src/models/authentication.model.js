import Sequelize from "sequelize";
import { database, hasherIds } from "../modules/index.js"

const authModel = database.define("auth", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        get() {
            return hasherIds.encode(this.getDataValue("id"))
        }
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    hash_password: {
        type: Sequelize.TEXT,
        allowNull: false
    },
})
export default authModel;