import { Body, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { MortgagesService } from './mortgages.service';
import {
  CreateMortgageDto,
  CreateMortgageResponseDto
} from './dto/create-mortgage.dto';
import { MortgageCalculation } from './schemas/mortgages';
import { ErrorResponseDto } from '../shared/dto/errors.dto';
import { MortgageCalculationResponseDto } from './dto/mortgage-calculation.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('mortgage-profiles')
export class MortgagesController {
  constructor(private readonly service: MortgagesService) {}

  @Get()
  health(): string {
    return 'ok';
  }

  @Post()
  async createMortgageProfile(
    @Body() createMortgageDto: CreateMortgageDto
  ): Promise<CreateMortgageResponseDto|ErrorResponseDto> {
    const newMortgage =
      await this.service.createMorgageProfileWithMorgageCalculation(
        createMortgageDto
      );
    if (!newMortgage) return { statusCode: 500, message: 'Internal server error', error: 'Internal server error' };
    return {
      id: newMortgage.id
    };
  }

  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  async getMortgageCalculationForProfile(
    @Param('id') id: number
  ): Promise<MortgageCalculationResponseDto|ErrorResponseDto> {
    console.log(123)
    const morgageCalculation = await this.service.getMortgageCalculationForProfile(id);
    if (!morgageCalculation) return { statusCode: 500, message: 'Internal server error', error: 'Internal server error' };
    return morgageCalculation;
  }
}
