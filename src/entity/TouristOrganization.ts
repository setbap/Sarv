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
import { IsString, Length, IsInt, IsDate, IsOptional } from "class-validator";

@Entity()
export class TouristOrganization extends BaseEntity {
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

  @Column()
  orgCreatorId: number;

  @Column("timestamp without time zone", { nullable: true })
  @IsDate()
  @IsOptional()
  resetPasswordExpireTime: Date;

  @Column({ nullable: true })
  @IsInt()
  @IsOptional()
  resetPasswordToken: string;

  @OneToOne(type => User)
  @JoinColumn()
  orgCreator: User;

  @OneToMany(
    type => Tour,
    tour => tour.organiaztion
  )
  tours: Tour[];

  @OneToMany(
    type => User,
    user => user.organization
  )
  leaders: User[];

  @Column("int", { default: 0 })
  numberOfCommnet: number;

  @Column("double precision", { default: 0 })
  avgRate: number;

  @OneToMany(
    type => OrganizationComment,
    cmt => cmt => cmt.organiaztion
  )
  comments: OrganizationComment[];

  //  tarikhe ozviate fard dar site ra negahdari mikonad
  @Column()
  @CreateDateColumn()
  createdAt: Date;

  // tarikhi ke akhrin bar fard profiel khoresh ro update mikone
  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
