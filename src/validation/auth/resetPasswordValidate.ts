import { IsEmail } from 'class-validator'
export class ResetPasswordValidate {
    @IsEmail()
    email: string
}