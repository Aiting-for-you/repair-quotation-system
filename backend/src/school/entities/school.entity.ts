import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RepairItem } from '../../repair-item/entities/repair-item.entity';
import { Quotation } from '../../quotation/entities/quotation.entity';

@Entity('schools')
export class School {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255, comment: '学校/区域名称' })
  name: string;

  @Column({ length: 500, nullable: true, comment: '地址' })
  address: string;

  @Column({ length: 100, nullable: true, comment: '联系人' })
  contactPerson: string;

  @Column({ length: 20, nullable: true, comment: '联系电话' })
  contactPhone: string;

  @OneToMany(() => RepairItem, repairItem => repairItem.school)
  repairItems: RepairItem[];

  @OneToMany(() => Quotation, quotation => quotation.school)
  quotations: Quotation[];
}
