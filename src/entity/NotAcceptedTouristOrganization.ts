import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  JoinColumn,
  OneToOne
} from "typeorm";
import { User } from "./User";
import * as bcrypt from "bcryptjs";
import { Tour } from "./Tour";
import { OrganizationComment } from "./OrganizationComment";
import { IsString, Length, IsInt } from "class-validator";
import { isCreatorExistInNATO } from "../validation/isCreatorExistInNATO";
import { isCreatorExistInTO } from "../validation/isCreatorExistInTO";

@Entity()
export class NotAcceptedTouristOrganization extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  @Length(6, 32)
  name: string;

  @Column("varchar", { length: 255 })
  @Length(8, 255)
  description: string;

  @Column("int", { nullable: true })
  @IsInt()
  phoneNumber: number;

  @Column()
  email: string;

  @Column()
  @IsString()
  @Length(6)
  password: string;

  @isCreatorExistInNATO({ message: "this user created org before" })
  @isCreatorExistInTO({ message: "this user created org before" })
  @Column()
  orgCreatorId: number;

  @OneToOne(type => User)
  @JoinColumn()
  orgCreator: User;

  //  tarikhe ozviate fard dar site ra negahdari mikonad
  @Column()
  @CreateDateColumn()
  createdAt: Date;

  // tarikhi ke akhrin bar fard profiel khoresh ro update mikone
  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
