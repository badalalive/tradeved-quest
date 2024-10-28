import {HttpException} from "../exceptions/httpException";
import { Response, NextFunction } from 'express';
import {RequestWithUser, RequestWithTokenData, RequestWithUserSpace} from "../interfaces/auth.interface";
import axios from 'axios';
import {container} from "tsyringe";
import {TokenRepository} from "../repository/tokenRepository";
import {PrismaClient} from "@prisma/client"; // To make HTTP requests to the other microservice

const prisma = new PrismaClient();

export const verifyTokenAndRolesMiddleware = (allowedRoles: string[]) => {
    return async (req: RequestWithUserSpace, res: Response, next: NextFunction) => {
        const token = req.headers['authorization'];

        if (!token) {
            return next(new HttpException(403, 'Token required.'));
        }

        try {
            // Send a request to the 'get-user' API of the Auth microservice
            const response = await axios.get(`${process.env.AUTH_API_END_POINT}auth/get-user`, {
                headers: {
                    'Authorization': token,
                },
            });

            const user: any = response.data.data;
            console.log("user =>", JSON.stringify(user))
            if (!user) {
                return next(new HttpException(404, 'User not found.'));
            }

            // Check if the user has one of the allowed roles
            const userRoles = user.userRole.map((userRole: any) => userRole.role.title);
            const hasRole = userRoles.some((role: string) => allowedRoles.includes(role));

            if (!hasRole) {
                return next(new HttpException(403, 'Access denied.'));
            }
            const space = await prisma.space.findUnique({
                where: { user_id: user.id }, include: {
                    links: true,
                    documents: true,
                    quests: true
                },
            });
            req.user = user; // Attach user to request
            req.space = space; // Attach space to request
            next();
        } catch (err: any) {
            console.log("Error:", err.message)
            if (err.response && err.response.status === 401) {
                return next(new HttpException(401, 'Wrong authentication token.'));
            }
            return next(new HttpException(500, 'Internal server error'));
        }
    };
};

export const validateTokenMiddleware = async (
    req: RequestWithTokenData,
    res: Response,
    next: NextFunction
) => {
    try {
        const tokenRepository = container.resolve(TokenRepository);
        // Retrieve the token from params
        const token = String(req.params.token) || "";

        // Check if the token is provided
        if (!token) {
            throw new HttpException(400, "Token required");
        }

        // Validate the token using the token repository
        const tokenData = await tokenRepository.validateToken(token);

        // Check if the token is valid and associated with a space
        if (!tokenData || !tokenData.space_id) {
            throw new HttpException(403, "Invalid Token");
        }

        // Attach token data to the request object (optional)
        req.tokenData = tokenData;

        // Proceed to the next middleware/controller
        next();
    } catch (error) {
        // Handle error and pass it to the next error handler middleware
        next(error);
    }
};