import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";

import { getRepository } from "typeorm";
// import { validate } from "class-validator";
import { User, UserGender } from "../entity/User";
import { NotRegUser } from "../Entity/NotRegUser";
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

interface UserValidateInterface {
	validateNumber: number;
	email: string;
}

export class AuthController {
	static signin = asyncHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const reqData = <UserInterface>req.body;
			const user = new NotRegUser();
			console.log(Date.parse(reqData.dob));
			user.name = reqData.name;
			user.lastname = reqData.lastname;
			user.email = reqData.email;
			user.password = await bcrypt.hash(reqData.password, 10);
			user.dob = new Date(Date.parse(reqData.dob));
			user.gender = reqData.gender;
			user.phoneNumber = reqData.phoneNumber;
			user.validationNumber = Math.ceil(Math.random() * 10000);
			const errors = await validate(user);
			if (errors.length > 0) {
				console.log(errors);
				return next(new ErrorResponse("error in validate", 404));
			} else {
				await user.save();
			}

			res.json({
				status: "user created",
				number: user.validationNumber,
			});
		},
	);

	static validateUser = asyncHandler(
		async (req: Request, res: Response, next: NextFunction) => {
			const reqData = <UserValidateInterface>req.body;
			const user = new User();
			const not_reg_user = await NotRegUser.findOneOrFail({
				where: { email: reqData.email },
			});
			if (
				not_reg_user.createdAt.getTime() + +(1000 * 60 * 60 * 24) >
					Date.now() &&
				not_reg_user.validationNumber === reqData.validateNumber
			) {
				user.name = not_reg_user.name;
				user.lastname = not_reg_user.lastname;
				user.email = not_reg_user.email;
				user.password = not_reg_user.password;
				user.dob = not_reg_user.dob;
				user.gender = not_reg_user.gender;
				user.phoneNumber = not_reg_user.phoneNumber;
				await user.save();
				await NotRegUser.delete({ email: reqData.email });
				return res.json({
					status: "user created",
					number: user,
				});
			} else {
				return res.json({
					status: "fail",
				});
			}

			// const errors = await validate(user);
			// if (errors.length > 0) {
			// 	console.log(errors);
			// 	return next(new ErrorResponse("error in validate", 404));
			// } else {
			// 	await user.save();
			// }

			res.json({
				status: "user created",
				number: user,
			});
		},
	);
}
