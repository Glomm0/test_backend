import { Inject, Injectable } from '@nestjs/common';
import { Database } from 'src/database/schema';
import { eq } from 'drizzle-orm';
import { CreateMortgageDto } from './dto/create-mortgage.dto';
import {
  MonthlyMortgagePayment,
  MortgageCalculation,
  mortgageCalculations,
  MortgagePayment,
  MortgageProfile,
  mortgageProfiles,
  YearlyMortgagePayments
} from './schemas/mortgages';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

export const round2 = (n:number): number => Math.round(n * 100) / 100
@Injectable()
export class MortgagesService {
  constructor(
    @Inject('DATABASE') private readonly db: Database,
    @InjectQueue('mortgage-calculation') private readonly mortgagesQueue: Queue
  ) {}

  async createMorgageProfileWithMorgageCalculation(
    dto: CreateMortgageDto
  ): Promise<MortgageProfile|null> {
    try{
    const [{ id }] = await this.db
      .insert(mortgageProfiles)
      .values(dto)
      .$returningId();
    const [newMorgageProfile] = await this.db
      .select()
      .from(mortgageProfiles)
      .where(eq(mortgageProfiles.id, id));
    this.mortgagesQueue.add('calculate-mortgage', {
      mortgageProfileId: id
    });
    return newMorgageProfile;
    }catch(e){
      console.log(e);
      return null;
    }
  }

  async createMorgageCalculation(
    morgageProfileId: number
  ): Promise<MortgageCalculation | null> {
    try {
      const [morgageProfile] = await this.db
        .select()
        .from(mortgageProfiles)
        .where(eq(mortgageProfiles.id, morgageProfileId));

      if (!morgageProfile) {
        return null;
      }

      const totalPayment =
        morgageProfile.propertyPrice -
        morgageProfile.matCapitalAmount -
        morgageProfile.downPaymentAmount;
      const monthAmount = morgageProfile.mortgageTermYears * 12;
      const monthPercent = morgageProfile.interestRate / 100 / 12;
      const monthlyPayment =
        (totalPayment * monthPercent * (1 + monthPercent) ** monthAmount) /
        ((1 + monthPercent) ** monthAmount - 1);
      const totalPayedAmount = monthlyPayment * monthAmount;
      const totalOverpaymentAmount = totalPayedAmount - totalPayment;
      const possibleTaxDeductionFromBuingProperty = Math.min(
        Math.min(2000000 * 0.13, morgageProfile.propertyPrice),
        260000
      );
      const possibleTaxDeductionFromPayingPercents = Math.min(
        Math.min(3000000 * 0.13, totalOverpaymentAmount),
        390000
      );

      let paymentSchedule: YearlyMortgagePayments[] = [];
      let totalDebt = totalPayment;
      let totalPayed = 0;
      for (let y = 0; y < morgageProfile.mortgageTermYears; y++) {
        const yearly: YearlyMortgagePayments = { [y]: [] };

        for (let m = 0; m < 12; m++) {
          const interest = round2(totalDebt * monthPercent);

          let principal = round2(monthlyPayment - interest);
          if (principal > totalDebt) {
            principal = totalDebt;
          }

          const actualPayment = round2(principal + interest);

          totalDebt = round2(totalDebt - principal);
          totalPayed = round2(totalPayed + actualPayment);

          const payment: MortgagePayment = {
            totalPayment: totalPayed,
            repaymentOfMortgageBody: principal,
            repaymentOfMortgageInterest: interest,
            mortgageBalanceAtEndOfMonth: totalDebt
          };

          yearly[y].push({ [m]: payment });

          if (totalDebt <= 0) break;
        }

        paymentSchedule.push(yearly);
      }

      const paymentScheduleJson = JSON.stringify(paymentSchedule);
      const [{ id }] = await this.db
        .insert(mortgageCalculations)
        .values({
          userId: morgageProfile.userId,
          mortgageProfileId: morgageProfileId,
          monthlyPayment: Math.round(monthlyPayment),
          totalPayment: Math.round(totalPayedAmount),
          totalOverpaymentAmount: Math.round(totalOverpaymentAmount),
          possibleTaxDeduction: Math.round(
            possibleTaxDeductionFromBuingProperty +
              possibleTaxDeductionFromPayingPercents
          ),
          savingsDueMotherCapital: Math.round(morgageProfile.matCapitalAmount),
          recommendedIncome: Math.round(monthlyPayment * 12),
          paymentSchedule: paymentScheduleJson
        })
        .$returningId();
      const [newMorgageCalculation] = await this.db
        .select()
        .from(mortgageCalculations)
        .where(eq(mortgageCalculations.id, id));
      return newMorgageCalculation;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getMortgageCalculationForProfile(id: number): Promise<MortgageCalculation | null> {
    try{
    const [morgageCalculation] = await this.db
      .select()
      .from(mortgageCalculations)
      .where(eq(mortgageCalculations.mortgageProfileId, id));
    return morgageCalculation || null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
