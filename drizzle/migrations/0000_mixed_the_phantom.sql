CREATE TABLE `profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`pid` varchar(32) NOT NULL,
	`data` text NOT NULL,
	`profileImage` text,
	`videoUrl` varchar(2048),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `profiles_pid_unique` UNIQUE(`pid`)
);
