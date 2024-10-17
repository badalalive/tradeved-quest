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
const httpException_1 = require("../exceptions/httpException");
let SpaceController = class SpaceController {
    constructor(spaceService) {
        this.spaceService = spaceService;
        this.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const spaceDto = req.body;
                const { data, message, statusCode } = yield this.spaceService.createSpace(spaceDto);
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
                    throw new httpException_1.HttpException(400, "invalid spaceID");
                }
                const { data, message, statusCode } = yield this.spaceService.getSpace(spaceId);
                res.status(statusCode).send({ data, message });
            }
            catch (error) {
                next(error);
            }
        });
        this.uploadDocuments = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { data, message, statusCode } = yield this.spaceService.uploadDocuments(req, res);
                res.status(statusCode).send({ data, message });
            }
            catch (error) {
                next(error);
            }
        });
        this.sentVerificationEmail = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { data, message, statusCode } = yield this.spaceService.sentVerificationEmail(req.params.id);
                res.status(statusCode).send({ data, message });
            }
            catch (error) {
                next(error);
            }
        });
        this.verifyEmail = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { data, message, statusCode } = yield this.spaceService.verifyEmail(req.params.token);
                res.status(statusCode).send({ data, message });
            }
            catch (error) {
                next(error);
            }
        });
        this.addSpaceLinks = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { link } = req.body;
                const spaceId = String(req.params.id);
                if (!link) {
                    throw new httpException_1.HttpException(400, "invalid link");
                }
                const { data, message, statusCode } = yield this.spaceService.addSpaceLinks(spaceId, link);
                res.status(statusCode).send({ data, message });
            }
            catch (error) {
                next(error);
            }
        });
        this.addLogo = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const spaceId = req.params.id;
                if (!spaceId) {
                    throw new httpException_1.HttpException(400, "invalid space id");
                }
                const { data, message, statusCode } = yield this.spaceService.addLogo(spaceId, req, res);
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
                    throw new httpException_1.HttpException(400, "invalid space id");
                }
                if (!(type === 'APPROVED' || type === 'REJECTED')) {
                    throw new httpException_1.HttpException(400, "invalid status type");
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
    }
};
exports.SpaceController = SpaceController;
exports.SpaceController = SpaceController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("SpaceService")),
    __metadata("design:paramtypes", [spaceService_1.SpaceService])
], SpaceController);
