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
  Equal
} from "typeorm";

interface lastTourInterface {
  isTwelve: boolean;
  pageNumber: number;
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
}
