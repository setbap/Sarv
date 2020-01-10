import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../middleware/async";
import { Tour } from "../entity/Tour";
import {
  createQueryBuilder,
  getRepository,
  Like,
  Between,
  MoreThanOrEqual,
  Brackets,
  LessThanOrEqual,
  Equal,
  getConnection
} from "typeorm";
import { RequestWithDecodedUser } from "./userAuth.controller";
import { TourRate } from "../entity/TourRate";
import { TourCommnet } from "../entity/TourComment";
import { TouristOrganization } from "../entity/TouristOrganization";
import { ErrorResponse } from "../utils/errorResponse";
import { OrganizationRate } from "../entity/OrganizationRate";
import { OrganizationComment } from "../entity/OrganizationComment";

interface bestOrgInterface {
  isTwelve: boolean;
  pageNumber: number;
}

interface rateOrgInterface {
  orgId: number;
  rate: number;
}

interface commentOrgInterface {
  orgId: number;
  body: string;
}

interface fullSearchInterface extends bestOrgInterface {
  name: string;
  remainingCapacity: number;
  sourcePlace: string;
  destinationPlace: string;
  highStartDate: Date;
  lowStartDate: Date;
  HighFinishDate: Date;
  lowFinishDate: Date;
  hardShipLevel: number;
  highPrice: number;
  lowPrice: number;
}

interface distantSearchInterface extends bestOrgInterface {
  distant: number;
  lat: number;
  lng: number;
}

