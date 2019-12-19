import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
  Unique
} from "typeorm";
import { User } from "./User";
import { TouristOrganization } from "./TouristOrganization";
import { Tour } from "./Tour";
import { Min, Max } from "class-validator";

@Entity()
@Unique(["userId", "tourId"])
export class TourRate extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("int")
  @Min(1)
  @Max(5)
  rate: number;

  @ManyToOne(
    type => User,
    user => user.tourCommnets
  )
  user: User;
  @Column("int")
  userId: number;

  @ManyToOne(
    type => Tour,
    tour => tour.comments
  )
  tour: TouristOrganization;

  @Column("int")
  tourId: number;
}
