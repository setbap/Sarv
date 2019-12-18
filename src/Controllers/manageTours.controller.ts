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
import * as buffer from "buffer";
import { SetNewResetPassowrd } from "../validation/auth/SetNewResetPassowrd";
import { RequestWithDecodedUser } from "./userAuth.controller";
import { TouristOrganization } from "../entity/TouristOrganization";
import { NotAcceptedTouristOrganization } from "../entity/NotAcceptedTouristOrganization";
import { Tour } from "../entity/Tour";

interface TourInterface {
  name: string;
  tourCapacity: number;
  sourceGeo: object;
  sourcePlace: string;
  destinationGeo: object;
  destinationPlace: string;
  startDate: string;
  finishDate: string;
  hardShipLevel: number;
  tourleaderId: number;
  price: number;
  description: string;
}
export interface RequestWithDecodedOrg extends Request {
  org: DecodedOrgInterface;
}
interface DecodedOrgInterface {
  id: number;
  email: string;
  roll: string;
  name: string;
  description: string;
  iat: number;
  exp: number;
}

export class ManageTourController {
  static tourCreate = asyncHandler(
    async (req: RequestWithDecodedOrg, res: Response, next: NextFunction) => {
      const reqData = <TourInterface>req.body;
      await User.findOneOrFail({
        where: {
          id: reqData.tourleaderId,
          organizationId: req.org.id
        }
      });
      const tour = new Tour();
      tour.name = reqData.name;
      tour.tourCapacity = reqData.tourCapacity;
      tour.remainingCapacity = reqData.tourCapacity;
      tour.sourceGeo = reqData.sourceGeo;
      tour.tourleaderId = reqData.tourleaderId;
      tour.sourcePlace = reqData.sourcePlace;
      tour.destinationGeo = reqData.destinationGeo;
      tour.destinationPlace = reqData.destinationPlace;
      tour.organiaztionId = req.org.id;
      tour.startDate = new Date(reqData.startDate);
      tour.finishDate = new Date(reqData.finishDate);
      tour.hardShipLevel = reqData.hardShipLevel;
      tour.price = reqData.price;
      tour.description = reqData.description;
      const errors = await validate(tour);
      if (errors.length > 0) {
        console.log("my log", errors);
        return next(new ErrorResponse("error in validate", 404));
      } else if (tour.startDate >= tour.finishDate) {
        return next(
          new ErrorResponse("finish date must bigger than start date", 404)
        );
      } else if (tour.startDate <= new Date()) {
        return next(
          new ErrorResponse("you can't create tour with before today date", 404)
        );
      } else {
        await tour.save();
      }
      res.json({
        status: "tour created"
      });
    }
  );
}
