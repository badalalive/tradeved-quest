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
exports.extractErrorMessages = exports.sendEmail = exports.generateRandomToken = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const generateRandomToken = (length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        token += chars[randomIndex];
    }
    return token;
};
exports.generateRandomToken = generateRandomToken;
const sendEmail = (email, subject, emailContent) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        host: process.env.HOST,
        service: process.env.SERVICE,
        port: Number(process.env.EMAIL_PORT),
        secure: Boolean(process.env.SECURE),
        auth: {
            user: process.env.SENDER, // email address
            pass: process.env.PASS, // email password or app-specific password
        },
    });
    try {
        yield transporter.sendMail({
            from: process.env.SENDER,
            to: email,
            subject: subject,
            html: emailContent, // Use 'html' instead of 'text' for formatting
        });
        console.log("Email sent successfully");
    }
    catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
});
exports.sendEmail = sendEmail;
const extractErrorMessages = (errors) => {
    const errorMessages = {};
    errors.forEach(error => {
        if (error.constraints) {
            // Collect all error messages for the current field
            errorMessages[error.property] = Object.values(error.constraints);
        }
        // If there are nested validation errors (e.g., for array or object properties), handle them recursively
        if (error.children && error.children.length > 0) {
            // Recursively extract messages for children
            error.children.forEach((childError) => {
                const childMessages = (0, exports.extractErrorMessages)([childError]);
                Object.keys(childMessages).forEach(key => {
                    if (errorMessages[error.property]) {
                        // Merge child messages into the same property array if already exists
                        errorMessages[error.property] = [
                            ...errorMessages[error.property],
                            ...childMessages[key],
                        ];
                    }
                    else {
                        errorMessages[error.property] = childMessages[key];
                    }
                });
            });
        }
    });
    return errorMessages;
};
exports.extractErrorMessages = extractErrorMessages;
