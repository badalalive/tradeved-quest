import {IsEmail, IsNotEmpty} from "class-validator";

export class EmailDto {
    @IsNotEmpty()
    @IsEmail({}, { message: 'Invalid email address' })
    email: string;

    constructor(email: string) {
        this.email = email;
    }
}