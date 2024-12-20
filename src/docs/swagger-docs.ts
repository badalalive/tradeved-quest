/**
 * @swagger
 * /space/create/{token}:
 *   post:
 *     summary: Fill Space Details
 *     description: Fill Space Details provided with token
 *     tags:
 *       - Space
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: The email verification token
 *         schema:
 *           type: string
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
 *               description:
 *                 type: string
 *                 example: "This is an awesome space"
 *               links:
 *                 type: array
 *                 example: ["https://goggle.com"]
 *               category:
 *                 type: array
 *                 example: ["Edu", "Technology"]
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
 *       404:
 *         description: Space ID not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Space ID not found"
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
/**
 * @swagger
 * /space/update:
 *   put:
 *     summary: Update space details
 *     description: Updates the details of a space identified by the provided space ID.
 *     tags:
 *       - Space
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Space Name"
 *               description:
 *                 type: string
 *                 example: "Updated space description."
 *               category:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Education", "Technology"]
 *     responses:
 *       200:
 *         description: Space updated successfully
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
 *                   example: "Space updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "space-id-123"
 *                     name:
 *                       type: string
 *                       example: "Updated Space Name"
 *                     description:
 *                       type: string
 *                       example: "Updated space description."
 *                     category:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Education", "Technology"]
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-09-14T12:34:56Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-10-12T14:22:33Z"
 *       400:
 *         description: Invalid input data
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
 *                   example: "Invalid input data"
 *       404:
 *         description: Space not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "Space not found"
 *       500:
 *         description: Internal server error
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
 *                   example: "Internal server error"
 */
/**
 * @swagger
 * /space/details:
 *   get:
 *     summary: Retrieve space details
 *     description: Fetches the details of a space identified by the provided space ID.
 *     tags:
 *       - Space
 *     responses:
 *       200:
 *         description: Space details retrieved successfully
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
 *                   example: "Space details retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "space-id-123"
 *                     name:
 *                       type: string
 *                       example: "My Space"
 *                     description:
 *                       type: string
 *                       example: "This is a sample space description."
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-09-14T12:34:56Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-10-12T14:22:33Z"
 *       400:
 *         description: Invalid space ID
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
 *                   example: "Invalid spaceID"
 *       404:
 *         description: Space not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "Space not found"
 *       500:
 *         description: Internal server error
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
 *                   example: "Internal server error"
 */
/**
 * @swagger
 * /space/upload-documents/{token}:
 *   put:
 *     summary: Upload multiple documents
 *     description: Upload multiple files such as PDFs, Word documents, or images. The endpoint supports up to 10 files in one request. The files will be associated with the specified space ID.
 *     tags:
 *       - Space
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: The email verification token
 *         schema:
 *           type: string
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
 *                   example: "File(s) uploaded successfully!"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       filename:
 *                         type: string
 *                         example: "example.pdf"
 *                       path:
 *                         type: string
 *                         example: "https://your-server.com/uploads/documents/example.pdf"
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
 *                   example: "No file uploaded"
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
 *                   example: "Internal server error"
 */
/**
 * @swagger
 * /space/space-creation-link:
 *   post:
 *     summary: Send space creation link to email
 *     description: Sends a verification email to the space's registered email address. If the email is already verified, it returns a 409 conflict status. If no email is provided, it returns a 400 error.
 *     tags:
 *       - Space
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "admin@gmail.com"
 *     responses:
 *       200:
 *         description: Verification email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   description: Space data
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     is_email_verified:
 *                       type: boolean
 *                 message:
 *                   type: string
 *                   example: "Email Sent"
 *       400:
 *         description: Email required or invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email required"
 *       404:
 *         description: Space not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Space does not exist"
 *       409:
 *         description: Email already verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email Already Verified"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
/**
 * @swagger
 * /space/verify-space-link/{token}:
 *   post:
 *     summary: Verify space link token and give space details
 *     description: Verify space link token and give space details. If the token is invalid or expired, appropriate error responses are returned.
 *     tags:
 *       - Space
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: The email verification token
 *     responses:
 *       200:
 *         description: Email verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Email Verified Successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     space_id:
 *                       type: string
 *                       example: "some-space-id"
 *                     is_expired:
 *                       type: boolean
 *                       example: false
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token required"
 *       404:
 *         description: Space not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Space does not exist"
 *       410:
 *         description: Token has expired
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token has expired"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
/**
 * @swagger
 * /space/upload-logo/{token}:
 *   put:
 *     summary: Upload a logo for a space
 *     description: Uploads a single image file banner to a space identified by the provided space ID.
 *     tags:
 *       - Space
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: The email verification token
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload
 *     responses:
 *       200:
 *         description: Logo uploaded successfully
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
 *                   example: "Logo uploaded successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     filename:
 *                       type: string
 *                       example: "logo.png"
 *                     path:
 *                       type: string
 *                       example: "https://yourserver.com/uploads/images/logo.png"
 *       400:
 *         description: No file uploaded or space does not exist
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
 *                   example: "No file uploaded"
 *       404:
 *         description: Space not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "Space not found"
 *       500:
 *         description: Server error
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
 *                   example: "Internal server error"
 */
