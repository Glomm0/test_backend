export class CreateMortgageDto {
    propertyPrice: number;
    propertyTypeId: number; // Поменял на id, так как хранится в отдельной таблице для удобства изменения потом 
    downPaymentAmount: number;
    matCapitalAmount: number;
    matCapitalIncluded: boolean;
    mortgageTermYears: number;
    interestRate: number;
}

export class CreateMortgageResponseDto{
    id: number;
}