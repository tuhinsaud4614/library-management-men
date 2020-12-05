const { hash, compare } = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const sanitizeHtml = require("sanitize-html");

const User = require("../model/user");
const HttpError = require("../model/http-error");

const signup = async (req, res, next) => {
  let { email, password, userType } = req.body;
  email = email.trim();
  password = password.trim();
  userType = userType.trim();

  if (
    validator.isEmpty(email) ||
    validator.isEmpty(password) ||
    validator.isEmpty(userType)
  ) {
    return next(new HttpError("Field can't be empty!", 422));
  }

  if (
    !sanitizeHtml(email) ||
    !sanitizeHtml(password) ||
    !sanitizeHtml(userType)
  ) {
    return next(new HttpError("Some malicious or invalid inputs found!", 422));
  }

  if (!validator.isEmail(email)) {
    return next(new HttpError("Invalid email!", 422));
  }

  if (/\s+/g.test(password)) {
    return next(new HttpError("Password shouldn't contain space!", 422));
  }

  if (!validator.isLength(password, { min: 6 })) {
    return next(
      new HttpError("Password is too short! (At least 6 character)", 422)
    );
  }

  if (!["librarian", "student"].includes(userType)) {
    return next(
      new HttpError("Invalid user type (between librarian or student)!", 422)
    );
  }

  try {
    const currentUser = await User.findOne({ email: email });
    if (!currentUser) {
      const hashPassword = await hash(password, 12);
      const resUser = await new User({
        email: email,
        password: hashPassword,
        userType: userType,
      }).save();

      res.status(201).json({
        message: "User created successfully!",
        user: resUser.name,
      });
    } else {
      return next(new HttpError("User already exists!", 422));
    }
  } catch (error) {
    console.log("Create user error & error is", error);
    return next(new HttpError("User creation failed!", 400));
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const currentUser = await User.findOne({ email: email });
    if (currentUser) {
      const isMatch = await compare(password, currentUser.password);
      if (!isMatch) {
        return next(new HttpError("Wrong User credentials!", 422));
      } else {
        let secretKey = "";
        if (currentUser.userType === "librarian") {
          secretKey = process.env.SUPER_SECRET_OR_KEY_LIBRARIAN;
        } else if (currentUser.userType === "student") {
          secretKey = process.env.SUPER_SECRET_OR_KEY_STUDENT;
        }
        const token = jwt.sign(
          {
            id: currentUser._id,
            email: currentUser.email,
            userType: currentUser.userType,
          },
          secretKey,
          { expiresIn: "1h" }
        );
        res.status(200).json({
          token: token,
          userId: currentUser._id,
          userType: currentUser.userType,
        });
      }
    } else {
      return next(new HttpError("User Not Found!", 404));
    }
  } catch (error) {
    console.log("User login error & error is", error);
    return next(new HttpError("User login failed!", 401));
  }
};

exports.signup = signup;
exports.login = login;
