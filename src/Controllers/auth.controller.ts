import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
// import { validate } from "class-validator";
import { User, UserGender } from "../entity/User";
import { asyncHandler } from "../middleware/async";
import { ErrorResponse } from "../utils/errorResponse";
import { validate } from "class-validator";

interface UserInterface {
	name: string;
	lastname: string;
	email: string;
	password: string;
	phoneNumber?: number;
	dob: string;
	gender: UserGender;
}

export class AuthController {
	static signin = asyncHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const reqData = <UserInterface>req.body;
			const user = new User();
			console.log(Date.parse(reqData.dob));
			user.name = reqData.name;
			user.lastname = reqData.lastname;
			user.email = reqData.email;
			user.password = reqData.password;
			user.dob = new Date(Date.parse(reqData.dob));
			user.gender = reqData.gender;
			user.phoneNumber = reqData.phoneNumber;

			const errors = await validate(user);
			if (errors.length > 0) {
				console.log(errors);
				return next(new ErrorResponse("error in validate", 404));
			} else {
				await user.save();
			}

			res.json({
				status: "user created",
			});
		},
	);
}
