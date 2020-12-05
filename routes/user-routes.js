const express = require("express");

const { signup, login } = require("../controllers/user-controllers");

const router = express.Router();

/** 
 * @swagger
 * /api/user/signup:
 *  post:
 *    tags:
 *    - User
 *    description: Signup as librarian or student
 *    parameters:
 *    - in: body
 *      name: user
 *      description: The user to create.
 *      schema:
 *       $ref: "#/definitions/User"
 *    responses:
 *      201:
 *        description: User created successfully!
 *      400:
 *        description: User creation failed!
 *      422:
 *        description: User already exists!
*/
router.post("/signup", signup);

/** 
 * @swagger
 * /api/user/signin:
 *  post:
 *    tags:
 *    - User
 *    description: Sign in as librarian or student
 *    parameters:
 *    - in: body
 *      name: user
 *      description: The user to login.
 *      schema:
 *        type: object
 *        required:
 *          - email
 *          - password
 *        properties:
 *          email:
 *            type: string
 *            format: email
 *          password:
 *            type: string
 *    responses:
 *      200:
 *        description: User login successfully
 *      401:
 *        description: User login failed!
 *      404:
 *        description: User Not Found!
 *      422:
 *        description: Wrong User credentials!
 * definitions:
 *  User:
 *    type: object
 *    required:
 *      - email
 *      - password 
 *      - userType
 *    properties:
 *      email:
 *        type: string
 *        format: email
 *      password:
 *        type: string
 *      userType:
 *        type: string
 *  Book:
 *     type: object
 *     required:
 *       - bookName
 *       - author 
 *       - genre 
 *       - releaseDate 
 *       - bookImage 
 *     properties:
 *       id:
 *         type: string
 *       bookName:
 *         type: string
 *       author:
 *         type: string
 *       genre:
 *         type: string
 *       releaseDate:
 *         type: string
 *       bookImage:
 *         type: string
*/
router.post("/signin", login);

module.exports = router;
