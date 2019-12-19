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
import { Max, Min } from "class-validator";

@Entity()
@Unique(["userId", "organizationId"])
export class OrganizationRate extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("int")
  @Max(5)
  @Min(1)
  rate: number;

  @Column("int")
  userId: number;

  @ManyToOne(
    type => User,
    user => user.organizationCommnets
  )
  user: User;

  @Column("int")
  organizationId: number;

  @ManyToOne(
    type => TouristOrganization,
    og => og.comments
  )
  organization: TouristOrganization;
}
