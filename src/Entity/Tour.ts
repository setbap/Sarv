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
	JoinTable,
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

	@Column("int")
	sourceId: number;
	@OneToOne((type) => Place)
	@JoinColumn()
	source: Place;

	@Column("int")
	destinationId: number;
	@OneToOne((type) => Place)
	@JoinColumn()
	destination: Place;

	@Column("timestamptz")
	startDate: Date;

	@Column("timestamptz")
	finishDate: Date;

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
	@JoinTable()
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
