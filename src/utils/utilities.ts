import nodemailer from "nodemailer";

export const generateRandomToken = (length: number): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        token += chars[randomIndex];
    }
    return token;
}
export const sendEmail = async (email: string, subject: string, emailContent: string) => {
    const transporter = nodemailer.createTransport({
        host: process.env.HOST,
        service: process.env.SERVICE,
        port: Number(process.env.EMAIL_PORT),
        secure: Boolean(process.env.SECURE),
        auth: {
            user: process.env.SENDER, // email address
            pass: process.env.PASS,   // email password or app-specific password
        },
    });


    try {
        await transporter.sendMail({
            from: process.env.SENDER,
            to: email,
            subject: subject,
            html: emailContent,  // Use 'html' instead of 'text' for formatting
        });
        console.log("Email sent successfully");
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};

export const extractErrorMessages = (errors: any[]): Record<string, string[]> => {
    const errorMessages: Record<string, string[]> = {};

    errors.forEach(error => {
        if (error.constraints) {
            // Collect all error messages for the current field
            errorMessages[error.property] = Object.values(error.constraints);
        }

        // If there are nested validation errors (e.g., for array or object properties), handle them recursively
        if (error.children && error.children.length > 0) {
            // Recursively extract messages for children
            error.children.forEach((childError: any) => {
                const childMessages = extractErrorMessages([childError]);
                Object.keys(childMessages).forEach(key => {
                    if (errorMessages[error.property]) {
                        // Merge child messages into the same property array if already exists
                        errorMessages[error.property] = [
                            ...errorMessages[error.property],
                            ...childMessages[key],
                        ];
                    } else {
                        errorMessages[error.property] = childMessages[key];
                    }
                });
            });
        }
    });

    return errorMessages;
};
