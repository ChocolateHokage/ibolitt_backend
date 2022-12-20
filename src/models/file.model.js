import Sequelize from "sequelize";
import { database, hasherIds } from "../modules/index.js"

const fileModel = database.define("file", {
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
    type: {
        type: Sequelize.STRING,
        allowNull: false
    }
},
    {
        updatedAt: false,
        timestamps: true
    })

export default fileModel;