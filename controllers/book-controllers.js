const { unlink } = require("fs");
const path = require("path");
const validator = require("validator");
const sanitizeHtml = require("sanitize-html");

const Book = require("../model/book");
const HttpError = require("../model/http-error");

const removeImage = (file) => {
  file = path.join(__dirname, "..", "public", file);
  unlink(file, (err) => {
    console.log("Image remove error", err);
  });
};

const validatorHelper = (bookName, author, genre, releaseDate, bookImage) => {
  if (
    validator.isEmpty(bookName) ||
    validator.isEmpty(author) ||
    validator.isEmpty(genre) ||
    validator.isEmpty(releaseDate) ||
    validator.isEmpty(bookImage)
  ) {
    return new HttpError("Field can't be empty!", 422);
  }

  if (
    !sanitizeHtml(bookName) ||
    !sanitizeHtml(author) ||
    !sanitizeHtml(releaseDate)
  ) {
    return new HttpError("Some malicious or invalid inputs found!", 422);
  }

  if (!validator.isDate(releaseDate)) {
    return new HttpError("Invalid release date format (i.e. YYYY/MM/DD)", 422);
  }

  return null;
};

const addBook = async (req, res, next) => {
  let { bookName, author, genre, releaseDate } = req.body;
  let bookImage = req.file.filename;

  bookName = bookName.trim().toLowerCase();
  author = author.trim().toLowerCase();
  genre = genre.trim().toLowerCase();
  releaseDate = releaseDate.trim();

  const isV = validatorHelper(bookName, author, genre, releaseDate, bookImage);
  if (isV !== null) {
    return next(isV);
  }

  try {
    const book = await Book.findOne({
      bookName: bookName,
      author: author,
    });

    if (book) {
      return next(new HttpError("This book already exists!", 422));
    }
    const newBook = await new Book({
      bookName: bookName,
      author: author,
      genre: genre,
      releaseDate: releaseDate,
      bookImage: `images/${bookImage}`,
    }).save();

    res.status(201).json({
      message: "Book created successfully!",
      id: newBook._id,
    });
  } catch (err) {
    console.log("Error to add book", err);
  }
};

const updateBook = async (req, res, next) => {
  const id = req.params.id;
  let { bookName, author, genre, releaseDate } = req.body;
  let bookImage = req.file.filename;

  bookName = bookName.trim().toLowerCase();
  author = author.trim().toLowerCase();
  genre = genre.trim().toLowerCase();
  releaseDate = releaseDate.trim();

  const isV = validatorHelper(bookName, author, genre, releaseDate, bookImage);
  if (isV !== null) {
    return next(isV);
  }

  let book;
  try {
    book = await Book.findById(id);
  } catch (err) {
    return next(new HttpError("Book not updated!", 401));
  }

  if (!book) {
    return next(new HttpError("Book not exists!", 404));
  }

  const oldImage = book.bookImage;
  book.bookName = bookName;
  book.author = author;
  book.genre = genre;
  book.releaseDate = releaseDate;
  book.bookImage = `images/${bookImage}`;

  try {
    await book.save();
    removeImage(oldImage);
  } catch (err) {
    return next(new HttpError("Book not updated!", 401));
  }

  res.status(201).json({
    message: "Book updated successfully!",
    data: {
      id: book._id,
      bookName: book.bookName,
      author: book.author,
      genre: book.genre,
      releaseDate: book.releaseDate,
      bookImage: book.bookImage,
    },
  });
};

const deleteBook = async (req, res, next) => {
  const id = req.params.id;
  try {
    const book = await Book.findById({ _id: id });
    const oldImage = book.bookImage;
    await book.remove();
    removeImage(oldImage);
    res.status(200).json({
      message: "Book deleted successfully!",
      id: book._id,
    });
  } catch (err) {
    console.log("Delete Book error & error is", err);
    return next(new HttpError("Book deletion failed!", 400));
  }
};

const changeBookStatus = async (req, res, next) => {
  const { status } = req.body;

  if (![true, false].includes(status)) {
    return next(
      new HttpError("Status should be boolean (i.e true or false)!", 422)
    );
  }
  Book.findOneAndUpdate(
    { _id: req.params.id },
    {
      active: status,
    },
    (err, updatedBook) => {
      if (err) {
        return next(new HttpError("Book not updated!", 400));
      }
      if (!updatedBook) {
        return next(new HttpError("Book not exists!", 404));
      }
      res.status(201).json({
        message: "Book status updated successfully!",
        data: {
          id: updatedBook._id,
        },
      });
    }
  );
};

const getBooks = async (req, res, next) => {
  try {
    const allBooks = await Book.find({ active: true }).exec();
    res.json(
      allBooks.map((book) => ({
        id: book._id,
        bookName: book.bookName,
        author: book.author,
        genre: book.genre,
        releaseDate: book.releaseDate,
        bookImage: book.bookImage,
      }))
    );
  } catch (error) {
    console.log("Fetching Books error & error is", error);
    return next(new HttpError("No data found!", 404));
  }
};

const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findOne({ _id: req.params.id, active: true });
    if (!book) {
      return next(new HttpError("Book not exists!", 404));
    }

    res.status(200).json({
      id: book._id,
      bookName: book.bookName,
      author: book.author,
      genre: book.genre,
      releaseDate: book.releaseDate,
      bookImage: book.bookImage,
    });
  } catch (err) {
    console.log("Get By Id error & error is", err);
    return next(new HttpError("Get a book failed!", 400));
  }
};

exports.addBook = addBook;
exports.updateBook = updateBook;
exports.deleteBook = deleteBook;
exports.changeBookStatus = changeBookStatus;
exports.getBooks = getBooks;
exports.getBookById = getBookById;
