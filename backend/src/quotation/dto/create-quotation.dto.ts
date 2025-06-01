import { IsString, IsArray, IsOptional, IsNumber, IsDateString, ValidateNested, Min } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class QuotationDetailDto {
  @IsString()
  repairItemId: string;

  @IsString()
  itemName: string;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  price: number;

  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  quantity: number;
}

export class CreateQuotationDto {
  @IsString()
  schoolId: string;

  @IsString()
  repairLocation: string;

  @IsString()
  repairPerson: string;

  @IsDateString()
  repairTime: string;

  @IsOptional()
  @IsString()
  submittedBy?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuotationDetailDto)
  details: QuotationDetailDto[];
}
