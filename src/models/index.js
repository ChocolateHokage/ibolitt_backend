// import { database } from "../modules/database.js"

import requestModel from "./request.model.js";
import fileModel from "./file.model.js";
import deviceModel from "./device.model.js";
import problemModel from "./problem.model.js";
import infoModel from "./info.model.js"
import modelModel from "./model.model.js";
import authModel from "./authentication.model.js";
import sessionModel from "./session.model.js";

//model <== problem
modelModel.hasMany(problemModel)
problemModel.belongsTo(modelModel)

//file <== device
fileModel.hasOne(deviceModel)
deviceModel.belongsTo(fileModel)

//file <== model
fileModel.hasOne(modelModel)
modelModel.belongsTo(fileModel)

//device <== model
deviceModel.hasMany(modelModel)
modelModel.belongsTo(deviceModel)

//auth <== session
authModel.hasMany(sessionModel)
sessionModel.belongsTo(authModel)

export {
    requestModel,
    fileModel,
    deviceModel,
    modelModel,
    problemModel,
    infoModel,
    authModel,
    sessionModel
}
