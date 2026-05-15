
import { mortgageCalculations, mortgageProfiles } from 'src/app/modules/mortgage/schemas/mortgages';
import { users } from '../app/modules/user/schemas/users';
import { MySql2Database } from 'drizzle-orm/mysql2';

export const databaseSchema = {
    users,
    mortgageProfiles,
    mortgageCalculations
} as const; 

export type Database = MySql2Database<typeof databaseSchema>; 