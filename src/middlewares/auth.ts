import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CustomError } from "../ExceptionHandler/CustomError.js";
import { env } from "../config/env.js";
import { jwtUtils } from "../utils/jwt.js";

const getAccessTokenFromRequest = (req: Request) => {
	const authHeader = req.headers.authorization;

	if (authHeader?.startsWith("Bearer ")) {
		return authHeader.split(" ")[1];
	}

	return req.cookies?.accessToken ?? req.cookies?.access_token ?? req.cookies?.token ?? null;
};

export const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
	const token = getAccessTokenFromRequest(req);

	if (!token) {
		return next(new CustomError(StatusCodes.UNAUTHORIZED, "Authorization header or access token cookie is missing"));
	}

	const verifiedToken = jwtUtils.verifyToken(token, env.JWT_ACCESS_SECRET);

	if (!verifiedToken.success) {
		return next(new CustomError(StatusCodes.UNAUTHORIZED, verifiedToken.error || "Invalid access token"));
	}

	const payload = verifiedToken.data as {
		id?: unknown;
		email?: unknown;
		role?: unknown;
		status?: unknown;
	};

	if (typeof payload.id !== "string" || typeof payload.email !== "string" || typeof payload.role !== "string" || typeof payload.status !== "string") {
		return next(new CustomError(StatusCodes.UNAUTHORIZED, "Invalid access token payload"));
	}

	req.user = {
		id: payload.id,
		email: payload.email,
		role: payload.role,
		status: payload.status,
	} as any;

	return next();
};