/**
 * @swagger
 * /space/update-logo:
 *   put:
 *     summary: Update space logo
 *     description: Updates the logo of the specified space.
 *     tags:
 *       - Space
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The logo file to upload.
 *     responses:
 *       200:
 *         description: Logo updated successfully
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
 *                   example: "Logo uploaded successfully!"
 *                 data:
 *                   type: object
 *                   properties:
 *                     filename:
 *                       type: string
 *                       example: "logo.png"
 *                     path:
 *                       type: string
 *                       example: "https://example.com/uploads/logo.png"
 *       400:
 *         description: Invalid logo file or space does not exist
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
 *                   example: "Space does not exist"  # or "No file uploaded" as appropriate
 *       404:
 *         description: Space not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "Space not found"
 *       500:
 *         description: Internal server error
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
 *                   example: "Internal server error"
 */
/**
 * @swagger
 * /space/upload-banner:
 *   put:
 *     summary: Upload a logo for a space
 *     description: Uploads a single image file (logo) to a space identified by the provided space ID.
 *     tags:
 *       - Space
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload
 *     responses:
 *       200:
 *         description: Banner uploaded successfully
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
 *                   example: "Banner uploaded successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     filename:
 *                       type: string
 *                       example: "banner.png"
 *                     path:
 *                       type: string
 *                       example: "https://yourserver.com/uploads/images/banner.png"
 *       400:
 *         description: No file uploaded or space does not exist
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
 *                   example: "No file uploaded"
 *       404:
 *         description: Space not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "Space not found"
 *       500:
 *         description: Server error
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
 *                   example: "Internal server error"
 */
/**
 * @swagger
 * /space/status/{id}/{type}:
 *   put:
 *     summary: Update the status of a space
 *     description: Updates the status of a space to either APPROVED or REJECTED, with an optional rejection reason.
 *     tags:
 *       - Space
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the space whose status is being updated
 *         schema:
 *           type: string
 *       - in: path
 *         name: type
 *         required: true
 *         description: The new status of the space. Can be APPROVED or REJECTED.
 *         schema:
 *           type: string
 *           enum: [APPROVED, REJECTED]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reject_reason:
 *                 type: string
 *                 description: The reason for rejecting the space (only required if the type is REJECTED).
 *                 example: "The space does not meet the criteria"
 *     responses:
 *       200:
 *         description: Status updated successfully
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
 *                   example: "Status updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "space-id-123"
 *                     status:
 *                       type: string
 *                       example: "APPROVED"
 *       400:
 *         description: Invalid input data (e.g., invalid space ID or status type)
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
 *                   example: "Invalid space ID or status type"
 *       404:
 *         description: Space not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "Space not found"
 *       500:
 *         description: Server error
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
 *                   example: "Internal server error"
 */
/**
 * @swagger
 * /space/submit/{token}:
 *   post:
 *     summary: Submit a space form
 *     description: Submits a form for a space identified by the provided token.
 *     tags:
 *       - Space
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: The email verification token
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Space form submitted successfully
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
 *         description: Invalid input or missing required fields
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
 *                   example: "Invalid input data."
 *       404:
 *         description: Space not found or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "Space not found or invalid token."
 *       500:
 *         description: Internal server error
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
 *                   example: "Internal server error."
 */
