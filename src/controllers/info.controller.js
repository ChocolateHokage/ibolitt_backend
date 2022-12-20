import { infoModel } from "../models/index.js";

export async function getLegend(req, res, next) {
    try {

        const legend = await infoModel.findAll()

        res.status(legend.length ? 200 : 204).json(legend)
    } catch (error) {
        next(error)
    }
}

export async function updateInfo(req, res, next) {
    try {
        const { info_name } = req.params
        const { value } = req.body

        const info = await infoModel.findOne({
            where: {
                legend: info_name
            }
        })

        value.length && (info.text = value)

        await info.save()

        res.status(200).json(info)
    } catch (error) {
        console.log(error);
        next(error)
    }
}

export async function deleteInfo(req, res, next) {
    try {
        const { info_name } = req.params

        const info = await infoModel.update({ text: null }, {
            where: {
                legend: info_name
            }
        })

        res.sendStatus(200)
    } catch (error) {
        next(error)
    }
}