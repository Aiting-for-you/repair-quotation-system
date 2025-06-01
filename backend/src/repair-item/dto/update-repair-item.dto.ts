import { PartialType } from '@nestjs/mapped-types';
import { CreateRepairItemDto } from './create-repair-item.dto';

export class UpdateRepairItemDto extends PartialType(CreateRepairItemDto) {}
