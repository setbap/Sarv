import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity
} from "typeorm";

import {
  Length,
  IsEmail,
  MinLength,
  IsOptional,
  IsDate,
  IsEnum
} from "class-validator";
import { IsEmailAlreadyExist } from "../validation/isEmailAlreadyExist";
import { UserGender } from "./User";
import { isEmailAlreadyExistNotRegUser } from "../validation/isEmailAlreadyExistNotRegUser";

@Entity()
@Unique(["email"])
export class NotRegUser extends BaseEntity {
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

  //email fard
  @Column()
  @IsEmail()
  @isEmailAlreadyExistNotRegUser({ message: "email already in use" })
  @IsEmailAlreadyExist({ message: "email already in use" })
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

  @Column("character varying", {
    default: "http://localhost:5000/public/upload/to.jpg"
  })
  image: string;

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

  @Column("int")
  validationNumber: number;

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
