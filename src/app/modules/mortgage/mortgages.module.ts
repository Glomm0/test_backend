import { Module } from '@nestjs/common';
import { MortgagesController } from './mortgages.controller';
import { MortgagesService } from './mortgages.service';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [BullModule.registerQueue({ name: 'mortgage-calculation' })],
  controllers: [MortgagesController],
  providers: [MortgagesService],
  exports: [MortgagesService]
})
export class MortgagesModule {}
