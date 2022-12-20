import { authModel, sessionModel } from "../models/index.js"
import { ApiError, hasherIds, makeHash, Token } from "../modules/index.js";

export async function login(req, res, next) {
  try {
    const { email, password } = req.body

    const auth = await authModel.findOne({
      where: { email }
    })
    if (
      !auth ||
      auth.hash_password !== makeHash(password)
    ) {
      throw ApiError.BadRequest("Invalid email or password!")
    }

    const session_tokens = Token.generateTokens({
      id: auth.id,
      email: auth.email,
      createdAt: auth.createdAt,
      updatedAt: auth.updatedAt,
    })

    await Token.saveToken(hasherIds.decode(auth.id), session_tokens.refreshToken)

    res.cookie("refresh_token", session_tokens.refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
      sameSite: "lax",
    })

    res.status(201).json({
      auth: {
        id: auth.id,
        email: auth.email,
        createdAt: auth.createdAt,
        updatedAt: auth.updatedAt,
      },
      ...session_tokens,
    })
  } catch (error) {
    console.log(error);
    next(error)
  }
}

export async function refresh(req, res, next) {
  try {
    const { refresh_token } = req.cookies
    
    if (!refresh_token) {
      console.log("no refresh_token");
      throw ApiError.UnauthorizedError()
    }
    const sessionData = await sessionModel.findOne({
      where: { refresh_token }
    })

    const authData = Token.validateRefreshToken(refresh_token)
    const checkToken = await Token.findToken(refresh_token)

    if (!sessionData || !(authData && checkToken)) {
      console.log("no session data or no authData and CheckToken");
      throw ApiError.UnauthorizedError()
    }

    const auth = await authModel.findOne({
      where: { id: sessionData.authId }
    })

    const session_tokens = Token.generateTokens({
      id: auth?.id,
      email: auth?.email,
      createdAt: auth?.createdAt,
      updatedAt: auth?.updatedAt
    })

    await Token.saveToken(hasherIds.decode(auth?.id), session_tokens.refreshToken)

    res.cookie("refresh_token", session_tokens.refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      httpOnly: true,
      sameSite: "lax",
    })

    res.status(201).json({
      auth: {
        id: auth?.id,
        email: auth?.email,
        createdAt: auth?.createdAt,
        updatedAt: auth?.updatedAt
      },
      ...session_tokens
    })
  } catch (error) {
    next(error)
  }
}

export async function logout(req, res, next) {
  try {
    const { refresh_token } = req.cookies
    console.log(req.cookies);
    await Token.removeToken(refresh_token)

    res.clearCookie("refresh_token")
    res.sendStatus(200)
  } catch (error) {
    next(error)
  }
}

export async function updateData(req, res, next) {
  try {
    const { email, old_password, password } = req.body

    const auth = await authModel.findOne({
      where: { id: hasherIds.decode(req.user.id) }
    })

    if (makeHash(old_password) !== auth.hash_password) {
      throw ApiError.BadRequest("Incorrect current password")
    }

    if (email && email != req.user.email) {
      auth.setDataValue("email", email)
    }

    if (password) {
      auth.setDataValue("hash_password", makeHash(password))
    }

    await auth.save()

    res.sendStatus(200)
  } catch (error) {
    next(error)
  }
}