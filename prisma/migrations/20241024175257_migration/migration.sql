-- CreateTable
CREATE TABLE "ModuleQuest" (
    "id" TEXT NOT NULL,
    "module_id" TEXT NOT NULL,
    "quest_id" TEXT NOT NULL,
    "order" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModuleQuest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Module" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" VARCHAR(1000) NOT NULL,
    "background_color" VARCHAR(7) NOT NULL,
    "image_url" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ModuleQuest_id_key" ON "ModuleQuest"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Module_id_key" ON "Module"("id");

-- AddForeignKey
ALTER TABLE "ModuleQuest" ADD CONSTRAINT "ModuleQuest_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleQuest" ADD CONSTRAINT "ModuleQuest_quest_id_fkey" FOREIGN KEY ("quest_id") REFERENCES "Quest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
