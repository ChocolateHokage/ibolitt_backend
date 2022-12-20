import { problemModel } from "../models/index.js";
import { hasherIds } from '../modules/index.js';

export async function addProblem(req, res, next) {
    try {
        const { name, price } = req.body,
            { model_id } = req.params

        const problem = await problemModel.create({
            name,
            price,
            modelId: hasherIds.decode(model_id)
        })

        res.status(201).json(problem)
    } catch (error) {
        next(error)
    }
}

export async function updateProblem(req, res, next) {
    try {
        const { name, inactive, price } = req.body,
            { problem_id } = req.params

        const problem = await problemModel.findOne({
            where: {
                id: hasherIds.decode(problem_id)
            }
        })

        name && (problem.name = name)
        price && (problem.price = price)
        problem.inactive = !!inactive

        await problem.save()

        res.status(200).json(problem)
    } catch (error) {
        console.log(error);
        next(error)
    }
}

export async function deleteProblem(req, res, next) {
    try {
        const { problem_id } = req.params

        const result = await problemModel.destroy({
            where: {
                id: hasherIds.decode(problem_id)
            }
        })

        res.sendStatus(result ? 200 : 400)
    } catch (error) {
        next(error)
    }
}