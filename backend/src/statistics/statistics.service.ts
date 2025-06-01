import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quotation } from '../quotation/entities/quotation.entity';
import { School } from '../school/entities/school.entity';
import { RepairItem } from '../repair-item/entities/repair-item.entity';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Quotation)
    private quotationRepository: Repository<Quotation>,
    @InjectRepository(School)
    private schoolRepository: Repository<School>,
    @InjectRepository(RepairItem)
    private repairItemRepository: Repository<RepairItem>,
  ) {}

  async getStatistics() {
    const [totalQuotations, totalSchools, totalRepairItems] = await Promise.all([
      this.quotationRepository.count(),
      this.schoolRepository.count(),
      this.repairItemRepository.count(),
    ]);

    const totalAmount = await this.getTotalAmount();
    const quotationsByStatus = await this.getQuotationsByStatus();
    const newQuotationsThisMonth = await this.getNewQuotationsThisMonth();
    const monthlyData = await this.getMonthlyData();
    const schoolStats = await this.getSchoolStats();
    const topRepairItems = await this.getTopRepairItems();

    return {
      totalQuotations,
      totalSchools,
      totalRepairItems,
      totalAmount,
      quotationsByStatus,
      newQuotationsThisMonth,
      monthlyData,
      schoolStats,
      topRepairItems,
    };
  }

  private async getTotalAmount(): Promise<number> {
    const result = await this.quotationRepository
      .createQueryBuilder('quotation')
      .select('SUM(quotation.totalPrice)', 'total')
      .getRawOne();
    return parseFloat(result.total) || 0;
  }

  private async getQuotationsByStatus() {
    return this.quotationRepository
      .createQueryBuilder('quotation')
      .select('quotation.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('quotation.status')
      .getRawMany();
  }

  private async getNewQuotationsThisMonth(): Promise<number> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    return this.quotationRepository
      .createQueryBuilder('quotation')
      .where('quotation.createdAt >= :startOfMonth', { startOfMonth })
      .getCount();
  }

  private async getMonthlyData() {
    const monthlyQuotations = await this.quotationRepository
      .createQueryBuilder('quotation')
      .select('YEAR(quotation.createdAt)', 'year')
      .addSelect('MONTH(quotation.createdAt)', 'month')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(quotation.totalPrice)', 'amount')
      .groupBy('YEAR(quotation.createdAt), MONTH(quotation.createdAt)')
      .orderBy('year, month')
      .getRawMany();

    return monthlyQuotations.map(item => ({
      year: parseInt(item.year),
      month: parseInt(item.month),
      count: parseInt(item.count),
      amount: parseFloat(item.amount) || 0,
    }));
  }

  private async getSchoolStats() {
    const schoolQuotations = await this.quotationRepository
      .createQueryBuilder('quotation')
      .leftJoin('quotation.school', 'school')
      .select('school.name', 'schoolName')
      .addSelect('COUNT(*)', 'quotationCount')
      .addSelect('SUM(quotation.totalPrice)', 'totalAmount')
      .groupBy('school.id')
      .orderBy('quotationCount', 'DESC')
      .limit(10)
      .getRawMany();

    return schoolQuotations.map(item => ({
      schoolName: item.schoolName,
      quotationCount: parseInt(item.quotationCount),
      totalAmount: parseFloat(item.totalAmount) || 0,
    }));
  }

  private async getTopRepairItems() {
    const topItems = await this.repairItemRepository
      .createQueryBuilder('repairItem')
      .leftJoin('repairItem.quotationDetails', 'detail')
      .select('repairItem.itemName', 'itemName')
      .addSelect('COUNT(detail.id)', 'usageCount')
      .addSelect('SUM(detail.quantity * detail.price)', 'totalAmount')
      .groupBy('repairItem.id')
      .orderBy('usageCount', 'DESC')
      .limit(10)
      .getRawMany();

    return topItems.map(item => ({
      itemName: item.itemName,
      usageCount: parseInt(item.usageCount),
      totalAmount: parseFloat(item.totalAmount) || 0,
    }));
  }
}