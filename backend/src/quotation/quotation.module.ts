import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuotationService } from './quotation.service';
import { QuotationController } from './quotation.controller';
import { Quotation } from './entities/quotation.entity';
import { QuotationDetail } from './entities/quotation-detail.entity';
import { School } from '../school/entities/school.entity';
import { RepairItem } from '../repair-item/entities/repair-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Quotation, QuotationDetail, School, RepairItem])],
  controllers: [QuotationController],
  providers: [QuotationService],
  exports: [QuotationService],
})
export class QuotationModule {}
