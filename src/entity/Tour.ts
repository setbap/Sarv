import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  // JoinColumn,
  // OneToOne,
  ManyToMany,
  ManyToOne,
  OneToMany,
  JoinTable
} from "typeorm";
// import { Place } from "./Place";
import { User } from "./User";
import { TouristOrganization } from "./TouristOrganization";
import { TourCommnet } from "./TourComment";
import {
  IsInt,
  IsString,
  Length,
  IsObject,
  IsDate,
  IsNumber,
  Min,
  Max
} from "class-validator";
import { TourRate } from "./TourRate";

@Entity()
export class Tour extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  @Length(4, 64)
  name: string;

  @Column("int")
  @IsInt()
  tourCapacity: number;

  @Column("int")
  @IsInt()
  remainingCapacity: number;

  // @Column("int")
  // sourceId: number;
  // @OneToOne((type) => Place)
  // @JoinColumn()
  // source: Place;
  @Column({
    type: "geometry",
    nullable: false,
    spatialFeatureType: "Point",
    srid: 4326
  })
  @IsObject()
  sourceGeo: object;
  @Column("varchar")
  @IsString()
  @Length(2, 64)
  sourcePlace: string;

  // @Column("int")
  // destinationId: number;
  // @OneToOne((type) => Place)
  // @JoinColumn()
  // destination: Place;
  @Column({
    type: "geometry",
    nullable: false,
    spatialFeatureType: "Point",
    srid: 4326
  })
  @IsObject()
  destinationGeo: object;
  @Column("varchar")
  @IsString()
  @Length(2, 64)
  destinationPlace: string;

  @Column("timestamptz")
  @IsDate()
  startDate: Date;

  @Column("timestamptz")
  @IsDate()
  finishDate: Date;

  @Column("double precision")
  @IsNumber()
  @Min(1)
  @Max(5)
  hardShipLevel: number;

  @Column("int")
  @IsInt()
  price: number;

  @Column("varchar", { length: 255 })
  @IsString()
  @Length(4, 128)
  description: string;

  @ManyToMany(
    type => User,
    user => user.tours
  )
  @JoinTable()
  users: User[];

  @ManyToOne(
    type => TouristOrganization,
    tg => tg.tours
  )
  organiaztion: TouristOrganization;
  @Column("int")
  @IsInt()
  organiaztionId: number;

  @ManyToOne(
    type => User,
    tg => tg.tours
  )
  tourleader: User;
  @Column("int")
  @IsInt()
  tourleaderId: number;

  @OneToMany(
    type => TourCommnet,
    cmt => cmt => cmt.tour
  )
  comments: TourCommnet[];

  @OneToMany(
    type => TourRate,
    cmt => cmt => cmt.tour
  )
  rates: TourRate[];

  @Column("int", { default: 0 })
  commnetCount: number;

  @Column("int", { default: 0 })
  rateCount: number;

  @Column("int", { default: 0 })
  rateAvg: number;
}
