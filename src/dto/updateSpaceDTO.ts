import {IsArray, IsOptional, IsString, IsUrl, MaxLength} from "class-validator";

export class UpdateSpaceDTO {
    @IsOptional()
    @IsString()
    @MaxLength(255)
    name?: string;

    @IsOptional()
    @IsString()
    @MaxLength(1000)
    description?: string;

    @IsOptional()
    @IsArray()
    category?: string[];

    constructor(
        name: string,
        category: string[],
        description: string
    ) {
        this.category = category;
        this.name = name;
        this.description = description;
    }

}
