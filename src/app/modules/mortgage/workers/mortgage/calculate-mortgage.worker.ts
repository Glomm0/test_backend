import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { Job } from 'bullmq';
import { MortgagesService } from '../../mortgages.service';
import { Logger } from '@nestjs/common';
@Processor('mortgage-calculation')
export class CalculateMortgageWorker extends WorkerHost {
  private readonly logger = new Logger(CalculateMortgageWorker.name);
  constructor(private readonly mortgageService: MortgagesService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(
      `Processing job ${job.id} with data ${JSON.stringify(job.data)}`
    );
    await this.mortgageService.createMorgageCalculation(
      job.data.mortgageProfileId
    );
    this.logger.log(`Job ${job.id} processed`);
  }
}
