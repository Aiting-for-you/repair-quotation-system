import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { RepairItemService } from './repair-item.service';
import { RepairItemController } from './repair-item.controller';
import { RepairItem } from './entities/repair-item.entity';
import { School } from '../school/entities/school.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RepairItem, School]),
    MulterModule.register({
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  ],
  controllers: [RepairItemController],
  providers: [RepairItemService],
  exports: [RepairItemService],
})
export class RepairItemModule {}
