import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { QuotationService } from './quotation.service';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { QueryQuotationDto } from './dto/query-quotation.dto';

@Controller('api/quotations')
export class QuotationController {
  constructor(private readonly quotationService: QuotationService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createQuotationDto: CreateQuotationDto) {
    return this.quotationService.create(createQuotationDto);
  }

  @Get()
  findAll(@Query() queryDto: QueryQuotationDto) {
    return this.quotationService.findAll(queryDto);
  }

  @Get('export')
  async exportToExcel(@Query() queryDto: QueryQuotationDto, @Res() res: Response) {
    const buffer = await this.quotationService.exportToExcel(queryDto);
    
    const filename = `计价单导出_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
      'Content-Length': buffer.length,
    });
    
    res.send(buffer);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quotationService.findOne(id);
  }
}
