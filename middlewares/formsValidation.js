const { body } = require("express-validator");

const validateSignup = [
  // Username and email pending to validate

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
