const path = require("path");
const { unlink } = require("fs");
const express = require("express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const { connect } = require("mongoose");
const { json, urlencoded } = require("body-parser");

const HttpError = require("./model/http-error");
const userRoutes = require("./routes/user-routes");
const bookRoutes = require("./routes/book-routes");

const app = express();

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Library Management Api",
      version: "1.0.0",
    },
    tags: [
      {
        name: "User",
      },
      {
        name: "Student",
      },
      {
        name: "Librarian",
      },
    ],
  },
  apis: ["./routes/book-routes.js", "./routes/user-routes.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use(express.static(path.join(__dirname, "public")));

app.use(urlencoded({ extended: false }));
app.use(json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH, DELETE");
  next();
});

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));
app.use("/api/user", userRoutes);
app.use("/api/book", bookRoutes);

// no route found middleware
app.use((req, res, next) => {
  next(new HttpError("Could not find this route.", 404));
});

// Http error handling middleware
app.use((err, req, res, next) => {
  if (req.file) {
    unlink(req.file.path, (err) => {
      console.log("File Error", err);
    });
  }

  if (err && err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      errors: {
        status: 400,
        message: err.message,
      },
    });
  }

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.code || 500).json({
    errors: {
      status: err.code || 500,
      message: err.message || "An unknown error occurred!",
    },
  });
});

const port = process.env.PORT || 3000;
const MONGODB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wrnje.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
})
  .then(() => {
    console.log("Database connected");
    app.listen(port, () => {
      console.log(`App running on ${port}`);
    });
  })
  .catch((err) => {
    console.log(`Database connection failed & the err is ${err}`);
  });
