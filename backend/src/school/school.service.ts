import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { School } from './entities/school.entity';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { RepairItem } from '../repair-item/entities/repair-item.entity';
import { Quotation } from '../quotation/entities/quotation.entity';

@Injectable()
export class SchoolService {
  constructor(
    @InjectRepository(School)
    private schoolRepository: Repository<School>,
    @InjectRepository(RepairItem)
    private repairItemRepository: Repository<RepairItem>,
    @InjectRepository(Quotation)
    private quotationRepository: Repository<Quotation>,
  ) {}

  async create(createSchoolDto: CreateSchoolDto): Promise<School> {
    const school = this.schoolRepository.create(createSchoolDto);
    return await this.schoolRepository.save(school);
  }

  async findAll(): Promise<School[]> {
    return await this.schoolRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<School> {
    const school = await this.schoolRepository.findOne({ where: { id } });
    if (!school) {
      throw new NotFoundException(`学校ID ${id} 不存在`);
    }
    return school;
  }

  async update(id: string, updateSchoolDto: UpdateSchoolDto): Promise<School> {
    const school = await this.findOne(id);
    Object.assign(school, updateSchoolDto);
    return await this.schoolRepository.save(school);
  }

  async remove(id: string): Promise<void> {
    const school = await this.findOne(id);
    
    // 检查是否有关联的维修项目
    const repairItemCount = await this.repairItemRepository.count({
      where: { schoolId: id }
    });
    
    if (repairItemCount > 0) {
      throw new BadRequestException(`无法删除学校，该学校下还有 ${repairItemCount} 个维修项目`);
    }
    
    // 检查是否有关联的报价单
    const quotationCount = await this.quotationRepository.count({
      where: { schoolId: id }
    });
    
    if (quotationCount > 0) {
      throw new BadRequestException(`无法删除学校，该学校下还有 ${quotationCount} 个报价单`);
    }
    
    await this.schoolRepository.remove(school);
  }
}
