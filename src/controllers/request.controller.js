// import { Op } from "sequelize";
import { requestModel } from "../models/index.js"
import { hasherIds, sendMail } from "../modules/index.js";

export async function getAllRequests(req, res, next) {
	try {
		const { offset, limit } = req.query;

		const requests = await requestModel.findAndCountAll({
			offset: Number(offset ?? 0),
			limit: Number(limit ?? 12),
		})

		res.status(requests.count > 0 ? 200 : 204).json(requests)
	} catch (error) {
		next(error)
	}
}

export async function getOneRequestById(req, res, next) {
	try {
		const { id } = req.params;

		const request = await requestModel.findOne({
			id: hasherIds.decode(id)
		})

		res.status(request ? 200 : 204).json(request)
	} catch (error) {
		next(error)
	}
}

export async function createNewRequest(req, res, next) {
	try {
		const { name, problem, phone_number } = req.body

		const request = await requestModel.create({ name, problem, phone_number })

		const mailer = new sendMail("chocolate_hokage@vk.com", 'Новая заявка', { id: request.getDataValue("id"), name, problem, phone_number })
		mailer.sendMail()
		res.status(201).json(request)
	} catch (error) {
		next(error)
	}
}