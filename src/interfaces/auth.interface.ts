// interfaces/request.interface.ts
import { Request } from "express";

export interface DataStoredInToken {
    id: string;
}

export interface TokenData {
    token: string;
    expiresIn: number;
}

export interface RequestWithUser extends Request {
    user?: any;
}

export interface RequestWithUserSpace extends Request {
    user?: any;
    space?: any;
}

export interface RequestWithTokenData extends Request {
    tokenData?: any;
}