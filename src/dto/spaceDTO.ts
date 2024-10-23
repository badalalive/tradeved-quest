import {
    IsString,
    IsOptional,
    IsBoolean,
    IsEmail,
    IsNotEmpty,
    IsUrl,
    MaxLength,
    IsArray,
    ArrayNotEmpty,
} from 'class-validator';

export class CreateSpaceDto {
    @IsString()
    @IsOptional()
    @MaxLength(255)
    company_name?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    name?: string;

    @IsString()
    @IsOptional()
    @MaxLength(255)
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    @MaxLength(1000)
    description?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    @IsUrl()
    logo_url?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    @IsUrl()
    banner?: string;

    @IsArray()
    @IsUrl({}, { each: true })
    links?: string[];  // Ensure links are validated as an array of URLs

    @IsString()
    @IsOptional()
    category?: string;

    @IsOptional()
    @IsString()
    created_by?: string;

    @IsOptional()
    @IsString()
    updated_by?: string;
}