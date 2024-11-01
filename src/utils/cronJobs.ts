import axios from "axios";
import {getBcryptPassword, sendEmail} from "./utilities";
import {container} from "tsyringe";
import {SpaceRepository} from "../repository/spaceRepository";
import {Space, SpaceStatus} from "@prisma/client";
import {encryptData} from "../config/rsaEncryption";
import {spaceAccessCredentialsMailTemplate, spaceFormSubmissionMailTemplate} from "../templates/mailTemplate";

const spaceRepository = container.resolve(SpaceRepository);

export const sentSpaceCredentialEmail  = async () => {
    const spaces = await spaceRepository.findAllSpaceNoUserID();
    if(spaces.length === 0) {
        return;
    }
    await Promise.all(spaces.map(async (space: Space) => {
        if (space.status !== SpaceStatus.APPROVED) {
            return;
        }
        console.log(`${space.name} process started`)
        const passwordObj = await getBcryptPassword();
        const data = encryptData(JSON.stringify({
            email: space.email,
            password: passwordObj.bcrypt_password
        }));
        const response = await axios.post(`${process.env.AUTH_API_END_POINT}/signup/space-creator`, {
            data: data
        });

        const user: any = response.data.data;
        console.log("user =>", JSON.stringify(user))
        const result = await spaceRepository.createSpaceUserId(space.id, user.id);
        const emailContent = spaceAccessCredentialsMailTemplate(space.email, passwordObj.password);
        await sendEmail(space.email, "Space Credentials", emailContent)
        console.log(`${result.name} Space User ID ${result.user_id}`)
    }));
}