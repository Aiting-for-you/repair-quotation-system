import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchoolService } from './school.service';
import { SchoolController } from './school.controller';
import { School } from './entities/school.entity';
import { RepairItem } from '../repair-item/entities/repair-item.entity';
import { Quotation } from '../quotation/entities/quotation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([School, RepairItem, Quotation])],
  controllers: [SchoolController],
  providers: [SchoolService],
  exports: [SchoolService],
})
export class SchoolModule {}
