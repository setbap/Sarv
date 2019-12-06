import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import { getConnection, getRepository } from "typeorm";
import { User, UserGender } from "../entity/User";
import { NotRegUser } from "../entity/NotRegUser";
import { asyncHandler } from "../middleware/async";
import { ErrorResponse } from "../utils/errorResponse";
import { validate } from "class-validator";
import { validateUserNumber } from "../validation/auth/UserValidate";
import { LoginValidate } from "../validation/auth/LoginValidate";
import { ResetPasswordValidate } from "../validation/auth/resetPasswordValidate";
import { randomBytes } from "crypto";
import { SetNewResetPassowrd } from "../validation/auth/SetNewResetPassowrd";

interface DecodedUserInterface {
  id: number;
  email: string;
  gender: string;
  roll: string;
  dob: Date;
  name: string;
  lastname: string;
  iat: number;
  exp: number;
}

export interface RequestWithDecodedUser extends Request {
  user: DecodedUserInterface;
}

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
  newPassword: string;
}

export class UserAuthController {
  static signin = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const reqData = <UserInterface>req.body;
      const user = new NotRegUser();
      console.log(Date.parse(reqData.dob));
      user.name = reqData.name;
      user.lastname = reqData.lastname;
      user.email = reqData.email;
      user.password = reqData.password;
      user.dob = new Date(Date.parse(reqData.dob));
      user.gender = reqData.gender;
      user.phoneNumber = reqData.phoneNumber;
      user.validationNumber = Math.ceil(Math.random() * 10000);
      const errors = await validate(user);
      if (errors.length > 0) {
        console.log(errors);
        return next(new ErrorResponse("error in validate", 404));
      } else {
        user.password = await bcrypt.hash(reqData.password, 10);
        await user.save();
      }

      res.json({
        status: "user created",
        number: user.validationNumber
      });
    }
  );

  static validateUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const reqData = <UserValidateInterface>req.body;
      const validator = new validateUserNumber();
      validator.email = reqData.email;
      validator.validateNumber = reqData.validateNumber;
      const errors = await validate(validator);
      if (errors.length > 0) {
        console.log(errors);
        return next(new ErrorResponse("error in validate", 404));
      }
      const user = new User();
      const not_reg_user = await NotRegUser.findOneOrFail({
        where: { email: reqData.email }
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
        });
      } else {
        return res.json({
          status: "fail"
        });
      }
    }
  );

  static login = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const reqData = <LoginInterface>req.body;
      const validator = new LoginValidate();
      validator.email = reqData.email;
      validator.password = reqData.password;
      const errors = await validate(validator);
      if (errors.length > 0) {
        return next(new ErrorResponse("error in validate", 404));
      }

      const user = await User.findOne({ where: { email: reqData.email } });
      if (!user) {
        return next(new ErrorResponse("email or password is incorrect", 404));
      }
      const pass = await bcrypt.compare(reqData.password, user.password);
      if (!pass) {
        return next(new ErrorResponse("email or password is incorrect", 404));
      }

      const { id, email, gender, roll, dob, name, lastname } = user;

      const token = jwt.sign(
        { id, email, gender, roll, dob, name, lastname },
        process.env.JWT_SECRET_USER,
        {
          expiresIn: process.env.JWT_EXPIRE
        }
      );

      const options = {
        expires: new Date(
          Date.now() + +process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: false
      };

      if (process.env.NODE_ENV === "production") {
        options.secure = true;
      }

      return res
        .status(200)
        .cookie("token", token, options)
        .json({
          success: true,
          token
        });
    }
  );

  static resetPassword = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const reqData = <resetPasswordInterface>req.body;
      const validator = new ResetPasswordValidate();
      validator.email = reqData.email;
      const errors = await validate(validator);
      if (errors.length > 0) {
        return next(new ErrorResponse("error in validate", 404));
      }
      const random = randomBytes(32, async (err: Error, buf: Buffer) => {
        const user = await User.findOneOrFail({
          where: { email: reqData.email }
        });
        const expDate = new Date(Date.now() + 3600000);
        // @ts-ignore
        const token = buf.toString("hex");
        await getConnection()
          .createQueryBuilder()
          .update(User)
          .set({ resetPasswordExpireTime: expDate, resetPasswordToken: token })
          .where("email = :email", { email: reqData.email })
          .execute();
        return res.json({
          token,
          expDate
        });
      });
    }
  );

  static setNewresetPassword = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const reqData = <setNewResetPasswordInterface>req.body;
      const validator = new SetNewResetPassowrd();
      validator.email = reqData.email;
      validator.newPassword = reqData.newPassword;
      validator.token = reqData.token;
      const errors = await validate(validator);
      if (errors.length > 0) {
        return next(new ErrorResponse("error in validate", 404));
      }

      const user = await User.findOneOrFail({
        where: { email: reqData.email }
      });

      const password = await bcrypt.hash(reqData.newPassword, 10);
      await getConnection()
        .createQueryBuilder()
        .update(User)
        .set({
          resetPasswordExpireTime: null,
          resetPasswordToken: null,
          password: password
        })
        .where("email = :email", { email: reqData.email })
        .execute();
      return res.json({
        status: "done"
      });
    }
  );

  static getMe = asyncHandler(
    async (req: RequestWithDecodedUser, res: Response, next: NextFunction) => {
      res.json(req.user);
    }
  );
}
