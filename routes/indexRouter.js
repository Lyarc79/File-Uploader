const { Router } = require("express");
const indexController = require("../controllers/indexController");
const { validateSignup } = require("../middlewares/formsValidation");
const passport = require("passport");
const { isGuest, isAuth } = require("../middlewares/login-check");
const upload = require("../config/multer");

const indexRouter = Router();

indexRouter.get("/", isAuth, indexController.getIndex);
indexRouter.get("/login", isGuest, indexController.getLoginForm);
indexRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureMessage: true,
  }),
);
indexRouter.get("/signup", isGuest, indexController.getSignupForm);
indexRouter.post("/signup", validateSignup, indexController.postSignupForm);
indexRouter.get("/logout", indexController.logoutUser);
indexRouter.post(
  "/upload",
  upload.single("uploadedFile"),
  indexController.postUploadFileForm,
);

module.exports = indexRouter;
