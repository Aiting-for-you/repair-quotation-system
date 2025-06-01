import { IsString } from 'class-validator';

export class ImportRepairItemsDto {
  @IsString()
  schoolName: string;
}

export interface RepairItemImportData {
  序号: number;
  维修项目名称: string;
  单位: string;
  单价: number;
}