/**
 * @swagger
 * /space/all:
 *   get:
 *     summary: Retrieve all spaces
 *     description: Fetches a list of all spaces in the system.
 *     tags:
 *       - Space
 *     responses:
 *       200:
 *         description: A list of spaces retrieved successfully
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
 *                   example: "Spaces retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "space-id-123"
 *                       company_name:
 *                         type: string
 *                         example: "Awesome Inc."
 *                       name:
 *                         type: string
 *                         example: "Awesome Space"
 *                       email:
 *                         type: string
 *                         example: "admin@awesomeinc.com"
 *                       description:
 *                         type: string
 *                         example: "This is an awesome space"
 *                       category:
 *                         type: string
 *                         example: "Technology"
 *                       created_by:
 *                         type: string
 *                         example: "admin"
 *                       updated_by:
 *                         type: string
 *                         example: "admin"
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-10-14T12:34:56.789Z"
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-10-14T12:34:56.789Z"
 *       500:
 *         description: Internal server error
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
 *                   example: "Internal server error"
 */
/**
 * @swagger
 * /quest/create:
 *   post:
 *     summary: Create a new quest
 *     description: Creates a new quest in the specified space.
 *     tags:
 *       - Quest
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 255
 *                 example: "Epic Adventure"
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *                 example: "A thrilling quest to find the lost treasure."
 *               logo_url:
 *                 type: string
 *                 example: "https://domain.org/logo.png"
 *               content:
 *                 type: string
 *                 example: "Quest content goes here."
 *               content_type:
 *                 type: string
 *                 enum: [TEXT, VIDEO, IMAGE]
 *                 example: "TEXT"
 *               participant_limit:
 *                 type: integer
 *                 minimum: 1
 *                 example: 10
 *               max_reward_point:
 *                 type: integer
 *                 minimum: 0
 *                 example: 100
 *               end_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-12-31T23:59:59.999Z"
 *               reattempt:
 *                 type: integer
 *                 minimum: -1
 *                 example: 0
 *               category:
 *                 type: string
 *                 enum: [GENERAL, TIMED, MINI_GAMES, DAILY]
 *                 example: "GENERAL"
 *               view_status:
 *                 type: string
 *                 enum: [PUBLIC, PRIVATE]
 *                 example: "PUBLIC"
 *               quest_time:
 *                 type: integer
 *                 minimum: 1
 *                 example: 3600
 *               template:
 *                 type: string
 *                 enum: [QNA, VOTE]
 *                 example: "QNA"
 *               questQNA:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     questionText:
 *                       type: string
 *                       example: "What is the treasure's location?"
 *                     description:
 *                       type: string
 *                       example: "Clue to find the treasure."
 *                     answerType:
 *                       type: string
 *                       enum: [SINGLE, MULTIPLE]
 *                       example: "SINGLE"
 *                     options:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           content:
 *                             type: string
 *                             example: "Under the old oak tree"
 *                           isCorrectAnswer:
 *                             type: boolean
 *                             example: true
 *                           description:
 *                             type: string
 *                             example: "oak"
 *               questVote:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     news_item:
 *                       type: string
 *                       example: "Where will the market go?"
 *                     options:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                            option_text:
 *                              type: string
 *                              example: "UP"
 *     responses:
 *       201:
 *         description: Quest created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Quest created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "quest-id-123"
 *       400:
 *         description: Invalid input data
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
/**
 * @swagger
 * /quest/vote/{id}/{optionId}:
 *   post:
 *     summary: Submit a vote for a quest option
 *     description: Allows a user to vote on a specific option in a quest.
 *     tags:
 *       - Quest
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the quest
 *       - in: path
 *         name: optionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the option to vote for
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Vote submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Vote submitted successfully"
 *       400:
 *         description: Invalid input data or already voted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid input data or user has already voted"
 *       404:
 *         description: Quest vote or option not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Quest vote or option not found"
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
/**
 * @swagger
 * /quest/voting-article/{id}:
 *   get:
 *     summary: Get voting details for a quest
 *     description: Retrieves details for a specific quest vote including options and current vote counts.
 *     tags:
 *       - Quest
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the quest
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Quest vote details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 questVote:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "questVoteId123"
 *                     news_item:
 *                       type: string
 *                       example: "Market forecast for next quarter"
 *                     options:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "optionId123"
 *                           option_text:
 *                             type: string
 *                             example: "UP"
 *                           vote_count:
 *                             type: integer
 *                             example: 42
 *       404:
 *         description: Quest vote not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Quest vote not found"
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
/**
 * @swagger
 * /quest/qna/{id}:
 *   get:
 *     summary: Get Quest Q&A by ID
 *     description: Retrieve a Quest's Q&A by its unique ID. This endpoint requires user authentication with a USER role.
 *     tags:
 *       - Quest
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the quest Q&A to retrieve.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Quest Q&A details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "questQnaId123"
 *                 title:
 *                   type: string
 *                   example: "Epic Adventure"
 *                 description:
 *                   type: string
 *                   example: "A thrilling quest to find the lost treasure."
 *                 questions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "questionId123"
 *                       questionText:
 *                         type: string
 *                         example: "What is the treasure's location?"
 *                       options:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               example: "optionId123"
 *                             content:
 *                               type: string
 *                               example: "Under the old oak tree"
 *                             isCorrectAnswer:
 *                               type: boolean
 *                               example: true
 *       404:
 *         description: Quest Q&A not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Quest Q&A not found"
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
/**
 * @swagger
 * /quest/qna/check-answer:
 *   post:
 *     summary: Check answers for questions in a quest
 *     description: Validates selected options for each question in a quest based on the provided question IDs and selected options.
 *     tags:
 *       - Quest
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: object
 *                 properties:
 *                   question_id:
 *                     type: string
 *                     description: ID of the question
 *                     example: "question123"
 *                   selected_options:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: Array of selected option IDs
 *                     example: ["option1", "option2"]
 *     responses:
 *       200:
 *         description: Answer validation results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 correct:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "All answers are correct"
 *       400:
 *         description: Bad Request - Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid request data"
 *       404:
 *         description: Quest or Question not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Quest or question not found"
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
/**
 * @swagger
 * /quest/qna/submit/{id}:
 *   post:
 *     summary: Submit answers for a QnA quest
 *     description: Submits the selected answers for questions in a QnA quest by a participant.
 *     tags:
 *       - Quest
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the QnA quest
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Answers submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Answers submitted successfully"
 *                 submissionId:
 *                   type: string
 *                   example: "submission123"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid data provided"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       404:
 *         description: QnA quest not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "QnA quest not found"
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
/**
 * @swagger
 * /quest/update/{id}:
 *   put:
 *     summary: Update a quest by ID
 *     description: Updates the details of an existing quest.
 *     tags:
 *       - Quest
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the quest to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 255
 *                 example: "Updated Epic Adventure"
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *                 example: "An updated description for the quest."
 *               participant_limit:
 *                 type: integer
 *                 minimum: 1
 *                 example: 100
 *               max_reward_point:
 *                 type: integer
 *                 minimum: 1
 *                 example: 500
 *               end_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-12-31T23:59:59Z"
 *               reattempt:
 *                 type: integer
 *                 minimum: 0
 *                 example: 2
 *               category:
 *                 type: string
 *                 enum: ["ADVENTURE", "PUZZLE", "EDUCATION"]
 *                 example: "ADVENTURE"
 *               quest_time:
 *                 type: integer
 *                 minimum: 1
 *                 example: 3600
 *     responses:
 *       200:
 *         description: Quest updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Quest updated successfully"
 *       400:
 *         description: Invalid quest ID or input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid quest ID or input data"
 *       404:
 *         description: Quest not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Quest not found"
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
/**
 * @swagger
 * /quest/get/{id}:
 *   get:
 *     summary: Get a quest by ID
 *     description: Retrieves a quest by its ID.
 *     tags:
 *       - Quest
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the quest to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Quest retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Quest retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "quest-id-123"
 *                     title:
 *                       type: string
 *                       example: "Epic Adventure"
 *       404:
 *         description: Quest not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Quest not found"
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
/**
 * @swagger
 * /quest/all:
 *   get:
 *     summary: Retrieve paginated and sorted quests
 *     description: Fetches a list of quests with pagination and sorting options.
 *     tags:
 *       - Quest
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of quests per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: "created_at"
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: "desc"
 *         description: Sort order, either ascending or descending
 *     responses:
 *       200:
 *         description: A paginated list of quests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                 message:
 *                   type: string
 *                   example: "Quests fetched successfully"
 *                 meta:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     pageSize:
 *                       type: integer
 *                       example: 20
 *                     totalCount:
 *                       type: integer
 *                       example: 100
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /quest/get-all:
 *   get:
 *     summary: Get all quests
 *     description: Retrieves all quests associated with a specific space.
 *     tags:
 *       - Quest
 *     responses:
 *       200:
 *         description: Quests retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Quests retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "quest-id-123"
 *                       title:
 *                         type: string
 *                         example: "Epic Adventure"
 *       404:
 *         description: No quests found for the space
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No quests found for this space"
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
/**
 * @swagger
 * /quest/update-status/{id}:
 *   put:
 *     summary: Update quest status
 *     description: Updates the status of a quest.
 *     tags:
 *       - Quest
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the quest to update status
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "COMPLETED"
 *               schedule_time:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-12-31T23:59:59.999Z"
 *     responses:
 *       200:
 *         description: Quest status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Quest status updated successfully"
 *       400:
 *         description: Invalid quest ID or status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid quest ID or status"
 *       404:
 *         description: Quest not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Quest not found"
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
/**
 * @swagger
 * /quest/publish/{id}:
 *   put:
 *     summary: Publish a quest by ID
 *     description: Publishes a quest, making it available to participants.
 *     tags:
 *       - Quest
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the quest to publish
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "COMPLETED"
 *               schedule_time:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-12-31T23:59:59.999Z"
 *     responses:
 *       200:
 *         description: Quest published successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Quest published successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "quest-id-123"
 *                     status:
 *                       type: string
 *                       example: "PUBLISHED"
 *       400:
 *         description: Invalid quest ID or input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid quest ID or input data"
 *       403:
 *         description: Unauthorized - user does not have permission
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized action"
 *       404:
 *         description: Quest not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Quest not found"
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
/**
 * @swagger
 * /quest/approval-status/{id}:
 *   post:
 *     summary: Submit quest for approval
 *     description: Submits a quest for approval or rejection.
 *     tags:
 *       - Quest
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the quest to submit for approval
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reject_reason:
 *                 type: string
 *                 example: "Insufficient details"
 *     responses:
 *       200:
 *         description: Quest submitted for approval successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Quest submitted for approval successfully"
 *       400:
 *         description: Invalid quest ID or approval type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid quest ID or approval type"
 *       404:
 *         description: Quest not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Quest not found"
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
/**
 * @swagger
 * /quest/toggle-view/{id}:
 *   post:
 *     summary: Toggle quest visibility
 *     description: Toggles the visibility of the specified quest.
 *     tags:
 *       - Quest
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the quest to toggle visibility for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Quest visibility toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Quest visibility toggled successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "quest-id-123"
 *                     visible:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Invalid quest ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid quest ID"
 *       404:
 *         description: Quest not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Quest not found"
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
/**
 * @swagger
 * /quest/upload-media:
 *   post:
 *     summary: Upload a media file for a quest
 *     description: Uploads a single media file related to a quest. Only specific file types are allowed.
 *     tags:
 *       - Quest
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "uploaded"
 *                 data:
 *                   type: object
 *                   properties:
 *                     filename:
 *                       type: string
 *                       example: "uploaded-file.jpg"
 *                     path:
 *                       type: string
 *                       example: "http://yourserver.com/uploads/images/uploaded-file.jpg"
 *       400:
 *         description: No file uploaded or invalid file type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No file uploaded or invalid file type"
 *       500:
 *         description: Internal server error during file upload
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error during file upload"
 */
