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
exports.SpaceService = void 0;
const tsyringe_1 = require("tsyringe");
const spaceRepository_1 = require("../repository/spaceRepository");
const httpException_1 = require("../exceptions/httpException");
const multerConfig_1 = require("../config/multerConfig");
const mailTemplate_1 = require("../templates/mailTemplate");
const utilities_1 = require("../utils/utilities");
const client_1 = require("@prisma/client");
const tokenRepository_1 = require("../repository/tokenRepository");
let SpaceService = class SpaceService {
    constructor(spaceRepository, tokenRepository) {
        this.spaceRepository = spaceRepository;
        this.tokenRepository = tokenRepository;
        this.createSpace = (tokenData, spaceDTO) => __awaiter(this, void 0, void 0, function* () {
            const space = yield this.spaceRepository.findSpaceById(tokenData.space_id);
            if (!space) {
                throw new httpException_1.HttpException(400, 'Space does not exist');
            }
            if (space.status !== client_1.SpaceStatus.PENDING) {
                throw new httpException_1.HttpException(400, 'invalid Request');
            }
            // Check if the space with the company name already exists
            if (spaceDTO.company_name) {
                const existingSpace = yield this.spaceRepository.findSpaceByCompanyName(spaceDTO.company_name);
                if (existingSpace && existingSpace.id !== tokenData.space_id) {
                    throw new httpException_1.HttpException(409, 'Space with this company name already exists.');
                }
            }
            if (spaceDTO.name) {
                const existingSpace = yield this.spaceRepository.findSpaceByName(spaceDTO.name);
                if (existingSpace && existingSpace.id !== tokenData.space_id) {
                    throw new httpException_1.HttpException(409, 'Space with this space name already exists.');
                }
            }
            const newSpace = yield this.spaceRepository.updateSpaceById(tokenData.space_id, spaceDTO);
            return {
                message: 'Space Details Updated',
                data: newSpace,
                statusCode: 201,
            };
        });
        this.getSpace = (spaceId) => __awaiter(this, void 0, void 0, function* () {
            const space = yield this.spaceRepository.findSpaceById(spaceId);
            if (!space) {
                throw new httpException_1.HttpException(404, "Space does not exist");
            }
            return {
                statusCode: 200,
                message: "Space Details Fetch Successfully",
                data: space
            };
        });
        this.uploadDocuments = (tokenData, req, res) => __awaiter(this, void 0, void 0, function* () {
            const spaceId = String(req.params.id);
            const space = yield this.spaceRepository.findSpaceById(spaceId);
            if (!space) {
                throw new httpException_1.HttpException(400, 'Space does not exist');
            }
            if (space.status !== client_1.SpaceStatus.PENDING) {
                throw new httpException_1.HttpException(400, 'invalid Request');
            }
            yield new Promise((resolve, reject) => {
                multerConfig_1.uploadDocument.array('files', 10)(req, res, (err) => {
                    if (err) {
                        return reject(new httpException_1.HttpException(400, err.message));
                    }
                    if (!req.files || req.files.length === 0) {
                        return reject(new httpException_1.HttpException(400, "No file uploaded"));
                    }
                    resolve();
                });
            });
            const filesInfo = req.files.map(file => ({
                filename: file.originalname,
                path: `${process.env.SERVER_URL}${file.destination}${file.filename}`
            }));
            let spaceDocuments = [];
            if (filesInfo.length > 0) {
                filesInfo.map((f) => {
                    const spaceDocument = {
                        space_id: spaceId,
                        path: f.path,
                        created_by: spaceId,
                        updated_by: spaceId,
                    };
                    spaceDocuments.push(spaceDocument);
                });
                yield this.spaceRepository.createSpaceDocuments(spaceDocuments);
            }
            return {
                statusCode: 200,
                message: "File(s) uploaded successfully!",
                data: filesInfo
            };
        });
        this.sentSpaceCreationLink = (email) => __awaiter(this, void 0, void 0, function* () {
            let space = yield this.spaceRepository.findSpaceByEmail(email);
            // if email is not associate with any space then create new one else create new token that's it
            if (!space) {
                space = yield this.spaceRepository.create(email);
            }
            if (space.status !== client_1.SpaceStatus.PENDING) {
                throw new httpException_1.HttpException(400, 'invalid Request');
            }
            // save email verification token
            const tokenData = yield this.tokenRepository.createToken(space.id);
            const link = `${process.env.SERVER_URL}verify-email/${tokenData.token}`;
            const emailContent = (0, mailTemplate_1.verificationMailTemplate)(link);
            yield (0, utilities_1.sendEmail)(space.email, "Space Creation Link", emailContent);
            return {
                statusCode: 200,
                message: "Link Sent",
                data: space
            };
        });
        this.verifySpaceLink = (tokenData) => __awaiter(this, void 0, void 0, function* () {
            const space = tokenData.space_id ? yield this.spaceRepository.findSpaceById(tokenData.space_id) : {};
            return {
                statusCode: 200,
                message: "Email Verified Successfully",
                data: space
            };
        });
        this.addSpaceLinks = (tokenData, link) => __awaiter(this, void 0, void 0, function* () {
            const space = yield this.spaceRepository.findSpaceById(tokenData.space_id);
            if (!space) {
                throw new httpException_1.HttpException(400, 'Space does not exist');
            }
            if (space.status !== client_1.SpaceStatus.PENDING) {
                throw new httpException_1.HttpException(400, 'invalid Request');
            }
            const spaceLink = yield this.spaceRepository.createSpaceLink(tokenData.space_id, link);
            return {
                statusCode: 200,
                message: "Space Link Attached Successfully",
                data: spaceLink
            };
        });
        this.addLogo = (tokenData, req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const space = yield this.spaceRepository.findSpaceById(tokenData.space_id);
            if (!space) {
                throw new httpException_1.HttpException(400, 'Space does not exist');
            }
            if (space.status !== client_1.SpaceStatus.PENDING) {
                throw new httpException_1.HttpException(400, 'invalid Request');
            }
            // Use the `uploadImage` middleware for single image upload
            yield new Promise((resolve, reject) => {
                multerConfig_1.uploadImage.single('file')(req, res, (err) => {
                    if (err) {
                        return reject(new httpException_1.HttpException(400, err.message));
                    }
                    if (!req.file) {
                        return reject(new httpException_1.HttpException(400, "No file uploaded"));
                    }
                    resolve();
                });
            });
            const fileInfo = {
                filename: (_a = req.file) === null || _a === void 0 ? void 0 : _a.originalname,
                path: `${process.env.SERVER_URL}${(_b = req.file) === null || _b === void 0 ? void 0 : _b.destination}${(_c = req.file) === null || _c === void 0 ? void 0 : _c.filename}`,
            };
            yield this.spaceRepository.createSpaceLogo(tokenData.space_id, fileInfo.path);
            return {
                statusCode: 200,
                message: "Logo uploaded successfully!",
                data: fileInfo
            };
        });
        this.updateStatus = (spaceId, type, reject_reason) => __awaiter(this, void 0, void 0, function* () {
            let space = yield this.spaceRepository.findSpaceById(spaceId);
            if (!space) {
                throw new httpException_1.HttpException(400, 'Space does not exist');
            }
            if (space.status !== 'PENDING') {
                throw new httpException_1.HttpException(400, 'invalid action');
            }
            const status = client_1.SpaceStatus[type];
            space = yield this.spaceRepository.updateSpaceStatus(spaceId, status, reject_reason);
            return {
                statusCode: 200,
                message: `${status} Successfully`,
                data: space
            };
        });
        this.submitForm = (tokenData) => __awaiter(this, void 0, void 0, function* () {
            let space = yield this.spaceRepository.findSpaceById(tokenData.space_id);
            if (!space) {
                throw new httpException_1.HttpException(400, 'Space does not exist');
            }
            if (space.status === client_1.SpaceStatus.REVIEW) {
                throw new httpException_1.HttpException(409, 'Already Submitted');
            }
            if (space.status !== client_1.SpaceStatus.PENDING) {
                throw new httpException_1.HttpException(400, 'Invalid Request');
            }
            space = yield this.spaceRepository.updateSpaceStatus(space.id, client_1.SpaceStatus.REVIEW, "");
            return {
                data: space,
                statusCode: 200,
                message: "Submit For Review"
            };
        });
    }
};
exports.SpaceService = SpaceService;
exports.SpaceService = SpaceService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("SpaceRepository")),
    __param(1, (0, tsyringe_1.inject)("TokenRepository")),
    __metadata("design:paramtypes", [spaceRepository_1.SpaceRepository,
        tokenRepository_1.TokenRepository])
], SpaceService);
