import {
	Entity,
	BaseEntity,
	PrimaryGeneratedColumn,
	Column,
	JoinColumn,
	OneToOne,
	ManyToMany,
	ManyToOne,
	OneToMany,
} from "typeorm";
import { Place } from "./Place";
import { User } from "./User";
import { TouristOrganization } from "./TouristOrganization";
import { TourCommnet } from "./TourComment";

@Entity()
export class Tour extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column("int")
	tourCapacity: number;

	@Column("int")
	remainingCapacity: number;

	@OneToOne((type) => Place)
	@JoinColumn()
	source: Place;

	@OneToOne((type) => Place)
	@JoinColumn()
	destination: Place;

	@Column("double precision")
	hardShipLevel: number;

	@Column("int")
	price: number;

	@Column("varchar", { length: 255 })
	description: string;

	@ManyToMany(
		(type) => User,
		(user) => user.tours,
	)
	@JoinColumn()
	users: User[];

	@ManyToOne(
		(type) => TouristOrganization,
		(tg) => tg.tours,
	)
	organiaztion: TouristOrganization;

	@OneToMany(
		(type) => TourCommnet,
		(cmt) => (cmt) => cmt.tour,
	)
	comments: TourCommnet[];
}
