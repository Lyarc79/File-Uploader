const db = require("../db/queries");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const passport = require("passport");

// Helper funcs
async function renderIndexInfo(req, res, errors = null) {
  const folders = await db.getFolders(req.user.id);
  return res.render("index", {
    user: req.user,
    folders,
    errors: errors,
  });
}

// Normal handlers
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
  return renderIndexInfo(req, res);
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

async function postCreateFolder(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return renderIndexInfo(req, res, errors.array());
  }
  await db.createFolder(req.body.name, req.user.id);
  res.redirect("/");
}

async function postUpdateFolder(req, res) {
  await db.updateFolderName(req.body.name, req.params.id);
  res.redirect("/");
}

async function postDeleteFolder(req, res) {
  await db.deleteFolder(req.params.id);
  res.redirect("/");
}

module.exports = {
  getLoginForm,
  getSignupForm,
  postSignupForm,
  getIndex,
  logoutUser,
  postUploadFileForm,
  postCreateFolder,
  postUpdateFolder,
  postDeleteFolder,
};
