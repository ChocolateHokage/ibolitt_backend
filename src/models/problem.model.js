import Sequelize from "sequelize";
import { database, hasherIds } from "../modules/index.js"

const problemModel = database.define("problem", {
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
        allowNull: false
    },
    price: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    modelId: {
        type: Sequelize.INTEGER,
        get() {
            return hasherIds.encode(this.getDataValue("id"))
        },
        allowNull: false,
    },
    inactive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
})

export default problemModel;