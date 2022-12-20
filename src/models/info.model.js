import Sequelize from "sequelize";
import { database } from "../modules/index.js";

const infoModel = database.define("info", {
    legend: {
        type: Sequelize.STRING,
        allowNull: false
    },
    text: {
        type: Sequelize.TEXT,
    }
},
    {
        timestamps: false
    })
export default infoModel;