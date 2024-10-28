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
exports.getBcryptPassword = exports.generateRandomPassword = exports.stringToArray = exports.arrayToString = exports.extractErrorMessages = exports.sendEmail = exports.generateRandomToken = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = require("crypto");
const generateRandomToken = (length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomValues = (0, crypto_1.randomBytes)(length); // Generate cryptographically secure random bytes
    let token = '';
    for (let i = 0; i < length; i++) {
        // Use the random byte value to select a character from the chars string
        token += chars[randomValues[i] % chars.length];
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
// Convert an array to a formatted string
const arrayToString = (array) => {
    if (array.length === 0) {
        return null;
    }
    return `[${array.map(item => `"${item}"`).join(", ")}]`;
};
exports.arrayToString = arrayToString;
// Convert a formatted string to an array
const stringToArray = (str) => {
    if (!str) {
        return [];
    }
    return str.slice(1, -1) // Remove the surrounding brackets
        .split(/,\s*/) // Split by comma and optional space
        .map(item => item.slice(1, -1)); // Remove quotes around each item
};
exports.stringToArray = stringToArray;
const generateRandomPassword = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    const getRandomCharacter = (arr) => arr[Math.floor(Math.random() * arr.length)];
    let password = "";
    // Ensure at least one uppercase letter
    password += getRandomCharacter("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    // Ensure at least one lowercase letter
    password += getRandomCharacter("abcdefghijklmnopqrstuvwxyz");
    // Ensure at least one number
    password += getRandomCharacter("0123456789");
    // Ensure at least one special character
    password += getRandomCharacter("!@#$%^&*()");
    // Generate the remaining characters randomly
    for (let i = 4; i < 8; i++) {
        password += getRandomCharacter(characters);
    }
    // Shuffle the password to randomize the order
    password = password
        .split("")
        .sort(() => Math.random() - 0.5)
        .join("");
    return password;
};
exports.generateRandomPassword = generateRandomPassword;
const getBcryptPassword = () => __awaiter(void 0, void 0, void 0, function* () {
    const password = (0, exports.generateRandomPassword)();
    return { password, bcrypt_password: yield bcrypt_1.default.hash(password, 10) };
});
exports.getBcryptPassword = getBcryptPassword;
