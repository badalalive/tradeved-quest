import cron from "node-cron";
import {sentSpaceCredentialEmail} from "./cronJobs";

export const spaceCredentialEmailTask = cron.schedule('*/3 * * * *', async () => {
    console.log('running scheduled job to sent email for approved space');
    try {
        await sentSpaceCredentialEmail();
    } catch (error : any) {
        console.log("Space Email Confirmation Job failed:", error);
    }
});