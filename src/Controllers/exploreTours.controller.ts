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

interface lastTourInterface {
  isTwelve: boolean;
  pageNumber: number;
}

interface rateTourInterface {
  tourId: number;
  rate: number;
}

interface commentTourInterface {
  tourId: number;
  body: string;
}

interface fullSearchInterface extends lastTourInterface {
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

interface distantSearchInterface extends lastTourInterface {
  distant: number;
  lat: number;
  lng: number;
}

export class ExploreToursController {
  static lastestTour = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const reqData = <lastTourInterface>req.body;
      const pageCount = reqData.isTwelve ? 12 : 12; // if true 12 show 12 item per page else show 6 item
      const pageNumber =
        +reqData.pageNumber && +reqData.pageNumber > 0
          ? +reqData.pageNumber
          : 1;
      const [tours, count] = await getRepository(Tour)
        .createQueryBuilder("tour")
        .leftJoinAndSelect("tour.organiaztion", "organiaztion")
        .select([
          "tour.id",
          "tour.name",
          "tour.price",
          "tour.remainingCapacity",
          "tour.sourcePlace",
          "tour.destinationPlace",
          "tour.startDate",
          "tour.finishDate",
          "tour.price",
          "tour.hardShipLevel",
          "tour.image",
          "organiaztion.name",
          "organiaztion.id"
          // "tour.description",
        ])
        .orderBy("tour.id", "DESC")
        .skip(pageCount * (pageNumber - 1))
        .take(pageCount)
        .getManyAndCount();
      res.json({
        showCount: pageCount,
        allItems: count,
        pageNumber: pageNumber,
        tours
      });
    }
  );

  static distantSearch = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const reqData = <distantSearchInterface>req.body;
      const pageCount = reqData.isTwelve ? 12 : 6; // if true 12 show 12 item per page else show 6 item
      const origin = {
        type: "Point",
        coordinates: [reqData.lng, reqData.lat]
      };

      const pageNumber =
        +reqData.pageNumber && +reqData.pageNumber > 0
          ? +reqData.pageNumber
          : 1;
      const [tours, count] = await getRepository(Tour)
        .createQueryBuilder("tour")
        .leftJoinAndSelect("tour.organiaztion", "organiaztion")
        .select([
          "tour.id",
          "tour.name",
          "tour.price",
          "tour.remainingCapacity",
          "tour.sourcePlace",
          "tour.destinationPlace",
          "tour.startDate",
          "tour.finishDate",
          "tour.price",
          "tour.image",
          "tour.hardShipLevel",
          "organiaztion.name",
          "organiaztion.id",
          "tour.sourceGeo"
          // "tour.description",
        ])
        .where(
          "ST_DWithin((tour.sourceGeo)::geography, ST_GeomFromGeoJSON(:origin)::geography,:distant)"
        )
        .setParameters({
          origin: JSON.stringify(origin),
          distant: reqData.distant
        })
        .orderBy("tour.id", "DESC")
        .skip(pageCount * (pageNumber - 1))
        .take(pageCount)
        .getManyAndCount();
      res.json({
        showCount: pageCount,
        allItems: count,
        pageNumber: pageNumber,
        tours
      });
    }
  );

  static fullSearch = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const reqData = <fullSearchInterface>req.body;
      const pageCount = reqData.isTwelve ? 12 : 12; // if true 12 show 12 item per page else show 6 item
      const queryData = {};
      const pageNumber =
        +reqData.pageNumber && +reqData.pageNumber > 0
          ? +reqData.pageNumber
          : 1;
      for (let [key, value] of Object.entries(reqData)) {
        if (value) {
          if (key == "name") {
            queryData["name"] = Like(`%${value}%`);
          } else if (key === "remainingCapacity") {
            queryData["remainingCapacity"] = MoreThanOrEqual(value);
          } else if (key === "destinationPlace") {
            queryData["destinationPlace"] = Like(`%${value}%`);
          } else if (key === "sourcePlace") {
            queryData["sourcePlace"] = Like(`%${value}%`);
          } else if (key === "hardShipLevel") {
            queryData["hardShipLevel"] = Equal(value);
          } else if (key === "startDate") {
            queryData["startDate"] = MoreThanOrEqual(value);
          }
        }
      }
      if (+reqData["highPrice"] && +reqData["lowPrice"]) {
        queryData["price"] = Between(
          +reqData["lowPrice"],
          +reqData["highPrice"]
        );
      } else if (+reqData["highPrice"]) {
        queryData["price"] = LessThanOrEqual(+reqData["highPrice"]);
      } else if (+reqData["lowPrice"]) {
        queryData["price"] = MoreThanOrEqual(+reqData["lowPrice"]);
      }

      if (reqData["highStartDate"] && reqData["lowStartDate"]) {
        queryData["startDate"] = Between(
          reqData["lowStartDate"],
          reqData["highStartDate"]
        );
      } else if (reqData["highStartDate"]) {
        queryData["startDate"] = LessThanOrEqual(reqData["highStartDate"]);
      } else if (reqData["lowStartDate"]) {
        queryData["startDate"] = MoreThanOrEqual(reqData["lowStartDate"]);
      }

      if (reqData["highFinishDate"] && reqData["lowFinishDate"]) {
        queryData["finishDate"] = Between(
          reqData["lowFinishDate"],
          reqData["highFinishDate"]
        );
      } else if (reqData["highFinishDate"]) {
        queryData["finishDate"] = LessThanOrEqual(reqData["highFinishDate"]);
      } else if (reqData["lowFinishDate"]) {
        queryData["finishDate"] = MoreThanOrEqual(reqData["lowFinishDate"]);
      }
      const [tours, count] = await getRepository(Tour)
        .createQueryBuilder("tour")
        .leftJoinAndSelect("tour.organiaztion", "organiaztion")
        .select([
          "tour.id",
          "tour.name",
          "tour.image",
          "tour.price",
          "tour.remainingCapacity",
          "tour.sourcePlace",
          "tour.destinationPlace",
          "tour.startDate",
          "tour.finishDate",
          "tour.price",
          "tour.hardShipLevel",
          "organiaztion.name",
          "organiaztion.id"
          // "tour.description",
        ])
        .where(queryData)
        .orderBy("tour.id", "DESC")
        .skip(pageCount * (pageNumber - 1))
        .take(pageCount)
        .getManyAndCount();
      res.json({
        showCount: pageCount,
        allItems: count,
        pageNumber: pageNumber,
        tours
      });
    }
  );

  static rateTour = asyncHandler(
    async (req: RequestWithDecodedUser, res: Response, next: NextFunction) => {
      const reqData = <rateTourInterface>req.body;

      const tourRate = new TourRate();
      tourRate.rate = reqData.rate;
      tourRate.tourId = reqData.tourId;
      tourRate.userId = req.user.id;

      const tour = await Tour.findOneOrFail(reqData.tourId);
      const rateAvg =
        (tour.rateAvg * tour.rateCount + reqData.rate) / (tour.rateCount + 1);
      const rateCount = tour.rateCount + 1;

      await getConnection()
        .createQueryBuilder()
        .update(Tour)
        .set({ rateAvg: rateAvg, rateCount: rateCount })
        .where("id = :id", { id: reqData.tourId })
        .execute();
      await tourRate.save();

      res.json({
        status: "added"
      });
    }
  );

  static commentTour = asyncHandler(
    async (req: RequestWithDecodedUser, res: Response, next: NextFunction) => {
      const reqData = <commentTourInterface>req.body;

      const tourComment = new TourCommnet();
      tourComment.body = reqData.body;
      tourComment.tourId = reqData.tourId;
      tourComment.userId = req.user.id;
      tourComment.nameOfUser = req.user.name;

      await tourComment.save();
      await getConnection()
        .createQueryBuilder()
        .update(Tour)
        .set({ commnetCount: () => '"commnetCount" + 1' })
        .where("id = :id", { id: reqData.tourId })
        .execute();

      res.json({
        status: "added"
      });
    }
  );

  static singleTour = asyncHandler(
    async (req: RequestWithDecodedUser, res: Response, next: NextFunction) => {
      // const tour = await Tour.findOne(req.params.id, {
      //   relations: ["comments", "tourleader", "organiaztion"],
      //   select: ["id"]
      // });

      const tour = await getRepository(Tour)
        .createQueryBuilder("tour")
        .leftJoinAndSelect("tour.comments", "cmts")
        .leftJoinAndSelect("tour.organiaztion", "org")
        .leftJoinAndSelect("tour.tourleader", "tl")
        .select([
          "cmts",
          "tour",
          "tour.id",
          "org.email",
          "org.id",
          "org.name",
          "org.rateAvg",
          "org.image",
          "tl.id",
          "tl.image",
          "tl.name",
          "tl.lastname"
        ])
        .where({ id: req.params.id })
        .getOne();

      if (!tour) {
        return res.status(404).json({
          status: "not found"
        });
      }

      res.json({
        status: "done",
        tour
      });
    }
  );
}
