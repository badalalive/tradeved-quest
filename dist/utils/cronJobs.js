"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sentSpaceCredentialEmail = void 0;
const axios_1 = __importDefault(require("axios"));
const utilities_1 = require("./utilities");
const tsyringe_1 = require("tsyringe");
const spaceRepository_1 = require("../repository/spaceRepository");
const client_1 = require("@prisma/client");
const rsaEncryption_1 = require("../config/rsaEncryption");
const mailTemplate_1 = require("../templates/mailTemplate");
const spaceRepository = tsyringe_1.container.resolve(spaceRepository_1.SpaceRepository);
const sentSpaceCredentialEmail = () => __awaiter(void 0, void 0, void 0, function* () {
    const spaces = yield spaceRepository.findAllSpaceNoUserID();
    if (spaces.length === 0) {
        return;
    }
    yield Promise.all(spaces.map((space) => __awaiter(void 0, void 0, void 0, function* () {
        if (space.status !== client_1.SpaceStatus.APPROVED) {
            return;
        }
        console.log(`${space.name} process started`);
        const passwordObj = yield (0, utilities_1.getBcryptPassword)();
        const data = (0, rsaEncryption_1.encryptData)(JSON.stringify({
            email: space.email,
            password: passwordObj.bcrypt_password
        }));
        const response = yield axios_1.default.post(`${process.env.AUTH_API_END_POINT}/signup/space-creator`, {
            data: data
        });
        const user = response.data.data;
        console.log("user =>", JSON.stringify(user));
        const result = yield spaceRepository.createSpaceUserId(space.id, user.id);
        const emailContent = (0, mailTemplate_1.spaceAccessCredentialsMailTemplate)(space.email, passwordObj.password);
        yield (0, utilities_1.sendEmail)(space.email, "Space Credentials", emailContent);
        console.log(`${result.name} Space User ID ${result.user_id}`);
    })));
});
exports.sentSpaceCredentialEmail = sentSpaceCredentialEmail;
