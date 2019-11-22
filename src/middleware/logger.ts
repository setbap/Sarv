import { Request, Response, NextFunction } from "express";

// @desc    Logs request to console
const logger = (req: Request, res: Response, next: NextFunction) => {
	console.log(
		`${req.method} ${req.protocol}://${req.get("host")}${req.originalUrl}`,
	);
	next();
};

module.exports = logger;
