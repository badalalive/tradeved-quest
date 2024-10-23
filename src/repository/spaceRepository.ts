import {inject, injectable} from "tsyringe";
import {PrismaClient, Space, SpaceDocuments, SpaceLinks, SpaceStatus} from "@prisma/client";
import {CreateSpaceDto} from "../dto/spaceDTO";

@injectable()
export class SpaceRepository {
    constructor(
        @inject("PrismaClient")
        private prismaClient: PrismaClient,
    ) {
    }

    // Find space by email
    async findSpaceByCompanyName(companyName: string): Promise<Space | null> {
        await this.prismaClient.$connect();

        const space = await this.prismaClient.space.findFirst({
            where: { company_name: companyName },
        });

        await this.prismaClient.$disconnect();

        return space;
    }

    // Create a new space
    async create(email: string): Promise<Space | null> {
        await this.prismaClient.$connect();

        const newSpace = await this.prismaClient.space.create({
            data: {
                email: email,
                /// @todo update this actual user id which is creating
                created_by: "",
                updated_by: "",
            },
        });

        await this.prismaClient.$disconnect();

        return newSpace;
    }

    // Update space by ID (for later use in the update functionality)
    async updateSpaceById(id: string, updateData: Partial<CreateSpaceDto>): Promise<Space | null> {
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
    async findSpaceById(id: string): Promise<Space | null> {
        await this.prismaClient.$connect();

        const space = await this.prismaClient.space.findUnique({
            where: { id: id }, include: {
                links: true,
                documents: true,
                quests: true
            },
        });

        await this.prismaClient.$disconnect();

        return space;
    }
    // Find space by Email (for updating or retrieving details)

    async findSpaceByEmail(email: string): Promise<Space | null> {
        await this.prismaClient.$connect();

        const space = await this.prismaClient.space.findUnique({
            where: { email: email }, include: {
                links: true,
                documents: true,
                quests: true
            },
        });

        await this.prismaClient.$disconnect();

        return space;
    }

    async findSpaceByName(name: string): Promise<Space | null> {
        await this.prismaClient.$connect();

        const space = await this.prismaClient.space.findFirst({
            where: { name: name },
        });

        await this.prismaClient.$disconnect();

        return space;
    }

    async createSpaceDocuments(spaceDocuments: any[]): Promise<void>  {
        await this.prismaClient.$connect();
        await this.prismaClient.spaceDocuments.createMany({
            data: spaceDocuments,
            skipDuplicates: true
        })
        await this.prismaClient.$disconnect();
    }

    async createSpaceLink(spaceId: string, link: string): Promise<SpaceLinks | null> {
        await this.prismaClient.$connect();
        const spaceLink = await this.prismaClient.spaceLinks.create({
            data: {
                created_by: spaceId,
                updated_by: spaceId,
                space_id: spaceId,
                link: link
            }
        })
        await this.prismaClient.$disconnect();
        return spaceLink;
    }

    async createSpaceLogo(spaceId: string, url: string): Promise<Space | null> {
        await this.prismaClient.$connect();
        const space = await this.prismaClient.space.update({
            data: {
                logo_url: url
            }, where: {
                id: spaceId
            }
        })
        await this.prismaClient.$disconnect();
        return space;
    }

    async updateSpaceStatus(spaceId: string, status: SpaceStatus, reject_reason: string): Promise<Space | null> {
        await this.prismaClient.$connect();
        const space = await this.prismaClient.space.update({
            data: {
                status: status,
                reject_reason: reject_reason
            }, where: {
                id: spaceId
            }
        })
        await this.prismaClient.$disconnect();
        return space;
    }
}