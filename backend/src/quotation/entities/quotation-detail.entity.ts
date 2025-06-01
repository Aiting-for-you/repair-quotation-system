import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Quotation } from './quotation.entity';
import { RepairItem } from '../../repair-item/entities/repair-item.entity';

@Entity('quotation_details')
export class QuotationDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'quotation_id', comment: '关联计价单ID' })
  quotationId: string;

  @Column({ name: 'repair_item_id', comment: '关联维修项目ID' })
  repairItemId: string;

  @Column({ length: 255, comment: '维修项目名称(冗余)' })
  itemName: string;

  @Column({ length: 50, nullable: true, comment: '单位(冗余)' })
  unit: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '单价(冗余)' })
  price: number;

  @Column({ type: 'int', comment: '数量' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '小计' })
  subtotal: number;

  @ManyToOne(() => Quotation, quotation => quotation.details)
  @JoinColumn({ name: 'quotation_id' })
  quotation: Quotation;

  @ManyToOne(() => RepairItem, repairItem => repairItem.quotationDetails)
  @JoinColumn({ name: 'repair_item_id' })
  repairItem: RepairItem;
}
