import {inject, injectable} from "tsyringe";
import {PrismaClient} from "@prisma/client";
import {CreateSpaceDto} from "../dtos/spaceDTO";

@injectable()
export class SpaceRepository {
    constructor(
        @inject("PrismaClient")
        private prismaClient: PrismaClient,
    ) {
    }

    // Find space by email
    async findSpaceByEmail(email: string) {
        await this.prismaClient.$connect();

        const space = await this.prismaClient.space.findFirst({
            where: { email: email },
        });

        await this.prismaClient.$disconnect();

        return space;
    }

    // Create a new space
    async create(spaceDTO: CreateSpaceDto) {
        await this.prismaClient.$connect();

        const newSpace = await this.prismaClient.space.create({
            data: {
                company_name: spaceDTO.company_name,
                name: spaceDTO.name || "",
                description: spaceDTO.description || "",
                email: spaceDTO.email,
                is_email_verified: spaceDTO.is_email_verified || false,
                banner: spaceDTO.banner || "",
                logo_url: spaceDTO.logo_url || "",
                category: spaceDTO.category || "",
                created_at: new Date(),
                updated_at: new Date(),
                created_by: spaceDTO.created_by || "",
                updated_by: spaceDTO.updated_by || "",
            },
        });

        await this.prismaClient.$disconnect();

        return newSpace;
    }

    // Update space by ID (for later use in the update functionality)
    async updateSpaceById(id: string, updateData: Partial<CreateSpaceDto>) {
        await this.prismaClient.$connect();

        const updatedSpace = await this.prismaClient.space.update({
            where: { id: id },
            data: {
                ...updateData,
                updated_at: new Date(), // Automatically update the updated_at timestamp
            },
        });

        await this.prismaClient.$disconnect();

        return updatedSpace;
    }

    // Find space by ID (for updating or retrieving details)
    async findSpaceById(id: string) {
        await this.prismaClient.$connect();

        const space = await this.prismaClient.space.findUnique({
            where: { id: id },
        });

        await this.prismaClient.$disconnect();

        return space;
    }
}