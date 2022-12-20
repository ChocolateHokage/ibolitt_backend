import Sequelize from "sequelize";
import { database, hasherIds } from "../modules/index.js"

const modelModel = database.define("model", {
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
    inactive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
},
    {
        updatedAt: false,
        timestamps: true
    })

export default modelModel;