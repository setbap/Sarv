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
} from "typeorm";
import { User } from "./User";
import * as bcrypt from "bcryptjs";
import { Tour } from "./Tour";
import { OrganizationComment } from "./OrganizationComment";

@Entity()
export class TouristOrganization extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column("varchar", { length: 255 })
	description: string;

	@Column("int")
	phoneNumber: number;

	@Column()
	email: string;

	@Column()
	password: string;

	@OneToMany(
		(type) => Tour,
		(tour) => tour.organiaztion,
	)
	tours: Tour[];

	@OneToMany(
		(type) => User,
		(user) => user.organization,
	)
	leaders: User[];

	@Column("int")
	numberOfCommnet: number;

	@Column("double precision")
	avgRate: number;

	@OneToMany(
		(type) => OrganizationComment,
		(cmt) => (cmt) => cmt.organiaztion,
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

	@BeforeInsert()
	async hashPasswordBeforeInsert() {
		this.password = await bcrypt.hash(this.password, 10);
	}
}
