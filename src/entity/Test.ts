import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToMany,
  ManyToOne,
  OneToMany
} from "typeorm";
import { TouristOrganization } from "./TouristOrganization";
import { Tour } from "./Tour";
import { TourCommnet } from "./TourComment";
import { OrganizationComment } from "./OrganizationComment";
import {
  Length,
  IsEmail,
  MinLength,
  IsOptional,
  IsDate,
  IsEnum,
  IsInt
} from "class-validator";
import { IsEmailAlreadyExist } from "../validation/isEmailAlreadyExist";

export enum UserGender {
  MAN = "MAN",
  WOMAN = "WOMAN"
}

export enum UserRoll {
  USER = "USER",
  TOUR_LEADER = "TOUR_LEADER"
}

@Entity()
export class Test extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // name fard morderd nazar
  @Column()
  @Length(2, 24)
  name: string;

  // name khanevadegi
  @Column()
  @Length(2, 32)
  lastname: string;

  @Column("character varying", {
    default: "http://localhost:5000/public/upload/a.jpg"
  })
  image: string;

  //  tarikhe ozviate fard dar site ra negahdari mikonad
  @Column()
  @CreateDateColumn()
  createdAt: Date;

  // tarikhi ke akhrin bar fard profiel khoresh ro update mikone
  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
