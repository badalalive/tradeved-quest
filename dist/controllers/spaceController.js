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
exports.SpaceController = void 0;
const tsyringe_1 = require("tsyringe");
const spaceService_1 = require("../service/spaceService");
const spaceDTO_1 = require("../dto/spaceDTO");
const httpException_1 = require("../exceptions/httpException");
const emailDTO_1 = require("../dto/emailDTO");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const utilities_1 = require("../utils/utilities");
let SpaceController = class SpaceController {
    constructor(spaceService) {
        this.spaceService = spaceService;
        this.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                // Transform plain object to class instance
                const spaceDTO = (0, class_transformer_1.plainToInstance)(spaceDTO_1.CreateSpaceDto, req.body);
                // Validate the instance
                const validationErrors = yield (0, class_validator_1.validate)(spaceDTO);
                if (validationErrors.length > 0) {
                    // Extract error messages for all fields
                    const errorMessages = (0, utilities_1.extractErrorMessages)(validationErrors);
                    return next(new httpException_1.HttpException(400, errorMessages));
                }
                // Call the service to create the space
                const { data, message, statusCode } = yield this.spaceService.createSpace(req.tokenData, spaceDTO);
                // Send the response
                res.status(statusCode).send({ data, message });
            }
            catch (error) {
                next(error);
            }
        });
        this.getSpace = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const spaceId = req.params.id;
                if (!spaceId) {
                    next(new httpException_1.HttpException(400, "invalid spaceID"));
                }
                const { data, message, statusCode } = yield this.spaceService.getSpace(spaceId);
                res.status(statusCode).send({ data, message });
            }
            catch (error) {
                next(error);
            }
        });
        this.getAll = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { data, message, statusCode } = yield this.spaceService.getAll();
                res.status(statusCode).send({ data, message });
            }
            catch (error) {
                next(error);
            }
        });
        this.uploadDocuments = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { data, message, statusCode } = yield this.spaceService.uploadDocuments(req.tokenData, req, res);
                res.status(statusCode).send({ data, message });
            }
            catch (error) {
                next(error);
            }
        });
        this.sentSpaceCreationLink = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                // Transform plain object to class instance
                const emailDTO = (0, class_transformer_1.plainToInstance)(emailDTO_1.EmailDto, req.body);
                // Validate the instance
                const validationErrors = yield (0, class_validator_1.validate)(emailDTO);
                if (validationErrors.length > 0) {
                    // Extract error messages for all fields
                    const errorMessages = (0, utilities_1.extractErrorMessages)(validationErrors);
                    return next(new httpException_1.HttpException(400, errorMessages));
                }
                const { data, message, statusCode } = yield this.spaceService.sentSpaceCreationLink(emailDTO.email);
                res.status(statusCode).send({ data, message });
            }
            catch (error) {
                next(error);
            }
        });
        this.verifySpaceLink = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { data, message, statusCode } = yield this.spaceService.verifySpaceLink(req.tokenData);
                res.status(statusCode).send({ data, message });
            }
            catch (error) {
                next(error);
            }
        });
        this.addSpaceLinks = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { link } = req.body;
                if (!link) {
                    next(new httpException_1.HttpException(400, "invalid link"));
                }
                const { data, message, statusCode } = yield this.spaceService.addSpaceLinks(req.tokenData, link);
                res.status(statusCode).send({ data, message });
            }
            catch (error) {
                next(error);
            }
        });
        this.addLogo = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { data, message, statusCode } = yield this.spaceService.addLogo(req.tokenData, req, res);
                res.status(statusCode).send({ data, message });
            }
            catch (error) {
                next(error);
            }
        });
        this.addBanner = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { data, message, statusCode } = yield this.spaceService.addBanner(req.tokenData, req, res);
                res.status(statusCode).send({ data, message });
            }
            catch (error) {
                next(error);
            }
        });
        this.updateStatus = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const spaceId = req.params.id;
                const type = req.params.type;
                let reject_reason = req.body.reject_reason;
                if (!spaceId) {
                    next(new httpException_1.HttpException(400, "invalid space id"));
                }
                if (!(type === 'APPROVED' || type === 'REJECTED')) {
                    next(new httpException_1.HttpException(400, "invalid status type"));
                }
                if (type === 'APPROVED') {
                    reject_reason = "";
                }
                const { data, message, statusCode } = yield this.spaceService.updateStatus(spaceId, type, reject_reason);
                res.status(statusCode).send({ data, message });
            }
            catch (error) {
                next(error);
            }
        });
        this.submitSpaceForm = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { data, message, statusCode } = yield this.spaceService.submitForm(req.tokenData);
                res.status(statusCode).send({ data, message });
            }
            catch (error) {
                next(error);
            }
        });
    }
};
exports.SpaceController = SpaceController;
exports.SpaceController = SpaceController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("SpaceService")),
    __metadata("design:paramtypes", [spaceService_1.SpaceService])
], SpaceController);
