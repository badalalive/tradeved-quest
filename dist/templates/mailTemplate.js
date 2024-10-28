"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spaceAccessCredentialsMailTemplate = exports.spaceApprovalNotificationMailTemplate = exports.spaceFormSubmissionMailTemplate = exports.verificationMailTemplate = void 0;
const verificationMailTemplate = (link) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Space Creation Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #000000;
            color: #FFFFFF;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            padding: 20px;
            text-align: center;
        }
        .content {
            background-color: #1a1a1a;
            padding: 40px;
            border-radius: 10px;
            max-width: 600px;
            margin: 0 auto;
        }
        h1 {
            color: #9BEC00;
        }
        p {
            font-size: 16px;
            color: #CCCCCC;
            line-height: 1.6;
        }
        .button-container {
            margin-top: 30px;
        }
        .manage-button {
            background-color: #9BEC00;
            color: #000000;
            text-decoration: none;
            padding: 15px 25px;
            font-size: 16px;
            font-weight: bold;
            border-radius: 5px;
            display: inline-block;
        }
        .footer {
            margin-top: 40px;
            font-size: 12px;
            color: #666666;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="content">
            <h1>Congratulations!</h1>
            <p>Your space has been successfully created. You can now manage your space, add new members, and customize your settings.</p>
            <p>To get started, click the button below to manage your space.</p>
            <div class="button-container">
                <a href=${link} class="manage-button">Manage Your Space</a>
            </div>
            <p>If the button above doesn't work, copy and paste the following link into your browser:</p>
            <p><a href=${link} style="color: #9BEC00;">${link}</a></p>
            <div class="footer">
                <p>If you didn't create this space, please ignore this email.</p>
                <p>&copy; 2024 Your Company. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>
`;
};
exports.verificationMailTemplate = verificationMailTemplate;
const spaceFormSubmissionMailTemplate = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Space Form Submission Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #000000;
            color: #FFFFFF;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            padding: 20px;
            text-align: center;
        }
        .content {
            background-color: #1a1a1a;
            padding: 40px;
            border-radius: 10px;
            max-width: 600px;
            margin: 0 auto;
        }
        h1 {
            color: #9BEC00;
        }
        p {
            font-size: 16px;
            color: #CCCCCC;
            line-height: 1.6;
        }
        .footer {
            margin-top: 40px;
            font-size: 12px;
            color: #666666;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="content">
            <h1>Form Submission Received!</h1>
            <p>Thank you for submitting the form for your space. We have successfully received your request.</p>
            <p>Our team is currently reviewing your submission and will get back to you shortly. You can expect a response within 24 hours.</p>
            <p>If you have any additional questions or need further assistance, please do not hesitate to reach out to our support team.</p>
            <div class="footer">
                <p>If you did not submit this form, please contact our support team immediately.</p>
                <p>&copy; 2024 Your Company. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>
`;
};
exports.spaceFormSubmissionMailTemplate = spaceFormSubmissionMailTemplate;
// Function for space approval notification
const spaceApprovalNotificationMailTemplate = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Space Approval Notification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #000000;
            color: #FFFFFF;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            padding: 20px;
            text-align: center;
        }
        .content {
            background-color: #1a1a1a;
            padding: 40px;
            border-radius: 10px;
            max-width: 600px;
            margin: 0 auto;
        }
        h1 {
            color: #9BEC00;
        }
        p {
            font-size: 16px;
            color: #CCCCCC;
            line-height: 1.6;
        }
        .footer {
            margin-top: 40px;
            font-size: 12px;
            color: #666666;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="content">
            <h1>Space Approved!</h1>
            <p>Congratulations! Your space has been approved and is now ready for you to access and manage.</p>
            <p>You will receive your login credentials shortly.</p>
            <div class="footer">
                <p>If you did not request access to this space, please contact our support team immediately.</p>
                <p>&copy; 2024 Your Company. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>
`;
};
exports.spaceApprovalNotificationMailTemplate = spaceApprovalNotificationMailTemplate;
// Function for sending credentials for space access
const spaceAccessCredentialsMailTemplate = (email, password) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Space Access Credentials</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #000000;
            color: #FFFFFF;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            padding: 20px;
            text-align: center;
        }
        .content {
            background-color: #1a1a1a;
            padding: 40px;
            border-radius: 10px;
            max-width: 600px;
            margin: 0 auto;
        }
        h1 {
            color: #9BEC00;
        }
        p {
            font-size: 16px;
            color: #CCCCCC;
            line-height: 1.6;
        }
        .credentials-container {
            background-color: #333333;
            padding: 20px;
            border-radius: 5px;
            margin-top: 20px;
            color: #FFFFFF;
        }
        .footer {
            margin-top: 40px;
            font-size: 12px;
            color: #666666;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="content">
            <h1>Your Access Credentials</h1>
            <p>Use the credentials below to log in and get started with managing your space:</p>
            <div class="credentials-container">
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Password:</strong> ${password}</p>
            </div>
            <p>We recommend changing your password after your first login for added security.</p>
            <div class="footer">
                <p>If you did not request access to this space, please contact our support team immediately.</p>
                <p>&copy; 2024 Your Company. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>
`;
};
exports.spaceAccessCredentialsMailTemplate = spaceAccessCredentialsMailTemplate;
