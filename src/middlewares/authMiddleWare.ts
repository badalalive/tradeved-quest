import {HttpException} from "../exceptions/httpException";
import { Response, NextFunction } from 'express';
import { RequestWithUser } from "../interfaces/auth.interface";
import axios from 'axios'; // To make HTTP requests to the other microservice

export const verifyTokenAndRolesMiddleware = (allowedRoles: string[]) => {
    return async (req: RequestWithUser, res: Response, next: NextFunction) => {
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

            req.user = user; // Attach user to request
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