import nodemailer from "nodemailer";
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
export const generateRandomToken = (length: number): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomValues = randomBytes(length);  // Generate cryptographically secure random bytes
    let token = '';
    for (let i = 0; i < length; i++) {
        // Use the random byte value to select a character from the chars string
        token += chars[randomValues[i] % chars.length];
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

// Convert an array to a formatted string
export const arrayToString = (array: string[]): string | null => {
    if (array.length === 0) {
        return null;
    }
    return `[${array.map(item => `"${item}"`).join(", ")}]`;
}

// Convert a formatted string to an array
export const stringToArray = (str: string | null): string[] => {
    if(!str) {
        return [];
    }
    return str.slice(1, -1) // Remove the surrounding brackets
        .split(/,\s*/) // Split by comma and optional space
        .map(item => item.slice(1, -1)); // Remove quotes around each item
}


export const generateRandomPassword = () => {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    const getRandomCharacter = (arr: any) =>
        arr[Math.floor(Math.random() * arr.length)];

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
export const getBcryptPassword = async () => {
    const password = generateRandomPassword();
    return { password, bcrypt_password: await bcrypt.hash(password, 10) };
};