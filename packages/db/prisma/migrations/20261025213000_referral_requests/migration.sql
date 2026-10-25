CREATE TABLE `referral_requests` (
    `id` VARCHAR(191) NOT NULL,
    `requester_id` VARCHAR(191) NOT NULL,
    `contact_key` VARCHAR(191) NOT NULL,
    `contact_name` VARCHAR(191) NOT NULL,
    `contact_role` VARCHAR(191) NULL,
    `contact_company` VARCHAR(191) NULL,
    `contact_linkedin_url` VARCHAR(191) NULL,
    `target_role` VARCHAR(191) NOT NULL,
    `target_company` VARCHAR(191) NULL,
    `message` TEXT NULL,
    `status` ENUM('PENDING', 'ACCEPTED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    INDEX `referral_requests_requester_id_idx`(`requester_id`),
    INDEX `referral_requests_contact_key_idx`(`contact_key`),
    PRIMARY KEY (`id`),
    CONSTRAINT `referral_requests_requester_id_fkey` FOREIGN KEY (`requester_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
