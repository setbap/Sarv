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
import * as path from "path";

import { SetNewResetPassowrd } from "../validation/auth/SetNewResetPassowrd";
import { RequestWithDecodedUser } from "./userAuth.controller";
import { TouristOrganization } from "../entity/TouristOrganization";
import { NotAcceptedTouristOrganization } from "../entity/NotAcceptedTouristOrganization";

interface OrgInterface {
  name: string;
  description: string;
  phoneNumber?: number;
  password: string;
}

interface LoginInterface {
  password: string;
  email: string;
}

interface OrganizationAcceptInterface {
  accpeted: boolean;
  orgId: number;
}

interface resetPasswordInterface {
  email: string;
}

interface setNewResetPasswordInterface {
  email: string;
  token: string;
  newPassword: string;
}

interface addTourLeaderInterface {
  email: string;
}

export class OrgAuthController {
  static orgCreate = asyncHandler(
    async (req: RequestWithDecodedUser, res: Response, next: NextFunction) => {
      const reqData = <OrgInterface>req.body;
      let imageUrl = null;

      if (req.files && req.files.image) {
        const file: any = req.files.image;
        if (!file.mimetype.startsWith("image")) {
          return next(new ErrorResponse(`Please upload an image file`, 400));
        }

        // Check filesize
        if (file.size > process.env.MAX_FILE_UPLOAD) {
          return next(
            new ErrorResponse(
              `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
              400
            )
          );
        }
        file.name = `photo_${new Date().getTime()}_user${req.user.id}_${
          path.parse(file.name).ext
        }`;
        imageUrl = `${process.env.IMAGE_URL}/${file.name}`;
        file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
          if (err) {
            console.error(err);
            return next(new ErrorResponse(`Problem with file upload`, 500));
          }
        });
      }
      const org = new NotAcceptedTouristOrganization();
      org.name = reqData.name;
      org.description = reqData.description;
      org.email = req.user.email;
      org.password = reqData.password;
      org.orgCreatorId = req.user.id;
      org.phoneNumber = +reqData.phoneNumber;
      if (imageUrl) {
        org.image = imageUrl;
      }
      const errors = await validate(org);
      if (errors.length > 0) {
        return next(new ErrorResponse("error in validate", 404));
      } else {
        org.password = await bcrypt.hash(reqData.password, 10);
        await org.save();
      }
      res.json({
        status: "org created"
      });
    }
  );

  static orgAccept = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const reqData = <OrganizationAcceptInterface>req.body;
      const notAccpeted = await NotAcceptedTouristOrganization.findOneOrFail(
        reqData.orgId
      );
      if (reqData.accpeted) {
        const to = new TouristOrganization();
        to.name = notAccpeted.name;
        to.email = notAccpeted.email;
        to.description = notAccpeted.description;
        to.phoneNumber = notAccpeted.phoneNumber;
        to.password = notAccpeted.password;
        to.orgCreatorId = notAccpeted.orgCreatorId;
        to.image = notAccpeted.image;
        await to.save();
        await NotAcceptedTouristOrganization.delete(reqData.orgId);
        return res.json({
          status: "congratulations!! your org accpeted"
        });
      } else {
        return res.json({
          status: "hey your org did'n accpeted"
        });
      }
    }
  );

  static orgLogin = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const reqData = <LoginInterface>req.body;
      const validator = new LoginValidate();
      validator.email = reqData.email;
      validator.password = reqData.password;
      const errors = await validate(validator);
      if (errors.length > 0) {
        return next(new ErrorResponse("error in validate", 404));
      }

      const org = await TouristOrganization.findOne({
        where: { email: reqData.email }
      });
      if (!org) {
        return next(new ErrorResponse("email or password is incorrect", 404));
      }
      const pass = await bcrypt.compare(reqData.password, org.password);
      if (!pass) {
        return next(new ErrorResponse("email or password is incorrect", 404));
      }

      const { id, email, name, description } = org;

      const token = jwt.sign(
        { id, email, roll: "ADMIN", name, description },
        process.env.JWT_SECRET_ORG,
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

  static orgResetPassword = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const reqData = <resetPasswordInterface>req.body;
      const validator = new ResetPasswordValidate();
      validator.email = reqData.email;
      const errors = await validate(validator);
      if (errors.length > 0) {
        return next(new ErrorResponse("error in validate", 404));
      }
      const random = randomBytes(32, async (err: Error, buf: Buffer) => {
        const to = await TouristOrganization.findOneOrFail({
          where: { email: reqData.email }
        });
        const expDate = new Date(Date.now() + 3600000);
        const token = buf.toString("hex");
        await getConnection()
          .createQueryBuilder()
          .update(TouristOrganization)
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

  static orgSetNewresetPassword = asyncHandler(
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

      const to = await TouristOrganization.findOneOrFail({
        where: { email: reqData.email }
      });

      const password = await bcrypt.hash(reqData.newPassword, 10);
      await getConnection()
        .createQueryBuilder()
        .update(TouristOrganization)
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
    async (req: any, res: Response, next: NextFunction) => {
      res.json(req.org);
    }
  );

  static addTourLeader = asyncHandler(
    async (req: any, res: Response, next: NextFunction) => {
      const reqData = <addTourLeaderInterface>req.body;
      const user = await User.findOneOrFail({
        where: { email: reqData.email }
      });
      const org = await TouristOrganization.findOneOrFail(req.org.id);

      if (user.iWantToBeTourLeader && user.organizationId === null) {
        user.organization = org;
        await user.save();
        return res.json({
          status: "tour leader added"
        });
      } else if (user.organizationId === org.id) {
        return res.json({
          status: "you added this user before"
        });
      } else {
        return res.json({
          status: "you can't add this user as tour leader"
        });
      }
    }
  );
}
