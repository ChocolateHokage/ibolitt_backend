import { fileModel } from "../models/index.js"

export async function addNewFile(req, res, next) {
    try {
        const file = req.file;
        
        const _file = await fileModel.create({
            name: file?.filename,
            type: file?.mimetype.split("/", 1)[0]
        })

        res.status(201).json(_file)
    } catch (error) {
        next(error)
    }
}