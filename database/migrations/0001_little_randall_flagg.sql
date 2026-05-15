ALTER TABLE `mortgage_profile` MODIFY COLUMN `propertyPrice` int NOT NULL;--> statement-breakpoint
ALTER TABLE `mortgage_profile` MODIFY COLUMN `downPaymentAmount` int NOT NULL;--> statement-breakpoint
ALTER TABLE `mortgage_profile` MODIFY COLUMN `matCapitalAmount` int NOT NULL;--> statement-breakpoint
ALTER TABLE `mortgage_profile` MODIFY COLUMN `matCapitalIncluded` boolean NOT NULL;