import multer, { StorageEngine } from 'multer';
import path from 'path';
import * as fs from "fs";

// Define dynamic storage options based on file type
const storage: StorageEngine = multer.diskStorage({
    destination: function (req, file, cb) {
        let folder = 'uploads/other/'; // Default folder
        if (file.mimetype.startsWith('image/')) {
            folder = 'uploads/images/'; // Store images here
        } else if (
            file.mimetype === 'application/pdf' ||
            file.mimetype === 'application/msword' ||
            file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            file.mimetype === 'text/csv' ||
            file.mimetype === 'application/vnd.ms-excel' ||
            file.mimetype === 'application/zip' ||
            file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ) {
            folder = 'uploads/documents/'; // Store documents here
        }

        // Create the directory if it doesn't exist
        fs.mkdir(folder, { recursive: true }, (err) => {
            if (err) {
                return cb(err, folder); // Call callback with the error
            }
            cb(null, folder); // Pass the folder dynamically
        });
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
// File filter to allow only specific document formats or images
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedDocumentTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/csv',
        'application/vnd.ms-excel',
        'application/zip',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];

    if (allowedDocumentTypes.includes(file.mimetype) || allowedImageTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images and documents are allowed.'));
    }
};

// Configure Multer middleware
export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10 // Limit file size to 10MB
    },
    fileFilter: fileFilter
});