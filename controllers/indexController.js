const db = require("../db/queries");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const passport = require("passport");
const supabase = require("../lib/supabase");

const allowedMimeTypes = [
  "text/plain",
  "text/csv",
  "application/msword",
  "application/pdf",
  "application/vnd.ms-excel",
  "image/jpeg",
  "image/png",
  "image/webp",
];

// Helper funcs
async function renderIndexInfo(req, res, errors = null) {
  const folders = await db.getFolders(req.user.id);
  const files = await db.getRootFiles(req.user.id);
  return res.render("index", {
    user: req.user,
    folders,
    files,
    errors: errors,
    uploadAction: "/upload",
  });
}

async function validateFile(file) {
  if (!file) {
    return "No file uploaded or field name mismatch.";
  }
  const { size, mimetype } = file;
  const fileSizeInMB = size / 1024 / 1024;
  if (fileSizeInMB > 10) {
    return "The maximum file size allowed is 10MB.";
  }
  if (!allowedMimeTypes.includes(mimetype)) {
    return "That file format is not allowed.";
  }
  return null;
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
  const validationError = await validateFile(req.file);
  if (validationError) {
    return res.status(400).send(validationError);
  }

  const folderId = req.params.id ? parseInt(req.params.id) : null;
  const { originalname, buffer, size, mimetype } = req.file;
  const filePath = folderId ? `${folderId}/${originalname}` : originalname;

  const { data, error } = await supabase.storage
    .from("uploads")
    .upload(filePath, buffer, { contentType: mimetype, upsert: true });

  if (error) {
    console.error("Supabase upload error:", error);
    return res.status(500).send("File upload failed.");
  } else {
    await db.uploadFile(filePath, originalname, size, folderId, req.user.id);
  }
  if (folderId) {
    return res.redirect(`/folders/${folderId}`);
  }
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

async function getFolderDetails(req, res) {
  const folder = await db.getFolderById(req.params.id);
  const folders = await db.getFolders(req.user.id);
  res.render("folderDetails", {
    folder,
    folders,
    uploadAction: `/folders/${folder.id}/upload`,
  });
}

async function postDeleteFile(req, res) {
  const deletedFile = await db.deleteFile(req.params.id);
  if (deletedFile.folderId) {
    return res.redirect(`/folders/${deletedFile.folderId}`);
  }
  res.redirect("/");
}

async function downloadFile(req, res) {
  const file = await db.getFileById(req.params.id);
  const { data, error } = await supabase.storage
    .from("uploads")
    .download(file.path);
  if (error) {
    console.error("Supabase download error:", error);
    return res.status(500).send("File download failed.");
  }
  const buffer = Buffer.from(await data.arrayBuffer());
  res.setHeader("Content-Disposition", `attachment; filename="${file.name}`);
  res.send(buffer);
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
  getFolderDetails,
  postDeleteFile,
  downloadFile,
};
