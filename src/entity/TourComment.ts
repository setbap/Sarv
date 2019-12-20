import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
  JoinColumn
} from "typeorm";
import { User } from "./User";
import { TouristOrganization } from "./TouristOrganization";
import { Tour } from "./Tour";

@Entity()
export class TourCommnet extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  @Column("character varying")
  nameOfUser: string;

  @ManyToOne(
    type => User,
    user => user.id
  )
  @JoinColumn()
  user: User;
  @Column("int")
  userId: number;

  @ManyToOne(
    type => Tour,
    tour => tour.id
  )
  @JoinColumn({ name: "tourId" })
  tour: Tour;
  @Column("int")
  tourId: number;
}
