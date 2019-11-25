import {IsEmail, IsString, MaxLength, MinLength} from 'class-validator'
export class LoginValidate {
    @IsEmail()
    email : string

    @IsString()
    @MinLength(8)
    password : string

}