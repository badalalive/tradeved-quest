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
exports.verifyTokenAndRolesMiddleware = void 0;
const httpException_1 = require("../exceptions/httpException");
const axios_1 = __importDefault(require("axios")); // To make HTTP requests to the other microservice
const verifyTokenAndRolesMiddleware = (allowedRoles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const token = req.headers['authorization'];
        if (!token) {
            return next(new httpException_1.HttpException(403, 'Token required.'));
        }
        try {
            // Send a request to the 'get-user' API of the Auth microservice
            const response = yield axios_1.default.get(`${process.env.AUTH_API_END_POINT}auth/get-user`, {
                headers: {
                    'Authorization': token,
                },
            });
            const user = response.data.data;
            console.log("user =>", JSON.stringify(user));
            if (!user) {
                return next(new httpException_1.HttpException(404, 'User not found.'));
            }
            // Check if the user has one of the allowed roles
            const userRoles = user.userRole.map((userRole) => userRole.role.title);
            const hasRole = userRoles.some((role) => allowedRoles.includes(role));
            if (!hasRole) {
                return next(new httpException_1.HttpException(403, 'Access denied.'));
            }
            req.user = user; // Attach user to request
            next();
        }
        catch (err) {
            console.log("Error:", err.message);
            if (err.response && err.response.status === 401) {
                return next(new httpException_1.HttpException(401, 'Wrong authentication token.'));
            }
            return next(new httpException_1.HttpException(500, 'Internal server error'));
        }
    });
};
exports.verifyTokenAndRolesMiddleware = verifyTokenAndRolesMiddleware;
