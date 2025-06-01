import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { Quotation } from '../quotation/entities/quotation.entity';
import { School } from '../school/entities/school.entity';
import { RepairItem } from '../repair-item/entities/repair-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Quotation, School, RepairItem])],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}