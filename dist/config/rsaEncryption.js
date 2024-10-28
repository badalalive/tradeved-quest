"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptData = encryptData;
const crypto_1 = __importDefault(require("crypto"));
const publicKey = ((_a = process.env.RSA_PUBLIC_KEY) === null || _a === void 0 ? void 0 : _a.replace(/\\n/g, '\n')) || '';
function encryptData(data) {
    const encryptedData = crypto_1.default.publicEncrypt(publicKey, Buffer.from(data));
    return encryptedData.toString('base64');
}
