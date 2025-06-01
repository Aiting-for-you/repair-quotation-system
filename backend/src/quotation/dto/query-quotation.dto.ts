import { IsOptional, IsString, IsDateString, IsNumberString } from 'class-validator';

export class QueryQuotationDto {
  @IsOptional()
  @IsString()
  schoolId?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}
