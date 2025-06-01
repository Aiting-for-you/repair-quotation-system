import { IsString, IsOptional, IsEnum, IsNumber, MaxLength, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateRepairItemDto {
  @IsString()
  schoolId: string;

  @IsString()
  @MaxLength(255)
  itemName: string;

  @IsString()
  @MaxLength(255)
  location: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsEnum(['low', 'medium', 'high', 'urgent'])
  urgency?: string = 'medium';

  @IsOptional()
  @IsEnum(['pending', 'processing', 'completed', 'cancelled'])
  status?: string = 'pending';

  @IsOptional()
  @IsString()
  @MaxLength(50)
  unit?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  price?: number;
}
