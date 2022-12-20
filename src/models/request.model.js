import Sequelize from "sequelize";
import { database, hasherIds } from "../modules/index.js"

const requestModel = database.define("request", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        get() {
            return hasherIds.encode(this.getDataValue("id"))
        }
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    problem: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    phone_number: {
        type: Sequelize.STRING,
        allowNull: false
    }
},
    {
        updatedAt: false
    })

export default requestModel;