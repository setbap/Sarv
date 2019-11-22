import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
// import { validate } from "class-validator";
import { User } from "../entity/User";
import { asyncHandler } from "../middleware/async";
import { ErrorResponse } from "../utils/errorResponse";

export class AuthController {
	static signin = asyncHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const id = <number>req.body.id;
			const user = await User.findOne(id);
			if (!user) {
				return next(
					new ErrorResponse("There is no user with that email", 404),
				);
			}
			res.json({
				user,
			});
		},
	);
}