export class ExploreOrgsController {
  static bestOrg = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const reqData = <bestOrgInterface>req.body;
      const pageCount = reqData.isTwelve ? 12 : 6; // if true 12 show 12 item per page else show 6 item
      const pageNumber =
        +reqData.pageNumber && +reqData.pageNumber > 0
          ? +reqData.pageNumber
          : 1;
      const [orgs, count] = await getRepository(TouristOrganization)
        .createQueryBuilder("to")
        .select([
          "to.id",
          "to.name",
          "to.commnetCount",
          "to.rateAvg",
          "to.tourCount",
          "to.description",
          "to.image"
        ])
        .orderBy("to.rateAvg", "DESC")
        .skip(pageCount * (pageNumber - 1))
        .take(pageCount)
        .getManyAndCount();
      res.json({
        showCount: pageCount,
        allItems: count,
        pageNumber: pageNumber,
        orgs
      });
    }
  );

  //   static distantSearch = asyncHandler(
  //     async (req: Request, res: Response, next: NextFunction) => {
  //       const reqData = <distantSearchInterface>req.body;
  //       const pageCount = reqData.isTwelve ? 12 : 6; // if true 12 show 12 item per page else show 6 item
  //       const origin = {
  //         type: "Point",
  //         coordinates: [reqData.lng, reqData.lat]
  //       };

  //       const pageNumber =
  //         +reqData.pageNumber && +reqData.pageNumber > 0
  //           ? +reqData.pageNumber
  //           : 1;
  //       const [tours, count] = await getRepository(Tour)
  //         .createQueryBuilder("tour")
  //         .leftJoinAndSelect("tour.organiaztion", "organiaztion")
  //         .select([
  //           "tour.id",
  //           "tour.name",
  //           "tour.price",
  //           "tour.remainingCapacity",
  //           "tour.sourcePlace",
  //           "tour.destinationPlace",
  //           "tour.startDate",
  //           "tour.finishDate",
  //           "tour.price",
  //           "tour.hardShipLevel",
  //           "organiaztion.name",
  //           "organiaztion.id",
  //           "tour.sourceGeo"
  //           // "tour.description",
  //         ])
  //         .where(
  //           "ST_DWithin((tour.sourceGeo)::geography, ST_GeomFromGeoJSON(:origin)::geography,:distant)"
  //         )
  //         .setParameters({
  //           origin: JSON.stringify(origin),
  //           distant: reqData.distant
  //         })
  //         .orderBy("tour.id", "DESC")
  //         .skip(pageCount * (pageNumber - 1))
  //         .take(pageCount)
  //         .getManyAndCount();
  //       res.json({
  //         showCount: pageCount,
  //         allItems: count,
  //         pageNumber: pageNumber,
  //         tours
  //       });
  //     }
  //   );

  //   static fullSearch = asyncHandler(
  //     async (req: Request, res: Response, next: NextFunction) => {
  //       const reqData = <fullSearchInterface>req.body;
  //       const pageCount = reqData.isTwelve ? 12 : 12; // if true 12 show 12 item per page else show 6 item
  //       const queryData = {};
  //       const pageNumber =
  //         +reqData.pageNumber && +reqData.pageNumber > 0
  //           ? +reqData.pageNumber
  //           : 1;
  //       for (let [key, value] of Object.entries(reqData)) {
  //         if (value) {
  //           if (key == "name") {
  //             queryData["name"] = Like(`%${value}%`);
  //           } else if (key === "remainingCapacity") {
  //             queryData["remainingCapacity"] = MoreThanOrEqual(value);
  //           } else if (key === "destinationPlace") {
  //             queryData["destinationPlace"] = Like(`%${value}%`);
  //           } else if (key === "sourcePlace") {
  //             queryData["sourcePlace"] = Like(`%${value}%`);
  //           } else if (key === "hardShipLevel") {
  //             queryData["hardShipLevel"] = Equal(value);
  //           } else if (key === "startDate") {
  //             queryData["startDate"] = MoreThanOrEqual(value);
  //           }
  //         }
  //       }
  //       if (+reqData["highPrice"] && +reqData["lowPrice"]) {
  //         queryData["price"] = Between(
  //           +reqData["lowPrice"],
  //           +reqData["highPrice"]
  //         );
  //       } else if (+reqData["highPrice"]) {
  //         queryData["price"] = LessThanOrEqual(+reqData["highPrice"]);
  //       } else if (+reqData["lowPrice"]) {
  //         queryData["price"] = MoreThanOrEqual(+reqData["lowPrice"]);
  //       }

  //       if (reqData["highStartDate"] && reqData["lowStartDate"]) {
  //         queryData["startDate"] = Between(
  //           reqData["lowStartDate"],
  //           reqData["highStartDate"]
  //         );
  //       } else if (reqData["highStartDate"]) {
  //         queryData["startDate"] = LessThanOrEqual(reqData["highStartDate"]);
  //       } else if (reqData["lowStartDate"]) {
  //         queryData["startDate"] = MoreThanOrEqual(reqData["lowStartDate"]);
  //       }

  //       if (reqData["highFinishDate"] && reqData["lowFinishDate"]) {
  //         queryData["finishDate"] = Between(
  //           reqData["lowFinishDate"],
  //           reqData["highFinishDate"]
  //         );
  //       } else if (reqData["highFinishDate"]) {
  //         queryData["finishDate"] = LessThanOrEqual(reqData["highFinishDate"]);
  //       } else if (reqData["lowFinishDate"]) {
  //         queryData["finishDate"] = MoreThanOrEqual(reqData["lowFinishDate"]);
  //       }
  //       const [tours, count] = await getRepository(Tour)
  //         .createQueryBuilder("tour")
  //         .leftJoinAndSelect("tour.organiaztion", "organiaztion")
  //         .select([
  //           "tour.id",
  //           "tour.name",
  //           "tour.price",
  //           "tour.remainingCapacity",
  //           "tour.sourcePlace",
  //           "tour.destinationPlace",
  //           "tour.startDate",
  //           "tour.finishDate",
  //           "tour.price",
  //           "tour.hardShipLevel",
  //           "organiaztion.name",
  //           "organiaztion.id"
  //           // "tour.description",
  //         ])
  //         .where(queryData)
  //         .orderBy("tour.id", "DESC")
  //         .skip(pageCount * (pageNumber - 1))
  //         .take(pageCount)
  //         .getManyAndCount();
  //       res.json({
  //         showCount: pageCount,
  //         allItems: count,
  //         pageNumber: pageNumber,
  //         tours
  //       });
  //     }
  //   );

  static rateOrg = asyncHandler(
    async (req: RequestWithDecodedUser, res: Response, next: NextFunction) => {
      const reqData = <rateOrgInterface>req.body;

      const orgRate = new OrganizationRate();
      orgRate.rate = reqData.rate;
      orgRate.organizationId = reqData.orgId;
      orgRate.userId = req.user.id;

      if (!(+reqData.rate && +reqData.rate <= 5 && +reqData.rate >= 1)) {
        return next(new ErrorResponse(`wrong rate`, 401));
      }

      const org = await TouristOrganization.findOneOrFail(reqData.orgId);
      const rateAvg =
        (org.rateAvg * org.rateCount + reqData.rate) / (org.rateCount + 1);
      const rateCount = org.rateCount + 1;

      await orgRate.save();
      await getConnection()
        .createQueryBuilder()
        .update(TouristOrganization)
        .set({ rateAvg: rateAvg, rateCount: rateCount })
        .where("id = :id", { id: reqData.orgId })
        .execute();

      res.json({
        status: "org rated"
      });
    }
  );

  static commentOrg = asyncHandler(
    async (req: RequestWithDecodedUser, res: Response, next: NextFunction) => {
      const reqData = <commentOrgInterface>req.body;

      const orgComment = new OrganizationComment();
      orgComment.body = reqData.body;
      orgComment.organizationId = reqData.orgId;
      orgComment.userId = req.user.id;
      orgComment.nameOfUser = req.user.name;

      await orgComment.save();
      await getConnection()
        .createQueryBuilder()
        .update(Tour)
        .set({ commnetCount: () => '"commnetCount" + 1' })
        .where("id = :id", { id: reqData.orgId })
        .execute();

      res.json({
        status: "comment added"
      });
    }
  );

  static singleOrg = asyncHandler(
    async (req: RequestWithDecodedUser, res: Response, next: NextFunction) => {
      // const tour = await Tour.findOne(req.params.id, {
      //   relations: ["comments", "tourleader", "organiaztion"],
      //   select: ["id"]
      // });

      const org = await getRepository(TouristOrganization)
        .createQueryBuilder("to")
        .leftJoinAndSelect("to.comments", "cmts")
        .leftJoinAndSelect("to.tours", "tour")
        .leftJoinAndSelect("to.leaders", "tl")
        .leftJoinAndSelect("to.orgCreator", "oc")
        .select([
          "to",
          "cmts",
          "tour.id",
          "tour.name",
          "tour.startDate",
          "tour.finishDate",
          "tl.id",
          "tl.name",
          "tl.lastname",
          "oc.id",
          "oc.name",
          "oc.lastname"
        ])
        .where({ id: req.params.id })
        .getOne();

      if (!org) {
        return res.status(404).json({
          status: "not found"
        });
      }
      delete org.password;

      res.json({
        status: "done",
        org
      });
    }
  );
}
