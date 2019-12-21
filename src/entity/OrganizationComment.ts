import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity
} from "typeorm";
import { User } from "./User";
import { TouristOrganization } from "./TouristOrganization";

@Entity()
export class OrganizationComment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  @Column("character varying")
  nameOfUser: string;

  @Column("int")
  userId: number;

  @ManyToOne(
    type => User,
    user => user.organizationCommnets
  )
  user: User;

  @ManyToOne(
    type => TouristOrganization,
    og => og.comments
  )
  organization: TouristOrganization;
  @Column("int")
  organizationId: number;
}
