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
exports.TokenRepository = void 0;
const tsyringe_1 = require("tsyringe");
const client_1 = require("@prisma/client");
const utilities_1 = require("../utils/utilities");
let TokenRepository = class TokenRepository {
    constructor(prismaClient) {
        this.prismaClient = prismaClient;
    }
    createToken(spaceId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const expireTime = new Date(); // Get current time
            expireTime.setHours(expireTime.getHours() + 1);
            const token = yield this.prismaClient.token.create({
                data: {
                    status: client_1.KeyStatus.ACTIVE,
                    token: (0, utilities_1.generateRandomToken)(64),
                    space_id: spaceId,
                    expire_time: expireTime
                }
            });
            yield this.prismaClient.$disconnect();
            return token;
        });
    }
    findTokenData(token) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const tokenData = yield this.prismaClient.token.findUnique({
                where: {
                    token: token
                }
            });
            yield this.prismaClient.$disconnect();
            return tokenData;
        });
    }
    validateToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prismaClient.$connect();
            const tokenData = yield this.prismaClient.token.findUnique({
                where: {
                    token: token,
                    status: client_1.KeyStatus.ACTIVE,
                    expire_time: {
                        gt: new Date(),
                    },
                }, include: {
                    space: {
                        include: {
                            links: true,
                            documents: true,
                            quests: true
                        }
                    }
                }
            });
            yield this.prismaClient.$disconnect();
            return tokenData !== null && tokenData !== void 0 ? tokenData : false;
        });
    }
};
exports.TokenRepository = TokenRepository;
exports.TokenRepository = TokenRepository = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("PrismaClient")),
    __metadata("design:paramtypes", [client_1.PrismaClient])
], TokenRepository);
