import {inject, injectable} from "tsyringe";
import {PrismaClient, Space, SpaceDocuments, SpaceEmailVerification, SpaceLinks} from "@prisma/client";
import {CreateSpaceDto} from "../dtos/spaceDTO";

@injectable()
export class SpaceRepository {
    constructor(
        @inject("PrismaClient")
        private prismaClient: PrismaClient,
    ) {
    }

    // Find space by email
    async findSpaceByEmailOrCompanyName(email: string, companyName: string): Promise<Space | null> {
        await this.prismaClient.$connect();

        const space = await this.prismaClient.space.findFirst({
            where: {
                OR: [
                    { email: email },
                    { company_name: companyName }
                ],
            }, include: {
                links: true,
                documents: true,
                quests: true
            }
        });

        await this.prismaClient.$disconnect();

        return space;
    }

    // Create a new space
    async create(spaceDTO: CreateSpaceDto): Promise<Space | null> {
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
                /// @todo update this actual user id which is creating
                created_by: spaceDTO.created_by || "",
                updated_by: spaceDTO.updated_by || "",
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

    async findSpaceByName(name: string): Promise<Space | null> {
        await this.prismaClient.$connect();

        const space = await this.prismaClient.space.findFirst({
            where: { name: name },
        });

        await this.prismaClient.$disconnect();

        return space;
    }

    async createEmailVerificationToken(spaceId: string, token: string): Promise<SpaceEmailVerification | null> {
        await this.prismaClient.$connect();
        const spaceEmailVerification = await this.prismaClient.spaceEmailVerification.create({
            data: {
                space_id: spaceId,
                token: token,
                created_by: spaceId,
                updated_by: spaceId
            }
        })
        await this.prismaClient.$disconnect();
        return spaceEmailVerification;
    }

    async findSpaceEmailVerificationByToken(token: string): Promise<SpaceEmailVerification | null> {
        await this.prismaClient.$connect();
        const spaceEmailVerification = this.prismaClient.spaceEmailVerification.findUnique({
            where: {
                token: token
            }, include: {
                space: true
            }
        })
        await this.prismaClient.$disconnect();
        return spaceEmailVerification;
    }

    async expireEmailVerificationTokens(spaceId: string): Promise<any | null> {
        await this.prismaClient.$connect();
        try {
            const spaceEmailVerification = await this.prismaClient.spaceEmailVerification.updateMany({
                where: {
                    space_id: spaceId,
                },
                data: {
                    is_expired: true,
                },
            });
            await this.prismaClient.$disconnect();
            return spaceEmailVerification;
        } catch (error: any) {
            // Handle case where no record is found
            if (error.code === 'P2025') {
                // P2025 is the Prisma error code for "Record not found"
                return null;
            }
            throw error; // Re-throw any other errors
        }
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
}