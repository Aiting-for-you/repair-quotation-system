import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { School } from '../school/entities/school.entity';
import { RepairItem } from '../repair-item/entities/repair-item.entity';
import { Quotation } from '../quotation/entities/quotation.entity';
import { QuotationDetail } from '../quotation/entities/quotation-detail.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(School)
    private schoolRepository: Repository<School>,
    @InjectRepository(RepairItem)
    private repairItemRepository: Repository<RepairItem>,
    @InjectRepository(Quotation)
    private quotationRepository: Repository<Quotation>,
    @InjectRepository(QuotationDetail)
    private quotationDetailRepository: Repository<QuotationDetail>,
  ) {}

  async onModuleInit() {
    await this.seedData();
  }

  private async seedData() {
    // 检查是否已有数据
    const schoolCount = await this.schoolRepository.count();
    if (schoolCount > 0) {
      console.log('数据库已有数据，跳过初始化');
      return;
    }

    console.log('开始初始化数据库数据...');

    // 创建学校数据
    const schools = [
      {
        name: '北京市第一中学',
        address: '北京市朝阳区建国路1号',
        contactPerson: '张老师',
        contactPhone: '010-12345678'
      },
      {
        name: '上海市实验小学',
        address: '上海市浦东新区世纪大道100号',
        contactPerson: '李老师',
        contactPhone: '021-87654321'
      },
      {
        name: '广州市第二中学',
        address: '广州市天河区珠江新城',
        contactPerson: '王老师',
        contactPhone: '020-11111111'
      }
    ];

    const savedSchools = await this.schoolRepository.save(schools);
    console.log(`创建了 ${savedSchools.length} 所学校`);

    // 创建维修项目数据
    const repairItems = [];
    for (const school of savedSchools) {
      repairItems.push(
        {
          schoolId: school.id,
          itemName: '教室门窗维修',
          unit: '扇',
          price: 150.00,
          description: '更换破损的门窗玻璃和五金件'
        },
        {
          schoolId: school.id,
          itemName: '课桌椅维修',
          unit: '套',
          price: 80.00,
          description: '修复松动的课桌椅，更换损坏部件'
        },
        {
          schoolId: school.id,
          itemName: '黑板更换',
          unit: '块',
          price: 300.00,
          description: '更换老旧黑板为新型绿板'
        },
        {
          schoolId: school.id,
          itemName: '电路维修',
          unit: '处',
          price: 200.00,
          description: '修复教室内电路故障，更换开关插座'
        }
      );
    }

    const savedRepairItems = await this.repairItemRepository.save(repairItems);
    console.log(`创建了 ${savedRepairItems.length} 个维修项目`);

    // 创建报价单数据
    const quotations = [];
    for (let i = 0; i < savedSchools.length; i++) {
      const school = savedSchools[i];
      quotations.push(
        {
          schoolId: school.id,
          repairLocation: `${school.name}教学楼`,
          repairPerson: '维修队伍A组',
          repairTime: new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000), // 未来几周
          totalPrice: 0, // 稍后计算
          status: 'pending',
          submittedBy: '系统管理员'
        }
      );
    }

    const savedQuotations = await this.quotationRepository.save(quotations);
    console.log(`创建了 ${savedQuotations.length} 个报价单`);

    // 创建报价单详情数据
    const quotationDetails = [];
    for (let i = 0; i < savedQuotations.length; i++) {
      const quotation = savedQuotations[i];
      const schoolRepairItems = savedRepairItems.filter(item => item.schoolId === quotation.schoolId);
      
      let totalPrice = 0;
      for (const repairItem of schoolRepairItems.slice(0, 2)) { // 每个报价单选择前2个项目
        const quantity = Math.floor(Math.random() * 10) + 1; // 随机数量1-10
        const subtotal = repairItem.price * quantity;
        totalPrice += subtotal;
        
        quotationDetails.push({
          quotationId: quotation.id,
          repairItemId: repairItem.id,
          itemName: repairItem.itemName,
          unit: repairItem.unit,
          price: repairItem.price,
          quantity,
          subtotal
        });
      }
      
      // 更新报价单总金额
      await this.quotationRepository.update(quotation.id, { totalPrice });
    }

    await this.quotationDetailRepository.save(quotationDetails);
    console.log(`创建了 ${quotationDetails.length} 个报价单详情`);

    console.log('数据库初始化完成！');
  }
}