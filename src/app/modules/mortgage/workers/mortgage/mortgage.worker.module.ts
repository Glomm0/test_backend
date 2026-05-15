import { Module } from '@nestjs/common';
import { CalculateMortgageWorker } from './calculate-mortgage.worker';
import { MortgagesModule } from '../../mortgages.module';

@Module({
  imports: [MortgagesModule],
  providers: [CalculateMortgageWorker]
})
export class MortgageWorkerModule {}
