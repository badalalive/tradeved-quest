import {inject, injectable} from "tsyringe";
import {PrismaClient, Space, SpaceDocuments, SpaceLinks, SpaceStatus} from "@prisma/client";
import {CreateSpaceDto} from "../dto/spaceDTO";
import {arrayToString} from "../utils/utilities";

@injectable()
export class SpaceRepository {
    constructor(
        @inject("PrismaClient")
        private prismaClient: PrismaClient,
    ) {
    }

    // Find space by company name
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
        console.log(updateData);
        const updateObject: any = {
            ...(updateData.company_name && { company_name: updateData.company_name }),
            ...(updateData.name && { name: updateData.name }),
            ...(updateData.category && { category: arrayToString(updateData.category) }),
            ...(updateData.description && { description: updateData.description }),
        };
        const updatedSpace = await this.prismaClient.space.update({
            where: { id: id },
            data: updateObject,
            include: {
                links: {
                            select: {
                                link: true
                            }
                        },
                documents: {
                            select: {
                                path: true,
                                filename: true
                            }
                        },
                quests: true
            }
        });

        await this.prismaClient.$disconnect();

        return updatedSpace;
    }

    // Find space by ID (for updating or retrieving details)
    async findSpaceById(id: string): Promise<Space | null> {
        await this.prismaClient.$connect();

        const space = await this.prismaClient.space.findUnique({
            where: { id: id }, include: {
                links: {
                            select: {
                                link: true
                            }
                        },
                documents: {
                            select: {
                                path: true,
                                filename: true
                            }
                        },
                quests: true
            },
        });

        await this.prismaClient.$disconnect();

        return space;
    }

    // Find All Spaces
    async findAllSpace(): Promise<Space[]> {
        await this.prismaClient.$connect();
        const spaces = await this.prismaClient.space.findMany({
            include: {
                links: {
                            select: {
                                link: true
                            }
                        },
                documents: {
                            select: {
                                path: true,
                                filename: true
                            }
                        },
                quests: true,
            }
        });
        await this.prismaClient.$disconnect();
        return spaces;
    }

    // Find space by email
    async findSpaceByEmail(email: string): Promise<Space | null> {
        await this.prismaClient.$connect();

        const space = await this.prismaClient.space.findUnique({
            where: { email: email }, include: {
                links: {
                            select: {
                                link: true
                            }
                        },
                documents: {
                            select: {
                                path: true,
                                filename: true
                            }
                        },
                quests: true
            },
        });

        await this.prismaClient.$disconnect();

        return space;
    }

    // find space by user id
    async findSpaceByUserId(userId: string): Promise<Space | null> {
        await this.prismaClient.$connect();
        const space = await this.prismaClient.space.findUnique({
            where: { user_id: userId }, include: {
                links: {
                    select: {
                        link: true
                    }
                    },
                documents: {
                            select: {
                                path: true,
                                filename: true
                            }
                        },
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

    async createSpaceLinks(spaceLinks: any[]): Promise<any | null> {
        await this.prismaClient.$connect();

        // Extract the links (URLs) from the spaceLinks array
        const linksToInsert = spaceLinks.map(linkObj => linkObj.link);

        // Query existing URLs in the database
        const existingLinks = await this.prismaClient.spaceLinks.findMany({
            where: {
                link: {
                    in: linksToInsert
                },
                space_id: spaceLinks[0].space_id
            },
            select: {
                link: true
            }
        });

        // Extract existing URLs from the result
        const existingUrls = existingLinks.map(link => link.link);

        // Filter out objects whose links already exist in the database
        const newLinks = spaceLinks.filter(linkObj => !existingUrls.includes(linkObj.link));

        // Only insert new links that are not duplicates
        if (newLinks.length > 0) {
            const insertedLinks = await this.prismaClient.spaceLinks.createMany({
                data: newLinks,
                skipDuplicates: true
            });

            await this.prismaClient.$disconnect();
            return newLinks;
        }

        await this.prismaClient.$disconnect();
        return null;  // Return null or a custom message if no new links were inserted
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

    async createSpaceBanner(spaceId: string, url: string): Promise<Space | null> {
        await this.prismaClient.$connect();
        const space = await this.prismaClient.space.update({
            data: {
                banner: url
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