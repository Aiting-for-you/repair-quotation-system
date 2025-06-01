import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { School } from '../../school/entities/school.entity';
import { QuotationDetail } from '../../quotation/entities/quotation-detail.entity';

@Entity('repair_items')
export class RepairItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'school_id', comment: '关联学校ID' })
  schoolId: string;

  @Column({ length: 255, comment: '维修项目名称' })
  itemName: string;

  @Column({ length: 255, comment: '维修位置' })
  location: string;

  @Column({ type: 'text', comment: '问题描述' })
  description: string;

  @Column({ 
    type: 'enum', 
    enum: ['low', 'medium', 'high', 'urgent'], 
    default: 'medium',
    comment: '紧急程度' 
  })
  urgency: string;

  @Column({ 
    type: 'enum', 
    enum: ['pending', 'processing', 'completed', 'cancelled'], 
    default: 'pending',
    comment: '状态' 
  })
  status: string;

  @Column({ length: 50, nullable: true, comment: '单位' })
  unit: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, comment: '单价' })
  price: number;

  @CreateDateColumn({ name: 'reported_at', comment: '上报时间' })
  reportedAt: Date;

  @CreateDateColumn({ name: 'created_at', comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: '更新时间' })
  updatedAt: Date;

  @ManyToOne(() => School, school => school.repairItems)
  @JoinColumn({ name: 'school_id' })
  school: School;

  @OneToMany(() => QuotationDetail, quotationDetail => quotationDetail.repairItem)
  quotationDetails: QuotationDetail[];
}
