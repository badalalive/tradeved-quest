import {inject, injectable} from "tsyringe";
import {KeyStatus, PrismaClient, Token} from "@prisma/client";
import {generateRandomToken} from "../utils/utilities";

@injectable()
export class TokenRepository {

    constructor(
        @inject("PrismaClient")
        private prismaClient: PrismaClient,
    ) {
    }

    async createToken (spaceId: string) : Promise<Token | null> {
        await this.prismaClient.$connect();
        const expireTime = new Date(); // Get current time
        expireTime.setHours(expireTime.getHours() + 1);
        const token = await this.prismaClient.token.create({
            data: {
                status: KeyStatus.ACTIVE,
                token: generateRandomToken(64),
                space_id: spaceId,
                expire_time: expireTime
            }
        })
        await this.prismaClient.$disconnect();
        return token;
    }

    async findTokenData(token: string): Promise<Token | null> {
        await this.prismaClient.$connect();
        const tokenData = await this.prismaClient.token.findUnique({
            where: {
                token: token
            }
        })
        await this.prismaClient.$disconnect();
        return tokenData;
    }

    async validateToken(token: string): Promise<any | false> {
        await this.prismaClient.$connect();
        const tokenData = await this.prismaClient.token.findUnique({
            where: {
                token: token,
                status: KeyStatus.ACTIVE,
                expire_time: {
                    gt: new Date(),
                },
            }, include: {
                space: true
            }
        })
        await this.prismaClient.$disconnect();
        return tokenData ?? false;
    }


}