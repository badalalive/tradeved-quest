-- CreateTable
CREATE TABLE `Space` (
    `id` VARCHAR(191) NOT NULL,
    `company_name` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `is_email_verified` BOOLEAN NOT NULL DEFAULT false,
    `banner` VARCHAR(255) NULL,
    `logo_url` VARCHAR(255) NULL,
    `category` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `created_by` VARCHAR(191) NOT NULL,
    `updated_by` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Space_id_key`(`id`),
    UNIQUE INDEX `Space_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SpaceEmailVerification` (
    `id` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `is_expired` BOOLEAN NOT NULL DEFAULT false,
    `space_id` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `created_by` VARCHAR(191) NOT NULL,
    `updated_by` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SpaceEmailVerification_id_key`(`id`),
    UNIQUE INDEX `SpaceEmailVerification_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SpaceLinks` (
    `id` VARCHAR(191) NOT NULL,
    `link` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `created_by` VARCHAR(191) NOT NULL,
    `updated_by` VARCHAR(191) NOT NULL,
    `space_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SpaceLinks_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SpaceDocuments` (
    `id` VARCHAR(191) NOT NULL,
    `space_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `created_by` VARCHAR(191) NOT NULL,
    `updated_by` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SpaceDocuments_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Quest` (
    `id` VARCHAR(191) NOT NULL,
    `space_id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `participant_limit` INTEGER NOT NULL,
    `max_reward_point` INTEGER NOT NULL,
    `end_date` DATETIME(3) NOT NULL,
    `reattempt` INTEGER NOT NULL,
    `status` ENUM('DRAFTED', 'INITIATED', 'SCHEDULED', 'PAUSED', 'RUNNING', 'ENDED') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `template_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Quest_id_key`(`id`),
    UNIQUE INDEX `Quest_template_id_key`(`template_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QuestTemplate` (
    `id` VARCHAR(191) NOT NULL,
    `template_name` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `category` ENUM('GENERAL', 'TIMED', 'MINI_GAMES', 'VOTE') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `QuestTemplate_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SpaceEmailVerification` ADD CONSTRAINT `SpaceEmailVerification_space_id_fkey` FOREIGN KEY (`space_id`) REFERENCES `Space`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SpaceLinks` ADD CONSTRAINT `SpaceLinks_space_id_fkey` FOREIGN KEY (`space_id`) REFERENCES `Space`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SpaceDocuments` ADD CONSTRAINT `SpaceDocuments_space_id_fkey` FOREIGN KEY (`space_id`) REFERENCES `Space`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Quest` ADD CONSTRAINT `Quest_space_id_fkey` FOREIGN KEY (`space_id`) REFERENCES `Space`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Quest` ADD CONSTRAINT `Quest_template_id_fkey` FOREIGN KEY (`template_id`) REFERENCES `QuestTemplate`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
