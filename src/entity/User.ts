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
  OneToMany
} from "typeorm";
import { TouristOrganization } from "./TouristOrganization";
import { Tour } from "./Tour";
import { TourCommnet } from "./TourComment";
import { OrganizationComment } from "./OrganizationComment";
import {
  Length,
  IsEmail,
  MinLength,
  IsOptional,
  IsDate,
  IsEnum,
  IsInt
} from "class-validator";
import { IsEmailAlreadyExist } from "../validation/isEmailAlreadyExist";

export enum UserGender {
  MAN = "MAN",
  WOMAN = "WOMAN"
}

export enum UserRoll {
  USER = "USER",
  TOUR_LEADER = "TOUR_LEADER"
}

@Entity()
@Unique(["email"])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // name fard morderd nazar
  @Column()
  @Length(2, 24)
  name: string;

  // name khanevadegi
  @Column()
  @Length(2, 32)
  lastname: string;

  @Column("boolean", { default: false })
  iWantToBeTourLeader: boolean;

  //email fard
  @Column()
  @IsEmail()
  // @IsEmailAlreadyExist({ message: "email already in use" })
  email: string;

  //ramze fard
  @Column()
  @MinLength(8)
  password: string;
  // @BeforeInsert()
  // async hashPasswordBeforeInsert() {
  // 	this.password = await bcrypt.hash(this.password, 10);
  // }

  // shomare telephone user
  @Column("int", { nullable: true })
  @IsOptional()
  @Length(9, 9)
  phoneNumber: number;

  // tarikhe tavalod user baraye peida kardane sen
  //date of breath
  @Column({ type: "date" })
  @IsDate()
  dob: Date;

  // peida kardane jensiate fard baraye sabte nam dar tour ha
  @Column({
    type: "enum",
    enum: UserGender,
    default: UserGender.WOMAN
  })
  @IsEnum(UserGender)
  gender: UserGender;

  @Column({
    type: "enum",
    enum: UserRoll,
    default: UserRoll.USER
  })
  @IsEnum(UserGender)
  @IsOptional()
  roll: UserRoll;

  @Column("timestamp without time zone", { nullable: true })
  @IsDate()
  @IsOptional()
  resetPasswordExpireTime: Date;

  @Column({ nullable: true })
  @IsInt()
  @IsOptional()
  resetPasswordToken: string;

  // age fardi tour lider bashe bayad id sazmani ke tour leader hast sabt beshe
  @Column("int", { nullable: true })
  organizationId: number;

  @ManyToOne(
    type => TouristOrganization,
    tg => tg.leaders
  )
  organization: TouristOrganization;

  // tour haei ke karbar tosh sabte nam karde
  @ManyToMany(
    type => Tour,
    tour => tour.users
  )
  tours: Tour[];

  @Column("character varying", {
    default: "http://localhost:5000/public/upload/user.jpg"
  })
  image: string;
  // comment haei ke fard baraye tour mizare
  @OneToMany(
    () => TourCommnet,
    tCmt => tCmt.user
  )
  tourCommnets: TourCommnet[];

  // comment haei ke fard baraye sazman mizare
  @OneToMany(
    () => OrganizationComment,
    oCmt => oCmt.user
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

  // @BeforeInsert()
  // async hashPasswordBeforeInsert() {
  // 	console.log("sinaaaaaaaaa");

  // 	this.password = await bcrypt.hash(this.password, 10);
  // }

  // checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
  // 	return bcrypt.compareSync(unencryptedPassword, this.password);
  // }
}
