import Sequelize from "sequelize";
import { database, hasherIds } from "../modules/index.js"

const deviceModel = database.define("device", {
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
},
    {
        updatedAt: false,
        timestamps: true,
        indexes: [
            { unique: true, fields: ["name"] }
        ]
    })
export default deviceModel;