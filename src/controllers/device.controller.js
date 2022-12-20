import {
	deviceModel,
	problemModel,
	modelModel,
	fileModel,
} from "../models/index.js";
import { hasherIds, ApiError } from "../modules/index.js";
import { Op } from "sequelize";

export async function getAllDevice(req, res, next) {
	try {
		const devices = await deviceModel.findAll({
			include: { model: fileModel }
		});

		for (let i = 0; i < devices.length; i++) {
			const models_count = await modelModel.count({
				where: { deviceId: hasherIds.decode(devices[i].id) },
			});
			devices[i].setDataValue("models_count", models_count);
		}

		res.status(devices.length ? 200 : 204).json(devices);
	} catch (error) {
		next(error);
	}
}

export async function getAllDeviceModel(req, res, next) {
	try {
		const { device_name } = req.params;
		const { all } = req.query;

		const device = await deviceModel.findOne({
			where: {
				name: device_name
			}
		})
		const models = await modelModel.findAll({
			where: {
				deviceId: hasherIds.decode(device.id),
				inactive: {
					[Op.in]: all ? [false, true] : [false],
				}
			},
			include: { model: fileModel },
			order: ["createdAt"]

		});
		for (let i = 0; i < models.length; i++) {
			const problems_count = await problemModel.count({
				where: { modelId: hasherIds.decode(models[i].id) },
			});
			models[i].setDataValue("problems_count", problems_count);
		}

		res.status(models.length ? 200 : 204).json(models.reverse());
	} catch (error) {
		next(error);
	}
}
export async function getAllDeviceProblem(req, res, next) {
	try {
		const { device_name, model_name } = req.params;
		const { all } = req.query
		const device = await deviceModel.findOne({
			where: {
				name: device_name
			}
		})

		if (!device) {
			throw ApiError.BadRequest("Нет такого устройства")
		}

		const model = await modelModel.findOne({
			where: {
				deviceId: hasherIds.decode(device.id),
				name: model_name
			}
		})

		if (!model) {
			throw ApiError.BadRequest("Нет такой модели")
		}

		const problems = await problemModel.findAll({
			where: {
				modelId: hasherIds.decode(model.id),
				inactive: {
					[Op.in]: all ? [false, true] : [false],
				},
			},
		});

		res.status(problems.length ? 200 : 204).json(problems);
	} catch (error) {
		next(error);
	}
}
export async function getOneDeviceProblem(req, res, next) {
	try {
		const { device_name, model_name, problem_name } = req.params;

		const device = await deviceModel.findOne({
			where: {
				name: {
					[Op.like]: device_name
				}
			}
		})
		const model = await modelModel.findOne({
			where: {
				name: {
					[Op.like]: model_name,
					deviceId: hasherIds.decode(device.id)
				}
			}
		})

		const problem = await problemModel.findOne({
			where: {
				name: {
					[Op.like]: problem_name,
				},
				modelId: hasherIds.decode(model.id)
			},
		});

		problem.setDataValue("file", await fileModel.findOne({ where: { id: hasherIds.decode(model.getDataValue('fileId')) } }))

		res.status(problem ? 200 : 204).json(problem);
	} catch (error) {
		next(error);
	}
}

export async function addDevice(req, res, next) {
	try {
		const { name, fileId } = req.body;
		let file_id = hasherIds.decode(fileId)

		await deviceModel.create({
			name,
			fileId: Array.isArray(file_id) ? file_id[0] : file_id,
		});
		const device = await deviceModel.findOne({
			where: {
				name,
			},
			include: [fileModel],
		});

		res.status(200).json({ device });
	} catch (error) {
		console.log(error);
		next(error);
	}
}

export async function getDeviceByName(req, res, next) {
	try {
		const { device_name } = req.params

		const device = await deviceModel.findOne({
			where: {
				name: device_name
			},
			include: [fileModel],
		});

		res.status(200).json(device);
	} catch (error) {
		next(error);
	}
}

export async function updateDevice(req, res, next) {
	try {
		const { name, fileId } = req.body;
		const { device_id } = req.params;

		const _d_id = hasherIds.decode(device_id)
		const _f_id = hasherIds.decode(fileId)

		const device = await deviceModel.findOne({
			where: {
				id: Array.isArray(_d_id) ? _d_id[0] : _d_id,
			},
		});

		name && device.setDataValue("name", name);
		fileId && device.setDataValue("fileId", Array.isArray(_f_id) ? _f_id[0] : _f_id);

		await device.save();

		res.status(200).json(device);
	} catch (error) {
		next(error);
	}
}

export async function deleteDevice(req, res, next) {
	try {
		const { device_id } = req.params;

		const _d_id = hasherIds.decode(device_id)

		await deviceModel.destroy({
			where: {
				id: Array.isArray(_d_id) ? _d_id[0] : _d_id,
			},
		});

		res.sendStatus(200);
	} catch (error) {
		next(error);
	}
}

export async function addModel(req, res, next) {
	try {
		const { name, fileId, problems } = req.body,
			{ device_id } = req.params;

		let file_id
		!fileId ? file_id = null : file_id = hasherIds.decode(fileId)[0]

		const model = await modelModel.create({
			name,
			deviceId: hasherIds.decode(device_id)[0],
			fileId: file_id
		});
		if (problems && Array.isArray(problems)) {
			problems.map(el => {
				el.modelId = hasherIds.decode(model.id)
			})

			await problemModel.bulkCreate(problems)
		}
		res.status(201).json(model);
	} catch (error) {
		next(error);
	}
}

export async function getModelById(req, res, next) {
	try {
		const { model_id } = req.params;
		const model = await modelModel.findOne({
			where: {
				id: hasherIds.decode(model_id),
			},
			include: [fileModel],
		});
		res.status(200).json(model);
	} catch (error) {
		next(error)
	}
}

export async function updateModel(req, res, next) {
	try {
		const { model_id } = req.params;
		const { name, fileId, inactive } = req.body;

		const model = await modelModel.findOne({
			where: {
				id: hasherIds.decode(model_id),
			},
		});
		name && (model.name = name);
		fileId && (model.fileId = hasherIds.decode(fileId));
		model.inactive = !!inactive;

		await model.save();

		res.status(200).json(model);
	} catch (error) {
		console.log(error);
		next(error);
	}
}

export async function deleteModel(req, res, next) {
	try {
		const { model_id } = req.params;

		const _model = await modelModel.destroy({
			where: {
				id: hasherIds.decode(model_id),
			},
		});

		res.sendStatus(_model ? 200 : 400);
	} catch (error) {
		next(error);
	}
}
