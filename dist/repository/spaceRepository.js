"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpaceRepository = void 0;
const tsyringe_1 = require("tsyringe");
const client_1 = require("@prisma/client");
const utilities_1 = require("../utils/utilities");
let SpaceRepository = class SpaceRepository {
    constructor(prismaClient) {
        this.prismaClient = prismaClient;
    }
    // Find space by company name
    findSpaceByCompanyName(companyName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const space = yield this.prismaClient.space.findFirst({
                where: { company_name: companyName },
            });
            yield this.prismaClient.$disconnect();
            return space;
        });
    }
    // Create a new space
    create(email) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const newSpace = yield this.prismaClient.space.create({
                data: {
                    email: email,
                    /// @todo update this actual user id which is creating
                    created_by: "",
                    updated_by: "",
                },
            });
            yield this.prismaClient.$disconnect();
            return newSpace;
        });
    }
    // Update space by ID (for later use in the update functionality)
    updateSpaceById(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            console.log(updateData);
            const updateObject = Object.assign(Object.assign(Object.assign(Object.assign({}, (updateData.company_name && { company_name: updateData.company_name })), (updateData.name && { name: updateData.name })), (updateData.category && { category: (0, utilities_1.arrayToString)(updateData.category) })), (updateData.description && { description: updateData.description }));
            const updatedSpace = yield this.prismaClient.space.update({
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
            yield this.prismaClient.$disconnect();
            return updatedSpace;
        });
    }
    updateSpacePartialById(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const updatedSpace = yield this.prismaClient.space.update({
                where: {
                    id: id
                }, data: updateData
            });
            yield this.prismaClient.$disconnect();
            return updatedSpace;
        });
    }
    // Find space by ID (for updating or retrieving details)
    findSpaceById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const space = yield this.prismaClient.space.findUnique({
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
            yield this.prismaClient.$disconnect();
            return space;
        });
    }
    // Find All Spaces
    findAllSpace() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const spaces = yield this.prismaClient.space.findMany({
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
            yield this.prismaClient.$disconnect();
            return spaces;
        });
    }
    // Find space by email
    findSpaceByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const space = yield this.prismaClient.space.findUnique({
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
            yield this.prismaClient.$disconnect();
            return space;
        });
    }
    // find space by user id
    findSpaceByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const space = yield this.prismaClient.space.findUnique({
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
            yield this.prismaClient.$disconnect();
            return space;
        });
    }
    addSpaceUserId(spaceId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const space = yield this.prismaClient.space.update({
                data: {
                    user_id: userId
                }, where: {
                    id: spaceId
                }
            });
            yield this.prismaClient.$disconnect();
            return space;
        });
    }
    findAllSpaceNoUserID() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const spaces = yield this.prismaClient.space.findMany({
                where: {
                    OR: [
                        { user_id: null },
                        { user_id: '' }
                    ]
                }
            });
            yield this.prismaClient.$disconnect();
            return spaces; // Return the found spaces
        });
    }
    findSpaceByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const space = yield this.prismaClient.space.findFirst({
                where: { name: name },
            });
            yield this.prismaClient.$disconnect();
            return space;
        });
    }
    createSpaceDocuments(spaceDocuments) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            yield this.prismaClient.spaceDocuments.createMany({
                data: spaceDocuments,
                skipDuplicates: true
            });
            yield this.prismaClient.$disconnect();
        });
    }
    createSpaceLink(spaceId, link) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const spaceLink = yield this.prismaClient.spaceLinks.create({
                data: {
                    created_by: spaceId,
                    updated_by: spaceId,
                    space_id: spaceId,
                    link: link
                }
            });
            yield this.prismaClient.$disconnect();
            return spaceLink;
        });
    }
    createSpaceLinks(spaceLinks) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            // Extract the links (URLs) from the spaceLinks array
            const linksToInsert = spaceLinks.map(linkObj => linkObj.link);
            // Query existing URLs in the database
            const existingLinks = yield this.prismaClient.spaceLinks.findMany({
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
                const insertedLinks = yield this.prismaClient.spaceLinks.createMany({
                    data: newLinks,
                    skipDuplicates: true
                });
                yield this.prismaClient.$disconnect();
                return newLinks;
            }
            yield this.prismaClient.$disconnect();
            return null; // Return null or a custom message if no new links were inserted
        });
    }
    createSpaceLogo(spaceId, url) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const space = yield this.prismaClient.space.update({
                data: {
                    logo_url: url
                }, where: {
                    id: spaceId
                }
            });
            yield this.prismaClient.$disconnect();
            return space;
        });
    }
    createSpaceBanner(spaceId, url) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const space = yield this.prismaClient.space.update({
                data: {
                    banner: url
                }, where: {
                    id: spaceId
                }
            });
            yield this.prismaClient.$disconnect();
            return space;
        });
    }
    updateSpaceStatus(spaceId, status, reject_reason) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const space = yield this.prismaClient.space.update({
                data: {
                    status: status,
                    reject_reason: reject_reason
                }, where: {
                    id: spaceId
                }
            });
            yield this.prismaClient.$disconnect();
            return space;
        });
    }
};
exports.SpaceRepository = SpaceRepository;
exports.SpaceRepository = SpaceRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("PrismaClient")),
    __metadata("design:paramtypes", [client_1.PrismaClient])
], SpaceRepository);
