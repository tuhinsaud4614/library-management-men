const express = require("express");

const { isStudentAuth, isLibrarianAuth } = require("../middleware/is-auth");
const imageUpload = require("../middleware/image-uploads");

const {
  addBook,
  updateBook,
  deleteBook,
  changeBookStatus,
  getBooks,
  getBookById
} = require("../controllers/book-controllers");

const router = express.Router();

/** 
 * @swagger
 * /api/book/add:
 *  post:
 *    description: Add a single book
 *    tags:
 *    - Librarian
 *    parameters:
 *      - in: header
 *        name: Authorization
 *        type: string
 *        required: true
 *      - in: formData
 *        name: bookName
 *        description: The name of book
 *        type: string
 *        required: true
 *      - in: formData
 *        name: author
 *        description: The author of book
 *        type: string
 *        required: true
 *      - in: formData
 *        name: genre
 *        description: The genre of book
 *        type: string
 *        required: true
 *      - in: formData
 *        name: releaseDate
 *        description: The release date of book
 *        type: string
 *        format: date
 *        required: true
 *      - in: formData
 *        name: bookImage
 *        description: The image of book
 *        type: file
 *        required: true
 *    responses:
 *      201:
 *        description: Book created successfully!
 *      401:
 *        description: Not Authenticated!
 *      422:
 *        description: Invalid inputs!
*/
router.post(
  "/add",
  [isLibrarianAuth, imageUpload("public/images/").single("bookImage")],
  addBook
);

/** 
 * @swagger
 * /api/book/update/{id}:
 *  patch:
 *    description: Update the book
 *    tags:
 *    - Librarian
 *    parameters:
 *      - in: header
 *        name: Authorization
 *        description: Bearer token
 *        type: string
 *        required: true
 *      - in: path
 *        name: id
 *        description: Book id
 *        type: string
 *        required: true
 *      - in: formData
 *        name: bookName
 *        description: The name of book
 *        type: string
 *        required: true
 *      - in: formData
 *        name: author
 *        description: The author of book
 *        type: string
 *        required: true
 *      - in: formData
 *        name: genre
 *        description: The genre of book
 *        type: string
 *        required: true
 *      - in: formData
 *        name: releaseDate
 *        description: The release date of book
 *        type: string
 *        format: date
 *        required: true
 *      - in: formData
 *        name: bookImage
 *        description: The image of book
 *        type: file
 *        required: true
 *    responses:
 *      201:
 *        description: Book updated successfully!
 *      401:
 *        description: Not Authenticated!
 *      422:
 *        description: Invalid inputs!
*/
router.patch(
  "/update/:id",
  [isLibrarianAuth, imageUpload("public/images/").single("bookImage")],
  updateBook
);

/** 
 * @swagger
 * /api/book/delete/{id}:
 *  delete:
 *    description: Delete the book
 *    tags:
 *    - Librarian
 *    parameters:
 *      - in: header
 *        name: Authorization
 *        description: Bearer token
 *        type: string
 *        required: true
 *      - in: path
 *        name: id
 *        description: Book id
 *        type: string
 *        required: true
 *    responses:
 *      200:
 *        description: Book deleted successfully!
 *      401:
 *        description: Not Authenticated!
 *      422:
 *        description: Invalid inputs!
*/
router.delete("/delete/:id", isLibrarianAuth, deleteBook);

/** 
 * @swagger
 * /api/book/status/{id}:
 *  patch:
 *    description: Update the book status
 *    tags:
 *    - Librarian
 *    parameters:
 *      - in: header
 *        name: Authorization
 *        description: Bearer token
 *        type: string
 *        required: true
 *      - in: path
 *        name: id
 *        description: Book id
 *        type: string
 *        required: true
 *      - in: body
 *        name: Book Status
 *        schema:
 *          type: object
 *          required:
 *            - status
 *          properties:
 *            status:
 *              type: boolean
 *              default: true
 *    responses:
 *      201:
 *        description: Book status successfully!
 *      401:
 *        description: Not Authenticated!
 *      404:
 *        description: Book not exist!
 *      400:
 *        description: Book status not updated!
 *      422:
 *        description: Status should be boolean (i.e true or false)!
*/
router.patch("/status/:id", isLibrarianAuth, changeBookStatus);

/** 
 * @swagger
 * /api/book:
 *  get:
 *    description: Get all books only student
 *    tags:
 *    - Student
 *    parameters:
 *      - in: header
 *        name: Authorization
 *        description: Bearer token
 *        type: string
 *        required: true
 *    responses:
 *      200:
 *        description: Book found!
 *        schema:
 *          type: array
 *          items:
 *          $ref: "#/definitions/Book"
 *      404:
 *        description: No data found!
 *      401:
 *        description: Not Authenticated!
*/
router.get("/", isStudentAuth, getBooks);

/** 
 * @swagger
 * /api/book/{id}:
 *  get:
 *    description: Get a single book only student
 *    tags:
 *    - Student
 *    parameters:
 *      - in: header
 *        name: Authorization
 *        description: Bearer token
 *        type: string
 *        required: true
 *      - in: path
 *        name: id
 *        description: Book id
 *        type: string
 *        required: true
 *    responses:
 *      200:
 *        description: Book found!
 *        schema:
 *          $ref: "#/definitions/Book"
 *      404:
 *        description: Book not exists!
 *      400:
 *        description: Get a book failed!
 *      401:
 *        description: Not Authenticated!
*/
router.get("/:id", isStudentAuth, getBookById);

module.exports = router;
