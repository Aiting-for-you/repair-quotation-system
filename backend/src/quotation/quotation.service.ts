import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Quotation } from './entities/quotation.entity';
import { QuotationDetail } from './entities/quotation-detail.entity';
import { School } from '../school/entities/school.entity';
import { RepairItem } from '../repair-item/entities/repair-item.entity';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { QueryQuotationDto } from './dto/query-quotation.dto';
import * as ExcelJS from 'exceljs';

@Injectable()
export class QuotationService {
  constructor(
    @InjectRepository(Quotation)
    private quotationRepository: Repository<Quotation>,
    @InjectRepository(QuotationDetail)
    private quotationDetailRepository: Repository<QuotationDetail>,
    @InjectRepository(School)
    private schoolRepository: Repository<School>,
    @InjectRepository(RepairItem)
    private repairItemRepository: Repository<RepairItem>,
  ) {}

  async create(createQuotationDto: CreateQuotationDto): Promise<Quotation> {
    // 验证学校是否存在
    const school = await this.schoolRepository.findOne({
      where: { id: createQuotationDto.schoolId },
    });
    if (!school) {
      throw new NotFoundException(`学校ID ${createQuotationDto.schoolId} 不存在`);
    }

    // 验证维修项目并计算总价
    let totalPrice = 0;
    const validatedDetails = [];

    for (const detail of createQuotationDto.details) {
      const repairItem = await this.repairItemRepository.findOne({
        where: { id: detail.repairItemId },
      });
      if (!repairItem) {
        throw new NotFoundException(`维修项目ID ${detail.repairItemId} 不存在`);
      }

      const subtotal = detail.price * detail.quantity;
      totalPrice += subtotal;

      validatedDetails.push({
        ...detail,
        subtotal,
      });
    }

    // 创建计价单
    const quotation = this.quotationRepository.create({
      schoolId: createQuotationDto.schoolId,
      repairLocation: createQuotationDto.repairLocation,
      repairPerson: createQuotationDto.repairPerson,
      repairTime: new Date(createQuotationDto.repairTime),
      totalPrice,
      submittedBy: createQuotationDto.submittedBy,
      status: 'pending',
    });

    const savedQuotation = await this.quotationRepository.save(quotation);

    // 创建计价单明细
    const details = validatedDetails.map(detail => 
      this.quotationDetailRepository.create({
        quotationId: savedQuotation.id,
        repairItemId: detail.repairItemId,
        itemName: detail.itemName,
        unit: detail.unit,
        price: detail.price,
        quantity: detail.quantity,
        subtotal: detail.subtotal,
      })
    );

    await this.quotationDetailRepository.save(details);

    return await this.findOne(savedQuotation.id);
  }

  async findAll(queryDto: QueryQuotationDto): Promise<{ data: Quotation[], total: number, page: number, limit: number }> {
    const query = this.quotationRepository.createQueryBuilder('quotation')
      .leftJoinAndSelect('quotation.school', 'school')
      .leftJoinAndSelect('quotation.details', 'details')
      .orderBy('quotation.createdAt', 'DESC');

    if (queryDto.schoolId) {
      query.andWhere('quotation.schoolId = :schoolId', { schoolId: queryDto.schoolId });
    }

    if (queryDto.status) {
      query.andWhere('quotation.status = :status', { status: queryDto.status });
    }

    if (queryDto.startDate && queryDto.endDate) {
      query.andWhere('quotation.createdAt BETWEEN :startDate AND :endDate', {
        startDate: new Date(queryDto.startDate),
        endDate: new Date(queryDto.endDate + ' 23:59:59'),
      });
    } else if (queryDto.startDate) {
      query.andWhere('quotation.createdAt >= :startDate', {
        startDate: new Date(queryDto.startDate),
      });
    } else if (queryDto.endDate) {
      query.andWhere('quotation.createdAt <= :endDate', {
        endDate: new Date(queryDto.endDate + ' 23:59:59'),
      });
    }

    // 添加分页逻辑
    const page = parseInt(queryDto.page) || 1;
    const limit = parseInt(queryDto.limit) || 10;
    const skip = (page - 1) * limit;

    query.skip(skip).take(limit);

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      total,
      page,
      limit
    };
  }

  async findOne(id: string): Promise<Quotation> {
    const quotation = await this.quotationRepository.findOne({
      where: { id },
      relations: ['school', 'details', 'details.repairItem'],
    });
    if (!quotation) {
      throw new NotFoundException(`计价单ID ${id} 不存在`);
    }
    return quotation;
  }

  async exportToExcel(queryDto: QueryQuotationDto): Promise<Buffer> {
    const result = await this.findAll(queryDto);
    const quotations = result.data;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('计价单列表');

    // 设置表头
    worksheet.columns = [
      { header: '计价单编号', key: 'id', width: 40 },
      { header: '学校/区域', key: 'schoolName', width: 20 },
      { header: '维修地点', key: 'repairLocation', width: 30 },
      { header: '维修人员', key: 'repairPerson', width: 15 },
      { header: '维修时间', key: 'repairTime', width: 20 },
      { header: '总价', key: 'totalPrice', width: 15 },
      { header: '状态', key: 'status', width: 10 },
      { header: '提交时间', key: 'createdAt', width: 20 },
      { header: '提交人', key: 'submittedBy', width: 15 },
      { header: '维修项目明细', key: 'details', width: 50 },
    ];

    // 添加数据
    quotations.forEach(quotation => {
      const detailsText = quotation.details
        .map(detail => `${detail.itemName}(${detail.quantity}${detail.unit || '个'} × ${detail.price}元 = ${detail.subtotal}元)`)
        .join('; ');

      worksheet.addRow({
        id: quotation.id,
        schoolName: quotation.school.name,
        repairLocation: quotation.repairLocation,
        repairPerson: quotation.repairPerson,
        repairTime: quotation.repairTime.toLocaleString('zh-CN'),
        totalPrice: quotation.totalPrice,
        status: quotation.status === 'pending' ? '待处理' : quotation.status,
        createdAt: quotation.createdAt.toLocaleString('zh-CN'),
        submittedBy: quotation.submittedBy || '',
        details: detailsText,
      });
    });

    // 设置表头样式
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' },
    };

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}
