import { body } from "express-validator";

export const userRegisterValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLowercase()
      .withMessage("Username must be lowercase")
      .isLength({ min: 2 })
      .withMessage("Username must be at lease 3 characters long"),
      body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required"),
    body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 4 , max: 16})
    .withMessage("Password must be between 8 to 16 characters long")
  ];
};

export const userLoginValidator = () => {
    return [
      body("usernameOrEmail").trim().notEmpty().withMessage("Email or Username is required"),
      body("password").notEmpty().withMessage("Password is required"),
    ];
  };

