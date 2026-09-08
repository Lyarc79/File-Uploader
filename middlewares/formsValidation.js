const { body } = require("express-validator");

const validateSignup = [
  body("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be longer than 3 characters."),

  body("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Enter a valid email address (e.g. username@mail.com)."),

  body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Password must be longer than 5 characters."),

  body("confirmPassword")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Passwords don't match."),
];

module.exports = {
  validateSignup,
};
