import { Transform } from "class-transformer";
import { IsInt, IsOptional, IsString, Length, Max, Min } from "class-validator";

export class CreateProductDto {
    @IsString()
    @Length(8, 20)
    title: string;

    @IsInt()
    @Min(2_000, { message: 'Value must be greater than or equal to 2 000.' })
    @Max(50_000_000, { message: 'Value must be less than or equal to 50 000 000.' })
    @Transform(({ value }) => Number.parseInt(value))
    price: number;

    @IsOptional()
    @IsString()
    @Length(20, 300)
    description?: string;
}
