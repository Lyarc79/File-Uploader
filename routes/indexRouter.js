const { Router } = require("express");
const indexController = require("../controllers/indexController");
const { validateSignup } = require("../middlewares/formsValidation");

const indexRouter = Router();

indexRouter.get("/login", indexController.getLoginForm);
indexRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureMessage: true,
  }),
);
indexRouter.get("/signup", indexController.getSignupForm);
indexRouter.post("/signup", validateSignup, indexController.postSignupForm);

module.exports = indexRouter;
