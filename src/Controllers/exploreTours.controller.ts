import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../middleware/async";
import { Tour } from "../entity/Tour";
import { createQueryBuilder, getRepository } from "typeorm";

interface lastTourInterface {
  count: number;
  skip: number;
}

export class ExploreToursController {
  static lastestTour = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const reqData = <lastTourInterface>req.body;
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
        .skip((+reqData.skip || 0) * (+reqData.count || 6))
        .take(+reqData.count || 6)
        .getManyAndCount();
      res.json({
        showCount: +reqData.count || 6,
        allItems: count,
        skip: +reqData.skip || 0,
        tours
      });
    }
  );
}
