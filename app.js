require("dotenv").config();
const prisma = require("./lib/prisma");
const express = require("express");
const path = require("node:path");
const session = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const passport = require("./config/passport");
const indexRouter = require("./routes/indexRouter");
const { getFileIcon } = require("./public/js/fileTypeCheck");
const { formatFileSize } = require("./public/js/formatFileSize");

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use("/", indexRouter);
app.locals.getFileIcon = getFileIcon;
app.locals.formatFileSize = formatFileSize;

app.use((req, res, next) => {
  const err = new Error("Page Not Found");
  err.status = 404;
  next(err);
});
app.use((err, req, res, next) => {
  console.log("Faillling URL:", req.originalUrl);
  if (err.status !== 404) {
    console.error("Server Error:", err.stack);
  }

  const status = err.status || err.statusCode || 500;
  res.status(status).render("errors", {
    status: status,
    message:
      status === 500
        ? "A server error ocurred. Please try again later"
        : err.message || "An unexpected error ocurred",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
