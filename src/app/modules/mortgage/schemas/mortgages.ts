import { mysqlTable, varchar, boolean, timestamp } from 'drizzle-orm/mysql-core';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { int } from 'drizzle-orm/mysql-core';
import { users } from '../../user/schemas/users';
import { json } from 'drizzle-orm/mysql-core';

export const propertyType = mysqlTable('property_type',{
    id: int().autoincrement().primaryKey(),
    name: varchar({length: 255})
})
export interface YearlyMortgagePayments {
    [year: string]: MonthlyMortgagePayment[];
}

export interface MonthlyMortgagePayment {
    [month: string]: MortgagePayment;
}

export interface MortgagePayment {
    totalPayment: number;
    repaymentOfMortgageBody: number;
    repaymentOfMortgageInterest: number;
    mortgageBalanceAtEndOfMonth: number;
}
export const mortgageProfiles= mysqlTable('mortgage_profile', {
  id: int().autoincrement().primaryKey(),
  userId:varchar({length: 255}).references(()=>users.tgId), // В данный момент будет null, так как нет авторизации для получения id пользователя
  propertyPrice: int().default(0).notNull(),
  propertyTypeId: int().references(()=>propertyType.id).notNull(),
  downPaymentAmount: int().default(0).notNull(),
  matCapitalAmount: int().default(0).notNull(),
  matCapitalIncluded: boolean().default(false).notNull(),
  mortgageTermYears: int().default(0).notNull(),
  interestRate: int().notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull(),
}); 

export const mortgageCalculations = mysqlTable('mortgage_calculation', {
  id: int().autoincrement().primaryKey(),
  userId:varchar({length: 255}).references(()=>users.tgId), // В данный момент будет null, так как нет авторизации для получения id пользователя
  mortgageProfileId: int().references(()=>mortgageProfiles.id),
  monthlyPayment: int().default(0).notNull(),
  totalPayment: int().default(0).notNull(),
  totalOverpaymentAmount: int().default(0).notNull(),
  possibleTaxDeduction: int().default(0).notNull(),
  savingsDueMotherCapital: int().default(0).notNull(),
  recommendedIncome: int().default(0).notNull(),
  paymentSchedule: json().$type<string>(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow().notNull(),
}); 

export type PropertyType = InferSelectModel<typeof propertyType>

export type MortgageProfile = InferSelectModel<typeof mortgageProfiles>
export type NewMortgageProfile = InferInsertModel<typeof mortgageProfiles>

export type MortgageCalculation = InferSelectModel<typeof mortgageCalculations>
export type NewMortgageCalculation = InferInsertModel<typeof mortgageCalculations>