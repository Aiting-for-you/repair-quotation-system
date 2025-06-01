import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RepairItem } from './entities/repair-item.entity';
import { School } from '../school/entities/school.entity';
import { CreateRepairItemDto } from './dto/create-repair-item.dto';
import { UpdateRepairItemDto } from './dto/update-repair-item.dto';
import { RepairItemImportData } from './dto/import-repair-items.dto';
import * as ExcelJS from 'exceljs';

@Injectable()
export class RepairItemService {
  constructor(
    @InjectRepository(RepairItem)
    private repairItemRepository: Repository<RepairItem>,
    @InjectRepository(School)
    private schoolRepository: Repository<School>,
  ) {}

  async create(createRepairItemDto: CreateRepairItemDto): Promise<RepairItem> {
    // 验证学校是否存在
    const school = await this.schoolRepository.findOne({
      where: { id: createRepairItemDto.schoolId },
    });
    if (!school) {
      throw new NotFoundException(`学校ID ${createRepairItemDto.schoolId} 不存在`);
    }

    const repairItem = this.repairItemRepository.create(createRepairItemDto);
    return await this.repairItemRepository.save(repairItem);
  }

  async findAll(options?: {
    schoolId?: string;
    page?: number;
    size?: number;
    itemName?: string;
    status?: string;
  }): Promise<RepairItem[]> {
    const queryBuilder = this.repairItemRepository
      .createQueryBuilder('repairItem')
      .leftJoinAndSelect('repairItem.school', 'school')
      .orderBy('repairItem.itemName', 'ASC');

    if (options?.schoolId) {
      queryBuilder.andWhere('repairItem.schoolId = :schoolId', {
        schoolId: options.schoolId,
      });
    }

    if (options?.itemName) {
      queryBuilder.andWhere('repairItem.itemName LIKE :itemName', {
        itemName: `%${options.itemName}%`,
      });
    }

    if (options?.status) {
      queryBuilder.andWhere('repairItem.status = :status', {
        status: options.status,
      });
    }

    if (options?.page && options?.size) {
      const skip = (options.page - 1) * options.size;
      queryBuilder.skip(skip).take(options.size);
    }

    return await queryBuilder.getMany();
  }

  async findBySchool(schoolId: string): Promise<RepairItem[]> {
    return await this.repairItemRepository.find({
      where: { schoolId },
      order: { itemName: 'ASC' },
    });
  }

  async findOne(id: string): Promise<RepairItem> {
    const repairItem = await this.repairItemRepository.findOne({
      where: { id },
      relations: ['school'],
    });
    if (!repairItem) {
      throw new NotFoundException(`维修项目ID ${id} 不存在`);
    }
    return repairItem;
  }

  async update(id: string, updateRepairItemDto: UpdateRepairItemDto): Promise<RepairItem> {
    const repairItem = await this.findOne(id);
    
    if (updateRepairItemDto.schoolId) {
      const school = await this.schoolRepository.findOne({
        where: { id: updateRepairItemDto.schoolId },
      });
      if (!school) {
        throw new NotFoundException(`学校ID ${updateRepairItemDto.schoolId} 不存在`);
      }
    }

    Object.assign(repairItem, updateRepairItemDto);
    return await this.repairItemRepository.save(repairItem);
  }

  async remove(id: string): Promise<void> {
    const repairItem = await this.findOne(id);
    await this.repairItemRepository.remove(repairItem);
  }

  async importFromCsv(schoolName: string, csvData: string): Promise<{ success: number; errors: string[] }> {
    const lines = csvData.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      throw new BadRequestException('CSV文件格式错误或为空');
    }

    // 检查或创建学校
    let school = await this.schoolRepository.findOne({ where: { name: schoolName } });
    if (!school) {
      school = this.schoolRepository.create({ name: schoolName });
      school = await this.schoolRepository.save(school);
    }

    const header = lines[0].split(',');
    const expectedHeaders = ['序号', '维修项目名称', '单位', '单价'];
    
    // 验证CSV头部
    if (!expectedHeaders.every(h => header.includes(h))) {
      throw new BadRequestException('CSV文件头部格式错误，应包含：序号,维修项目名称,单位,单价');
    }

    const results = { success: 0, errors: [] };

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(',');
        if (values.length < 4) continue;

        const itemName = values[1]?.trim();
        const unit = values[2]?.trim();
        const price = parseFloat(values[3]?.trim());

        if (!itemName || isNaN(price)) {
          results.errors.push(`第${i + 1}行：项目名称或价格格式错误`);
          continue;
        }

        // 检查是否已存在相同项目
        const existingItem = await this.repairItemRepository.findOne({
          where: { schoolId: school.id, itemName },
        });

        if (existingItem) {
          // 更新现有项目
          existingItem.unit = unit;
          existingItem.price = price;
          await this.repairItemRepository.save(existingItem);
        } else {
          // 创建新项目
          const repairItem = this.repairItemRepository.create({
            schoolId: school.id,
            itemName,
            unit,
            price,
          });
          await this.repairItemRepository.save(repairItem);
        }

        results.success++;
      } catch (error) {
        results.errors.push(`第${i + 1}行：${error.message}`);
      }
    }

    return results;
  }
}
