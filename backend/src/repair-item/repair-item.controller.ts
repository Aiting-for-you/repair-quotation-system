import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RepairItemService } from './repair-item.service';
import { CreateRepairItemDto } from './dto/create-repair-item.dto';
import { UpdateRepairItemDto } from './dto/update-repair-item.dto';
import { ImportRepairItemsDto } from './dto/import-repair-items.dto';

@Controller('api/repair-items')
export class RepairItemController {
  constructor(private readonly repairItemService: RepairItemService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createRepairItemDto: CreateRepairItemDto) {
    return this.repairItemService.create(createRepairItemDto);
  }

  @Get()
  findAll(
    @Query('schoolId') schoolId?: string,
    @Query('page') page?: string,
    @Query('size') size?: string,
    @Query('itemName') itemName?: string,
    @Query('status') status?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : undefined;
    const pageSize = size ? parseInt(size, 10) : undefined;
    
    return this.repairItemService.findAll({
      schoolId,
      page: pageNum,
      size: pageSize,
      itemName,
      status,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.repairItemService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRepairItemDto: UpdateRepairItemDto) {
    return this.repairItemService.update(id, updateRepairItemDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.repairItemService.remove(id);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importRepairItems(
    @UploadedFile() file: Express.Multer.File,
    @Body() importDto: ImportRepairItemsDto,
  ) {
    if (!file) {
      throw new BadRequestException('请上传CSV文件');
    }

    if (!file.originalname.toLowerCase().endsWith('.csv')) {
      throw new BadRequestException('只支持CSV文件格式');
    }

    const csvData = file.buffer.toString('utf-8');
    return this.repairItemService.importFromCsv(importDto.schoolName, csvData);
  }

  @Get('school/:schoolId')
  findBySchool(@Param('schoolId') schoolId: string) {
    return this.repairItemService.findBySchool(schoolId);
  }
}
