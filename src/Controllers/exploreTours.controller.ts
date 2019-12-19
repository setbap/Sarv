import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../middleware/async";
import { Tour } from "../entity/Tour";
import { createQueryBuilder, getRepository } from "typeorm";

interface lastTourInterface {
  isTwelve: boolean;
  pageNumber: number;
}

interface distantSearchInterface {
  distant: number;
  isTwelve: boolean;
  pageNumber: number;
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
}
