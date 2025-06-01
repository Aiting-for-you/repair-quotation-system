import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SchoolModule } from './school/school.module';
import { RepairItemModule } from './repair-item/repair-item.module';
import { QuotationModule } from './quotation/quotation.module';
import { AuthModule } from './auth/auth.module';
import { StatisticsModule } from './statistics/statistics.module';
import { School } from './school/entities/school.entity';
import { RepairItem } from './repair-item/entities/repair-item.entity';
import { Quotation } from './quotation/entities/quotation.entity';
import { QuotationDetail } from './quotation/entities/quotation-detail.entity';
import { SeedService } from './database/seed.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 3306),
        username: configService.get('DB_USERNAME', 'root'),
        password: configService.get('DB_PASSWORD', ''),
        database: configService.get('DB_DATABASE', 'repair_system'),
        entities: [School, RepairItem, Quotation, QuotationDetail],
        synchronize: true, // 开发环境自动同步数据库结构
        logging: true, // 启用SQL日志
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([School, RepairItem, Quotation, QuotationDetail]),
    SchoolModule,
    RepairItemModule,
    QuotationModule,
    AuthModule,
    StatisticsModule,
  ],
  providers: [SeedService],
})
export class AppModule {}
