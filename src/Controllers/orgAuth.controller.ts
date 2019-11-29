import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import { getConnection, getRepository } from "typeorm";
import { User, UserGender } from "../entity/User";
import { NotRegUser } from "../Entity/NotRegUser";
import { asyncHandler } from "../middleware/async";
import { ErrorResponse } from "../utils/errorResponse";
import { validate } from "class-validator";
import { validateUserNumber } from "../validation/auth/UserValidate";
import { LoginValidate } from "../validation/auth/LoginValidate";
import { ResetPasswordValidate } from "../validation/auth/resetPasswordValidate";
import { randomBytes } from 'crypto';
import * as buffer from "buffer";
import { SetNewResetPassowrd } from "../validation/auth/SetNewResetPassowrd";
import { RequestWithDecodedUser } from "./userAuth.controller";
import { TouristOrganization } from "../Entity/TouristOrganization";




interface OrgInterface {
    name: string;
    description: string;
    phoneNumber?: number;
    email: string;
    password: string;
    orgCreatorId: number;
}

interface UserValidateInterface {
    validateNumber: number;
    email: string;
}

interface LoginInterface {
    password: string;
    email: string;
}

interface resetPasswordInterface {
    email: string;
}

interface setNewResetPasswordInterface {
    email: string;
    token: string;
    newPassword: string
}

export class OrgAuthController {
    static signin = asyncHandler(
        async (req: RequestWithDecodedUser, res: Response, next: NextFunction) => {
            const reqData = <OrgInterface>req.body;
            const org = new TouristOrganization();
            org.name = reqData.name;
            org.description = reqData.description;
            org.email = req.user.email;
            org.password = reqData.password;
            org.orgCreatorId = req.user.id;
            org.phoneNumber = reqData.phoneNumber;
            const errors = await validate(org);
            if (errors.length > 0) {
                console.log(errors);
                return next(new ErrorResponse("error in validate", 404));
            } else {
                org.password = await bcrypt.hash(reqData.password, 10);
                await org.save();
            }

            res.json({
                status: "org created",
            });
        },
    );

    // static validateUser = asyncHandler(
    //     async (req: Request, res: Response, next: NextFunction) => {
    //         const reqData = <UserValidateInterface>req.body;
    //         const validator = new validateUserNumber();
    //         validator.email = reqData.email;
    //         validator.validateNumber = reqData.validateNumber;
    //         const errors = await validate(validator);
    //         if (errors.length > 0) {
    //             console.log(errors);
    //             return next(new ErrorResponse("error in validate", 404));
    //         }
    //         const user = new User();
    //         const not_reg_user = await NotRegUser.findOneOrFail({
    //             where: { email: reqData.email },
    //         });
    //         if (
    //             not_reg_user.createdAt.getTime() + +(1000 * 60 * 60 * 24) >
    //             Date.now() &&
    //             not_reg_user.validationNumber === reqData.validateNumber
    //         ) {
    //             user.name = not_reg_user.name;
    //             user.lastname = not_reg_user.lastname;
    //             user.email = not_reg_user.email;
    //             user.password = not_reg_user.password;
    //             user.dob = not_reg_user.dob;
    //             user.gender = not_reg_user.gender;
    //             user.phoneNumber = not_reg_user.phoneNumber;
    //             await user.save();
    //             await NotRegUser.delete({ email: reqData.email });
    //             return res.json({
    //                 status: "user created",
    //                 number: user,
    //             });
    //         } else {
    //             return res.json({
    //                 status: "fail",
    //             });
    //         }
    //
    //     },
    // );
    //
    // static login = asyncHandler(
    //     async (req: Request, res: Response, next: NextFunction) => {
    //         const reqData = <LoginInterface>req.body;
    //         const validator = new LoginValidate();
    //         validator.email = reqData.email;
    //         validator.password = reqData.password;
    //         const errors = await validate(validator);
    //         if (errors.length > 0) {
    //             return next(new ErrorResponse("error in validate", 404));
    //         }
    //
    //         const user = await User.findOne({ where: { email: reqData.email } });
    //         if (!user) {
    //             return next(new ErrorResponse("email or password is incorrect", 404));
    //         }
    //         const pass = await bcrypt.compare(reqData.password, user.password);
    //         if (!pass) {
    //             return next(new ErrorResponse("email or password is incorrect", 404));
    //         }
    //
    //         const { id, email, gender, roll, dob, name, lastname } = user;
    //
    //         const token = jwt.sign({ id, email, gender, roll, dob, name, lastname }, process.env.JWT_SECRET, {
    //             expiresIn: process.env.JWT_EXPIRE
    //         });
    //
    //         const options = {
    //             expires: new Date(
    //                 Date.now() + +process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    //             ),
    //             httpOnly: true,
    //             secure: false
    //         };
    //
    //         if (process.env.NODE_ENV === 'production') {
    //             options.secure = true;
    //         }
    //
    //         return res
    //             .status(200)
    //             .cookie('token', token, options)
    //             .json({
    //                 success: true,
    //                 token
    //             });
    //
    //
    //     },
    // );
    //
    // static resetPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    //     const reqData = <resetPasswordInterface>req.body;
    //     const validator = new ResetPasswordValidate();
    //     validator.email = reqData.email;
    //     const errors = await validate(validator);
    //     if (errors.length > 0) {
    //         return next(new ErrorResponse('error in validate', 404));
    //     }
    //     const random = randomBytes(32, async (err: Error, buf: Buffer) => {
    //         const user = await User.findOneOrFail({ where: { email: reqData.email } });
    //         const expDate = new Date(Date.now() + 3600000);
    //         // @ts-ignore
    //         const token = buf.toString('hex');
    //         await getConnection()
    //             .createQueryBuilder()
    //             .update(User)
    //             .set({ resetPasswordExpireTime: expDate, resetPasswordToken: token })
    //             .where("email = :email", { email: reqData.email })
    //             .execute();
    //         return res.json({
    //             token, expDate
    //         });
    //     });
    // })
    //
    // static setNewresetPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    //     const reqData = <setNewResetPasswordInterface>req.body;
    //     const validator = new SetNewResetPassowrd();
    //     validator.email = reqData.email;
    //     validator.newPassword = reqData.newPassword;
    //     validator.token = reqData.token;
    //     const errors = await validate(validator);
    //     if (errors.length > 0) {
    //         return next(new ErrorResponse('error in validate', 404));
    //     }
    //
    //     const user = await User.findOneOrFail({ where: { email: reqData.email } });
    //
    //     const password = await bcrypt.hash(reqData.newPassword, 10);
    //     await getConnection()
    //         .createQueryBuilder()
    //         .update(User)
    //         .set({ resetPasswordExpireTime: null, resetPasswordToken: null, password: password })
    //         .where("email = :email", { email: reqData.email })
    //         .execute();
    //     return res.json({
    //         status: 'done'
    //     });
    // });
    //
    // static getMe = asyncHandler(async (req: RequestWithDecodedUser, res: Response, next: NextFunction) => {
    //     res.json(req.user)
    // })


}
