import jwt from "jsonwebtoken";
import { sessionModel } from "../models/index.js";
import { hasherIds } from './index.js'

class Token {
    generateTokens(payload) {
        const accessToken = jwt.sign(
            payload,
            process.env.JWT_ACCESS_TOKEN ?? "sugar",
            {
                expiresIn: "30m"
            }
        )
        const refreshToken = jwt.sign(
            payload,
            process.env.JWT_REFRESH_TOKEN ?? "sugar_refresh",
            {
                expiresIn: "30d"
            }
        )
        return { accessToken, refreshToken }

    }
    async saveToken(authId, refreshToken) {
        const tokenData = await sessionModel.findOne({
            where: { authId }
        })
        if (tokenData) {
            tokenData.refresh_token = refreshToken
            return tokenData.save()
        }
        const token = await sessionModel.create({
            authId: authId,
            refresh_token: refreshToken
        })
        return token
    }

    async removeToken(refresh_token) {
        const token_data = await sessionModel.destroy({
            where: { refresh_token }
        })
        return token_data
    }

    async findToken(refresh_token) {
        const token_data = await sessionModel.findOne({
            where: { refresh_token }
        })
        return token_data
    }
    validateAccessToken(token) {
        try {
            const authData = jwt.verify(
                token,
                process.env.JWT_ACCESS_TOKEN ?? "sugar"
            )
            return authData
        } catch (error) {
            return null
        }
    }

    validateRefreshToken(token) {
        try {
            const authData = jwt.verify(
                token,
                process.env.JWT_REFRESH_TOKEN ?? "sugar_refresh"
            )
            return authData;
        } catch (error) {
            return null
        }
    }
}

export default new Token()