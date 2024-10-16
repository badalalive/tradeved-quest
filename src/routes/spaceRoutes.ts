import {container} from "tsyringe";
import {Router} from "express";
import {SpaceController} from "../controllers/spaceController";


const spaceController = container.resolve(SpaceController);

const spaceRoutes: Router = Router();

/**
 * @swagger
 * /space:
 *   post:
 *     summary: Create a new Space
 *     description: Creates a new Space with the provided data.
 *     tags:
 *       - Space
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               company_name:
 *                 type: string
 *                 example: "Awesome Inc."
 *               name:
 *                 type: string
 *                 example: "Awesome Space"
 *               email:
 *                 type: string
 *                 example: "admin@awesomeinc.com"
 *               description:
 *                 type: string
 *                 example: "This is an awesome space"
 *               category:
 *                 type: string
 *                 example: "Technology"
 *               created_by:
 *                 type: string
 *                 example: "admin"
 *               updated_by:
 *                 type: string
 *                 example: "admin"
 *     responses:
 *       201:
 *         description: Space created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Space created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "ckl8cbsyh0001ap5s4x83do89"
 *                     company_name:
 *                       type: string
 *                       example: "Awesome Inc."
 *                     name:
 *                       type: string
 *                       example: "Awesome Space"
 *                     email:
 *                       type: string
 *                       example: "admin@awesomeinc.com"
 *                     description:
 *                       type: string
 *                       example: "This is an awesome space"
 *                     category:
 *                       type: string
 *                       example: "Technology"
 *                     created_by:
 *                       type: string
 *                       example: "admin"
 *                     updated_by:
 *                       type: string
 *                       example: "admin"
 *                     created_at:
 *                       type: string
 *                       example: "2024-10-14T12:34:56.789Z"
 *                     updated_at:
 *                       type: string
 *                       example: "2024-10-14T12:34:56.789Z"
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid input data"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
spaceRoutes.post("", spaceController.create)
/**
 * @swagger
 * /space/upload-documents:
 *   post:
 *     summary: Upload multiple documents
 *     description: Upload multiple files such as PDFs, Word documents, or images. The endpoint supports up to 10 files in one request.
 *     tags:
 *       - Space
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Files uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: File(s) uploaded successfully!
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       filename:
 *                         type: string
 *                         example: example.pdf
 *                       path:
 *                         type: string
 *                         example: https://your-server.com/uploads/documents/example.pdf
 *       400:
 *         description: No files uploaded or invalid file
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: No file uploaded
 *       500:
 *         description: Server error during file upload
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
spaceRoutes.post("/upload-documents", spaceController.uploadDocuments)

export default spaceRoutes;


