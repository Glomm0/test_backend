CREATE TABLE `mortgage_calculation` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` varchar(255),
	`mortgageProfileId` int,
	`monthlyPayment` int DEFAULT 0,
	`totalPayment` int DEFAULT 0,
	`totalOverpaymentAmount` int DEFAULT 0,
	`possibleTaxDeduction` int DEFAULT 0,
	`savingsDueMotherCapital` int DEFAULT 0,
	`recommendedIncome` int DEFAULT 0,
	`paymentSchedule` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `mortgage_calculation_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `mortgage_profile` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` varchar(255),
	`propertyPrice` int DEFAULT 0,
	`propertyTypeId` int NOT NULL,
	`downPaymentAmount` int DEFAULT 0,
	`matCapitalAmount` int DEFAULT 0,
	`matCapitalIncluded` boolean DEFAULT false,
	`mortgageTermYears` int NOT NULL,
	`interestRate` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `mortgage_profile_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `property_type` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255),
	CONSTRAINT `property_type_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Users` (
	`tgId` varchar(255) NOT NULL,
	`username` varchar(255),
	`firstName` varchar(255),
	`lastName` varchar(255),
	`langCode` varchar(10),
	`invitedBy` varchar(255),
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `Users_tgId` PRIMARY KEY(`tgId`)
);
--> statement-breakpoint
ALTER TABLE `mortgage_calculation` ADD CONSTRAINT `mortgage_calculation_userId_Users_tgId_fk` FOREIGN KEY (`userId`) REFERENCES `Users`(`tgId`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `mortgage_calculation` ADD CONSTRAINT `mortgage_calculation_mortgageProfileId_mortgage_profile_id_fk` FOREIGN KEY (`mortgageProfileId`) REFERENCES `mortgage_profile`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `mortgage_profile` ADD CONSTRAINT `mortgage_profile_userId_Users_tgId_fk` FOREIGN KEY (`userId`) REFERENCES `Users`(`tgId`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `mortgage_profile` ADD CONSTRAINT `mortgage_profile_propertyTypeId_property_type_id_fk` FOREIGN KEY (`propertyTypeId`) REFERENCES `property_type`(`id`) ON DELETE no action ON UPDATE no action;