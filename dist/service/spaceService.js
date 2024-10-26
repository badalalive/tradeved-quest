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
const mailTemplate_1 = require("../templates/mailTemplate");
const utilities_1 = require("../utils/utilities");
const client_1 = require("@prisma/client");
const tokenRepository_1 = require("../repository/tokenRepository");
let SpaceService = class SpaceService {
    constructor(spaceRepository, tokenRepository) {
        this.spaceRepository = spaceRepository;
        this.tokenRepository = tokenRepository;
        this.createSpace = (tokenData, spaceDTO) => __awaiter(this, void 0, void 0, function* () {
            let space = tokenData.space;
            if (!space) {
                throw new httpException_1.HttpException(400, 'Space does not exist');
            }
            if (space.status !== client_1.SpaceStatus.PENDING) {
                throw new httpException_1.HttpException(400, 'invalid Request');
            }
            // Check if the space with the company name already exists
            // if (spaceDTO.company_name) {
            //     const existingSpace: any = await this.spaceRepository.findSpaceByCompanyName(spaceDTO.company_name);
            //     if (existingSpace && existingSpace.id !== tokenData.space_id) {
            //         throw new HttpException(409, 'Space with this company name already exists.');
            //     }
            // }
            // if (spaceDTO.name) {
            //     const existingSpace: any = await this.spaceRepository.findSpaceByName(spaceDTO.name);
            //     if (existingSpace && existingSpace.id !== tokenData.space_id) {
            //         throw new HttpException(409, 'Space with this space name already exists.');
            //     }
            // }
            const newSpace = yield this.spaceRepository.updateSpaceById(tokenData.space_id, spaceDTO);
            // if link is present then perform the query
            if (spaceDTO.links && spaceDTO.links.length > 0) {
                const spaceLinks = [];
                spaceDTO.links.map((link) => {
                    const spaceLink = {
                        link: link,
                        space_id: tokenData.space_id,
                        created_by: tokenData.space_id,
                        updated_by: tokenData.space_id
                    };
                    spaceLinks.push(spaceLink);
                });
                const result = yield this.spaceRepository.createSpaceLinks(spaceLinks);
            }
            newSpace.category = (0, utilities_1.stringToArray)(newSpace.category);
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
            // string of array category to array of category
            space.category = (0, utilities_1.stringToArray)(space.category);
            return {
                statusCode: 200,
                message: "Space Details Fetch Successfully",
                data: space
            };
        });
        this.getAll = () => __awaiter(this, void 0, void 0, function* () {
            const spaces = yield this.spaceRepository.findAllSpace();
            // string of array category to array of category
            spaces.map((space) => space.category = (0, utilities_1.stringToArray)(space.category));
            return {
                statusCode: 200,
                message: "Fetch All Spaces",
                data: spaces
            };
        });
        this.uploadDocuments = (tokenData, req, res) => __awaiter(this, void 0, void 0, function* () {
            const spaceId = tokenData.space_id;
            let space = tokenData.space;
            if (!space) {
                throw new httpException_1.HttpException(400, 'Space does not exist');
            }
            if (space.status !== client_1.SpaceStatus.PENDING) {
                throw new httpException_1.HttpException(400, 'invalid Request');
            }
            // await new Promise<void>((resolve, reject) => {
            //     uploadDocument.array('files', 10)(req, res, (err: any) => {
            //         if (err) {
            //             return reject(new HttpException(400, err.message));
            //         }
            //         if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
            //             return reject(new HttpException(400, "No file uploaded"));
            //         }
            //         resolve();
            //     });
            // });
            // const filesInfo = (req.files as Express.Multer.File[]).map(file => ({
            //     filename: file.originalname,
            //     path: `${process.env.SERVER_URL}${file.destination}${file.filename}`
            // }));
            // let spaceDocuments: any[] = [];
            // if (filesInfo.length > 0) {
            //     filesInfo.map((f)=> {
            //         const spaceDocument: any = {
            //             space_id: spaceId,
            //             path: f.path,
            //             filename: f.filename,
            //             created_by: spaceId,
            //             updated_by: spaceId,
            //         }
            //         spaceDocuments.push(spaceDocument);
            //     })
            //     await this.spaceRepository.createSpaceDocuments(spaceDocuments)
            // }
            yield this.spaceRepository.createSpaceDocuments([
                {
                    space_id: spaceId,
                    path: "https://your-server.com/uploads/documents/example.pdf",
                    filename: "example.pdf",
                    created_by: spaceId,
                    updated_by: spaceId,
                }
            ]);
            return {
                statusCode: 200,
                message: "File(s) uploaded successfully!",
                data: [
                    {
                        "filename": "example.pdf",
                        "path": "https://your-server.com/uploads/documents/example.pdf"
                    }
                ]
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
            const link = `${process.env.SPACE_FRONTEND_END_POINT}create-space/verify-email/${tokenData.token}`;
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
            if (space.status !== client_1.SpaceStatus.PENDING) {
                throw new httpException_1.HttpException(400, 'invalid Request');
            }
            // string of array category to array of category
            space.category = (0, utilities_1.stringToArray)(space.category);
            return {
                statusCode: 200,
                message: "Email Verified Successfully",
                data: space
            };
        });
        this.addSpaceLinks = (tokenData, link) => __awaiter(this, void 0, void 0, function* () {
            let space = tokenData.space;
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
            let space = tokenData.space;
            if (!space) {
                throw new httpException_1.HttpException(400, 'Space does not exist');
            }
            if (space.status !== client_1.SpaceStatus.PENDING) {
                throw new httpException_1.HttpException(400, 'invalid Request');
            }
            // Use the `uploadImage` middleware for single image upload
            // await new Promise<void>((resolve, reject) => {
            //     uploadImage.single('file')(req, res, (err: any) => {
            //         if (err) {
            //             return reject(new HttpException(400, err.message));
            //         }
            //         if (!req.file) {
            //             return reject(new HttpException(400, "No file uploaded"));
            //         }
            //         resolve();
            //     });
            // });
            // const fileInfo = {
            //     filename: req.file?.originalname,
            //     path: `${process.env.SERVER_URL}${req.file?.destination}${req.file?.filename}`,
            // };
            yield this.spaceRepository.createSpaceLogo(tokenData.space_id, "https://yourserver.com/uploads/images/logo.png");
            return {
                statusCode: 200,
                message: "Logo uploaded successfully!",
                data: {
                    "filename": "logo.png",
                    "path": "https://yourserver.com/uploads/images/logo.png"
                }
            };
        });
        this.addBanner = (tokenData, req, res) => __awaiter(this, void 0, void 0, function* () {
            let space = tokenData.space;
            if (!space) {
                throw new httpException_1.HttpException(400, 'Space does not exist');
            }
            if (space.status !== client_1.SpaceStatus.PENDING) {
                throw new httpException_1.HttpException(400, 'invalid Request');
            }
            // Use the `uploadImage` middleware for single image upload
            // await new Promise<void>((resolve, reject) => {
            //     uploadImage.single('file')(req, res, (err: any) => {
            //         if (err) {
            //             return reject(new HttpException(400, err.message));
            //         }
            //         if (!req.file) {
            //             return reject(new HttpException(400, "No file uploaded"));
            //         }
            //         resolve();
            //     });
            // });
            //
            // const fileInfo = {
            //     filename: req.file?.originalname,
            //     path: `${process.env.SERVER_URL}${req.file?.destination}${req.file?.filename}`,
            // };
            // await this.spaceRepository.createSpaceBanner(tokenData.space_id, fileInfo.path)
            return {
                statusCode: 200,
                message: "Banner uploaded successfully!",
                data: {
                    "filename": "banner.png",
                    "path": "https://yourserver.com/uploads/images/banner.png"
                }
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
            let space = tokenData.space;
            // Check if space is already submitted for review
            if (space.status === client_1.SpaceStatus.REVIEW) {
                throw new httpException_1.HttpException(409, 'Already Submitted');
            }
            // Check if the request is valid based on the current status
            if (space.status !== client_1.SpaceStatus.PENDING) {
                throw new httpException_1.HttpException(400, 'Invalid Request');
            }
            // Validate that all required fields are filled
            const requiredFields = ['company_name', 'name', 'description', 'email', 'logo_url', 'category'];
            for (const field of requiredFields) {
                if (!space[field]) {
                    throw new httpException_1.HttpException(400, `Field ${field} is required and not filled.`);
                }
            }
            // Check that there is at least one SpaceLink
            if (!space.links || space.links.length === 0) {
                throw new httpException_1.HttpException(400, 'At least one space link is required.');
            }
            // Check that there is at least one SpaceDocument
            if (!space.documents || space.documents.length === 0) {
                throw new httpException_1.HttpException(400, 'At least one space document is required.');
            }
            // Update the space status to "REVIEW" if validation passes
            space = yield this.spaceRepository.updateSpaceStatus(space.id, client_1.SpaceStatus.REVIEW, "");
            const emailContent = (0, mailTemplate_1.spaceFormSubmissionMailTemplate)();
            yield (0, utilities_1.sendEmail)(space.email, "Space Form Submission", emailContent);
            // Return the success response
            return {
                data: space,
                statusCode: 200,
                message: "Submit For Review",
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
