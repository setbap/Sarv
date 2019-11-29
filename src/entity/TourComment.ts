import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	BaseEntity,
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

	@Column("int")
	rate: number;

	@ManyToOne(
		(type) => User,
		(user) => user.tourCommnets,
	)
	user: User;

	@ManyToOne(
		(type) => Tour,
		(tour) => tour.comments,
	)
	tour: TouristOrganization;
}
