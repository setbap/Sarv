import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	BaseEntity,
} from "typeorm";
import { User } from "./User";
import { TouristOrganization } from "./TouristOrganization";

@Entity()
export class OrganizationComment extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	body: string;

	@Column("int")
	rate: number;

	@ManyToOne(
		(type) => User,
		(user) => user.organizationCommnets,
	)
	user: User;

	@ManyToOne(
		(type) => TouristOrganization,
		(og) => og.comments,
	)
	organization: TouristOrganization;
}
