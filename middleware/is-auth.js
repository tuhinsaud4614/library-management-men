const jwt = require("jsonwebtoken");
const HttpError = require("../model/http-error");

const isStudentAuth = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  if (!req.get("Authorization")) {
    return next(new HttpError("Not Authenticated", 401));
  }
  const token = req.get("Authorization").split(" ")[1];

  try {
    let decodedToken = jwt.verify(
      token,
      process.env.SUPER_SECRET_OR_KEY_STUDENT
    );

    if (decodedToken) {
      req.userId = decodedToken.id;
      next();
    } else {
      return next(new HttpError("Authentication Failed!", 401));
    }
  } catch (err) {
    return next(new HttpError("Not Authenticated", 401));
  }
};

const isLibrarianAuth = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  if (!req.get("Authorization")) {
    return next(new HttpError("User not authenticated", 401));
  }
  const token = req.get("Authorization").split(" ")[1];
  try {
    let decodedToken = jwt.verify(
      token,
      process.env.SUPER_SECRET_OR_KEY_LIBRARIAN
    );

    if (decodedToken) {
      req.userId = decodedToken.id;
      next();
    } else {
      return next(new HttpError("Authentication Failed!", 401));
    }
  } catch (err) {
    console.log(err);
    return next(new HttpError("Not authenticated", 401));
  }
};

exports.isStudentAuth = isStudentAuth;
exports.isLibrarianAuth = isLibrarianAuth;
