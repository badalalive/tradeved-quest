import {
    IsString,
    IsOptional,
    IsBoolean,
    IsEmail,
    IsNotEmpty,
    IsUrl,
    MaxLength,
} from 'class-validator';

export class CreateSpaceDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    company_name: string = "";

    @IsOptional()
    @IsString()
    @MaxLength(255)
    name?: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    @IsEmail()
    email: string = "";

    @IsOptional()
    @IsString()
    @MaxLength(255)
    description?: string;

    @IsOptional()
    @IsBoolean()
    is_email_verified?: boolean = false;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    banner?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    @IsUrl()
    logo_url?: string;

    @IsString()
    @IsNotEmpty()
    category: string = "";

    @IsOptional()
    @IsString()
    created_by?: string;

    @IsOptional()
    @IsString()
    updated_by?: string;
}