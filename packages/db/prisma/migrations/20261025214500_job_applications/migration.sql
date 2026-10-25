CREATE TABLE `job_applications` (
    `id` VARCHAR(191) NOT NULL,
    `requester_id` VARCHAR(191) NOT NULL,
    `job_key` VARCHAR(191) NOT NULL,
    `job_title` VARCHAR(191) NOT NULL,
    `company` VARCHAR(191) NOT NULL,
    `resume_name` VARCHAR(191) NOT NULL,
    `resume_data` LONGTEXT NOT NULL,
    `applied_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    UNIQUE INDEX `job_applications_requester_id_job_key_key`(`requester_id`, `job_key`),
    INDEX `job_applications_requester_id_idx`(`requester_id`),
    PRIMARY KEY (`id`),
    CONSTRAINT `job_applications_requester_id_fkey` FOREIGN KEY (`requester_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
