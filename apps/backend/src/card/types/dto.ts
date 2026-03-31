import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCardDto {
    @IsString()
    @IsOptional()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;
}

export class UpdateCardDto {
    @IsString()
    @IsOptional()
    title?: string;
    
    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @IsOptional()
    order?: number;

    @IsString()
    @IsOptional()
    columnId?: string;
}