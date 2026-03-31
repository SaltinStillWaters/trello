import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateColumnDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}

export class UpdateColumnDto {
    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    order: number;
}