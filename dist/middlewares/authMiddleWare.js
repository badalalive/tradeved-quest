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
exports.validateTokenMiddleware = exports.verifyTokenAndRolesMiddleware = void 0;
const httpException_1 = require("../exceptions/httpException");
const axios_1 = __importDefault(require("axios"));
const tsyringe_1 = require("tsyringe");
const tokenRepository_1 = require("../repository/tokenRepository");
const client_1 = require("@prisma/client"); // To make HTTP requests to the other microservice
const prisma = new client_1.PrismaClient();
const verifyTokenAndRolesMiddleware = (allowedRoles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const token = req.headers['authorization'];
        if (!token) {
            return next(new httpException_1.HttpException(403, 'Token required.'));
        }
        try {
            // Send a request to the 'get-user' API of the Auth microservice
            const response = yield axios_1.default.get(`${process.env.AUTH_API_END_POINT}/get-user`, {
                headers: {
                    'Authorization': token,
                },
            });
            const user = response.data.data;
            if (!user) {
                return next(new httpException_1.HttpException(404, 'User not found.'));
            }
            // Check if the user has one of the allowed roles
            const userRoles = user.userRole.map((userRole) => userRole.role.title);
            const hasRole = userRoles.some((role) => allowedRoles.includes(role));
            if (!hasRole) {
                return next(new httpException_1.HttpException(403, 'Access denied.'));
            }
            const space = yield prisma.space.findUnique({
                where: { user_id: user.id }, include: {
                    links: {
                        select: {
                            link: true
                        }
                    },
                    documents: {
                        select: {
                            path: true,
                            filename: true
                        }
                    },
                    quests: true
                },
            });
            req.user = user; // Attach user to request
            req.space = space; // Attach space to request
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
const validateTokenMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tokenRepository = tsyringe_1.container.resolve(tokenRepository_1.TokenRepository);
        // Retrieve the token from params
        const token = String(req.params.token) || "";
        // Check if the token is provided
        if (!token) {
            throw new httpException_1.HttpException(400, "Token required");
        }
        // Validate the token using the token repository
        const tokenData = yield tokenRepository.validateToken(token);
        // Check if the token is valid and associated with a space
        if (!tokenData || !tokenData.space_id) {
            throw new httpException_1.HttpException(403, "Invalid Token");
        }
        // Attach token data to the request object (optional)
        req.tokenData = tokenData;
        // Proceed to the next middleware/controller
        next();
    }
    catch (error) {
        // Handle error and pass it to the next error handler middleware
        next(error);
    }
});
exports.validateTokenMiddleware = validateTokenMiddleware;
