const db = require("../db/queries");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const passport = require("passport");

async function getLoginForm(req, res) {
  const messages = req.session.messages || [];
  const errorMessage =
    messages.length > 0 ? messages[messages.length - 1] : null;
  req.session.messages = [];
  return res.render("login", { errorMessage });
}

async function getSignupForm(req, res) {
  return res.render("signup", { formData: {} });
}

async function postSignupForm(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("signup", {
      errors: errors.array(),
      formData: req.body,
    });
  }
  const { username, email, password, confirmPassword } = req.body;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  await db.createUser(username, email, hashedPassword);
  res.redirect("/login");
}

async function getIndex(req, res) {
  res.render("index", { user: req.user });
}

async function logoutUser(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
}

async function postUploadFileForm(req, res) {
  const { filename, size, path } = req.file;
  console.log("Uploaded file details:", { filename, size, path });
  res.redirect("/");
}

module.exports = {
  getLoginForm,
  getSignupForm,
  postSignupForm,
  getIndex,
  logoutUser,
  postUploadFileForm,
};
