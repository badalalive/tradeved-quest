"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificationMailTemplate = void 0;
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
