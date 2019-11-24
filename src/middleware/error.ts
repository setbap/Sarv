import { ErrorResponse } from "../utils/errorResponse";
import { Request, Response, NextFunction } from "express";

export const errorHandler = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	let error = { ...err };

	error.message = err.message;

	// Log to console for dev
	console.log("my log ", err);

	// Mongoose bad ObjectId
	if (err.name === "EntityNotFound") {
		const message = `Resource not found`;
		error = new ErrorResponse(message, 404);
	}

	// Mongoose duplicate key
	if (err.code === 23505) {
		const message = "Duplicate field value entered";
		error = new ErrorResponse(message, 400);
	}

	// Mongoose validation error
	if (err.name === "ValidationError") {
		const message = Object.values(err.errors).map(
			(val: any) => val.message,
		);
		error = new ErrorResponse(message.toString(), 400);
	}

	res.status(error.statusCode || 500).json({
		success: false,
		error: error.message || "Server Error",
	});
};
