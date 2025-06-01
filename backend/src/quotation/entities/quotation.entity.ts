import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { School } from '../../school/entities/school.entity';
import { QuotationDetail } from './quotation-detail.entity';

@Entity('quotations')
export class Quotation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'school_id', comment: '关联学校ID' })
  schoolId: string;

  @Column({ length: 500, comment: '维修地点' })
  repairLocation: string;

  @Column({ length: 100, comment: '维修人员' })
  repairPerson: string;

  @Column({ type: 'datetime', comment: '维修时间' })
  repairTime: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '总价' })
  totalPrice: number;

  @Column({ length: 50, default: 'pending', comment: '状态' })
  status: string;

  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;

  @Column({ length: 100, nullable: true, comment: '提交人' })
  submittedBy: string;

  @ManyToOne(() => School, school => school.quotations)
  @JoinColumn({ name: 'school_id' })
  school: School;

  @OneToMany(() => QuotationDetail, quotationDetail => quotationDetail.quotation, { cascade: true })
  details: QuotationDetail[];
}
