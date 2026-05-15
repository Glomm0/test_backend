export class MortgageCalculationResponseDto {
    id: number;
    monthlyPayment: number;
    totalPayment: number;
    totalOverpaymentAmount: number;
    possibleTaxDeduction: number;
    savingsDueMotherCapital: number;
    recommendedIncome: number;
    paymentSchedule: string | null;
}