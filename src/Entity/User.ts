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
	BeforeInsert,
	OneToMany,
} from "typeorm";
import * as bcrypt from "bcryptjs";
import { TouristOrganization } from "./TouristOrganization";
import { Tour } from "./Tour";
import { TourCommnet } from "./TourComment";
import { OrganizationComment } from "./OrganizationComment";

export enum UserGender {
	MAN = "MAN",
	WOMAN = "WOMAN",
}

@Entity()
@Unique(["email"])
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	// name fard morderd nazar
	@Column()
	name: string;

	// name khanevadegi
	@Column()
	lastname: string;

	//email fard
	@Column()
	email: string;

	//ramze fard
	@Column()
	password: string;

	// shomare telephone user
	@Column({ nullable: true })
	phoneNumber: number;

	// tarikhe tavalod user baraye peida kardane sen
	@Column({ type: "date" })
	//date of breath
	dob: Date;

	// peida kardane jensiate fard baraye sabte nam dar tour ha
	@Column({
		type: "enum",
		enum: UserGender,
		default: UserGender.WOMAN,
	})
	role: UserGender;

	// age fardi tour lider bashe bayad id sazmani ke tour leader hast sabt beshe
	@ManyToOne(
		(type) => TouristOrganization,
		(tg) => tg.leaders,
	)
	organization: TouristOrganization;

	// tour haei ke karbar tosh sabte nam karde
	@ManyToMany(
		(type) => Tour,
		(tour) => tour.users,
	)
	tours: Tour[];

	// comment haei ke fard baraye tour mizare
	@OneToMany(
		() => TourCommnet,
		(tCmt) => tCmt.user,
	)
	tourCommnets: TourCommnet[];

	// comment haei ke fard baraye sazman mizare
	@OneToMany(
		() => OrganizationComment,
		(oCmt) => oCmt.user,
	)
	organizationCommnets: OrganizationComment[];

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
		console.log("sinaaaaaaaaa");

		this.password = await bcrypt.hash(this.password, 10);
	}

	checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
		return bcrypt.compareSync(unencryptedPassword, this.password);
	}
}
