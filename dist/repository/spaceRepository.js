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
let SpaceRepository = class SpaceRepository {
    constructor(prismaClient) {
        this.prismaClient = prismaClient;
    }
    // Find space by email
    findSpaceByEmailOrCompanyName(email, companyName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const space = yield this.prismaClient.space.findFirst({
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
            yield this.prismaClient.$disconnect();
            return space;
        });
    }
    // Create a new space
    create(spaceDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const newSpace = yield this.prismaClient.space.create({
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
            yield this.prismaClient.$disconnect();
            return newSpace;
        });
    }
    // Update space by ID (for later use in the update functionality)
    updateSpaceById(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const updatedSpace = yield this.prismaClient.space.update({
                where: { id: id },
                data: Object.assign(Object.assign({}, updateData), { updated_at: new Date() }),
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
                    links: true,
                    documents: true,
                    quests: true
                },
            });
            yield this.prismaClient.$disconnect();
            return space;
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
    createEmailVerificationToken(spaceId, token) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const spaceEmailVerification = yield this.prismaClient.spaceEmailVerification.create({
                data: {
                    space_id: spaceId,
                    token: token,
                    created_by: spaceId,
                    updated_by: spaceId
                }
            });
            yield this.prismaClient.$disconnect();
            return spaceEmailVerification;
        });
    }
    findSpaceEmailVerificationByToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const spaceEmailVerification = this.prismaClient.spaceEmailVerification.findUnique({
                where: {
                    token: token
                }, include: {
                    space: true
                }
            });
            yield this.prismaClient.$disconnect();
            return spaceEmailVerification;
        });
    }
    expireEmailVerificationTokens(spaceId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            try {
                const spaceEmailVerification = yield this.prismaClient.spaceEmailVerification.updateMany({
                    where: {
                        space_id: spaceId,
                    },
                    data: {
                        is_expired: true,
                    },
                });
                yield this.prismaClient.$disconnect();
                return spaceEmailVerification;
            }
            catch (error) {
                // Handle case where no record is found
                if (error.code === 'P2025') {
                    // P2025 is the Prisma error code for "Record not found"
                    return null;
                }
                throw error; // Re-throw any other errors
            }
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
