import { Length, IsEmail, IsInt, MaxLength } from "class-validator";

export class validateUserNumber {
  @IsEmail()
  email: string;

  @IsInt()
  validateNumber: number;
}
