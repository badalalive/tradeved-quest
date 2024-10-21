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
let SpaceService = class SpaceService {
    constructor(spaceRepository) {
        this.spaceRepository = spaceRepository;
        this.createSpace = (spaceDTO) => __awaiter(this, void 0, void 0, function* () {
            // Check if the space with the same email or company name already exists
            let existingSpace = yield this.spaceRepository.findSpaceByEmailOrCompanyName(spaceDTO.email, spaceDTO.company_name);
            if (existingSpace) {
                throw new httpException_1.HttpException(409, 'Space with this email/company already exists.');
            }
            const spaceName = spaceDTO.name;
            if (spaceName) {
                existingSpace = yield this.spaceRepository.findSpaceByName(spaceName);
            }
            if (existingSpace) {
                throw new httpException_1.HttpException(409, 'Space with name already exist');
            }
            // Create a new space using the repository
            try {
                const newSpace = yield this.spaceRepository.create(spaceDTO);
                return {
                    message: 'Space successfully created.',
                    data: newSpace,
                    statusCode: 201,
                };
            }
            catch (error) {
                throw new httpException_1.HttpException(500, 'Error creating the space.');
            }
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
        this.uploadDocuments = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const spaceId = String(req.params.id);
            const space = yield this.spaceRepository.findSpaceById(spaceId);
            if (!space) {
                throw new httpException_1.HttpException(400, 'Space does not exist');
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
        this.sentVerificationEmail = (spaceId) => __awaiter(this, void 0, void 0, function* () {
            const space = yield this.spaceRepository.findSpaceById(spaceId);
            if (!space) {
                throw new httpException_1.HttpException(404, 'Space doe not exist');
            }
            if (space.is_email_verified) {
                throw new httpException_1.HttpException(409, "Email Already Verified");
            }
            const token = (0, utilities_1.generateRandomToken)(24);
            const link = `${process.env.SERVER_URL}verify-email/${token}`;
            const emailContent = (0, mailTemplate_1.verificationMailTemplate)(link);
            // save email verification token
            yield this.spaceRepository.createEmailVerificationToken(spaceId, token);
            yield (0, utilities_1.sendEmail)(space.email, "Space Email Verification", emailContent);
            return {
                statusCode: 200,
                message: "Email Sent",
                data: space
            };
        });
        this.verifyEmail = (token) => __awaiter(this, void 0, void 0, function* () {
            const spaceEmailVerification = yield this.spaceRepository.findSpaceEmailVerificationByToken(token);
            if (!spaceEmailVerification) {
                throw new httpException_1.HttpException(500, 'Invalid Request');
            }
            if (!spaceEmailVerification.space_id) {
                throw new httpException_1.HttpException(500, 'Invalid Space');
            }
            if (spaceEmailVerification.is_expired) {
                throw new httpException_1.HttpException(410, "Token has expired");
            }
            yield this.spaceRepository.expireEmailVerificationTokens(spaceEmailVerification.space_id);
            return {
                statusCode: 200,
                message: "Email Verified Successfully",
                data: spaceEmailVerification
            };
        });
        this.addSpaceLinks = (spaceId, link) => __awaiter(this, void 0, void 0, function* () {
            const spaceLink = yield this.spaceRepository.createSpaceLink(spaceId, link);
            return {
                statusCode: 200,
                message: "Space Link Attached Successfully",
                data: spaceLink
            };
        });
        this.addLogo = (spaceId, req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const space = yield this.spaceRepository.findSpaceById(spaceId);
            if (!space) {
                throw new httpException_1.HttpException(400, 'Space does not exist');
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
            yield this.spaceRepository.createSpaceLogo(spaceId, fileInfo.path);
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
    }
};
exports.SpaceService = SpaceService;
exports.SpaceService = SpaceService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("SpaceRepository")),
    __metadata("design:paramtypes", [spaceRepository_1.SpaceRepository])
], SpaceService);
