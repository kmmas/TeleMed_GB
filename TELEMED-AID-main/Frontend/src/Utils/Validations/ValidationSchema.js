import Joi from "joi";

const NameValidation = (name) => {
  return Joi.string()
    .min(3)
    .max(35)
    .pattern(/^(?!\s*$)[A-Za-z\s]+$/) // Allows only letters and spaces, and not spaces only
    .required()
    .messages({
      "string.min": `${name} must be at least three characters`,
      "string.max": `${name} exceeds the maximum length of 35 characters`,
      "string.pattern.base": `${name} cannot contain special characters or numeric values`,
      "any.required": `${name} is required`,
      "string.empty": `${name} is required`,
    });
};
const NameAndNumberValidation = (name) => {
  return Joi.string()
    .min(3)
    .max(35)
    .required()
    .messages({
      "string.min": `${name} must be at least three characters`,
      "string.max": `${name} exceeds the maximum length of 35 characters`,
      "any.required": `${name} is required`,
      "string.empty": `${name} is required`,
    });
};


const PhoneValidation = (name) => {
    return Joi.string()
      .pattern(/^[0-9]{6,12}$/)
      .required()
      .messages({
        "string.pattern.base": `${name} must contain 6 to 12 digits`,
        "any.required": `${name} is required`,
        "string.empty": `${name} is required`,
      });
  };
  const PasswordValidation = (name) => {
    return Joi.string()
      .min(8) // Ensure password is at least 8 characters long
      .max(20) // Ensure password is at most 20 characters long
      .required()
      .messages({
        "string.min": `${name} must be at least 8 characters`,
        "string.max": `${name} must not exceed 20 characters`,
        "any.required": `${name} is required`,
        "string.empty": `${name} is required`,
      });
  };




const NationalIdValidation = (name) => {
    return Joi.string()
      .pattern(/^[0-9]{3,35}$/)  // Ensures only digits and length between 3-35
      .min(14)  // Ensure it's at least 14 digits
      .required()  // Required field
      .messages({
        'string.pattern.base': `${name} must only contain numbers and no special characters`,
        'string.min': `${name} must be at least 14 digits long`,  // Custom error if less than 14 digits
        'any.required': `${name} is required`,
        'string.empty': `${name} is required`,
      });
  };



const EmailValidation = Joi.string()
  .email({ tlds: { allow: false } })
  .required()
  .messages({
    "string.email": "Invalid Email",
    "any.required": "Email is required",
    "string.empty": "Email is required",
  });

const WithoutValidation = Joi.any();

const DropDownValidation = (option, isArray = true) => {
  return isArray
    ? Joi.array()
        .length(1) // Ensures exactly one element in the array
        .items(Joi.string().invalid(`Select ${option}`)) // Validate the single element
        .required()
        .messages({
          "array.length": `Only one ${option} must be selected`,
          "any.invalid": `${option} is required`,
        })
    : Joi.string()
        .invalid(`Select ${option}`) // Prevent default invalid option
        .required()
        .messages({
          "string.empty": `${option} is required`,
          "any.invalid": `${option} is required`,
        });
};
// Validates that the date must be now or in the past (i.e. not a future date)
const pastOrNowDateValidation = Joi.date().max("now").required().messages({
  "date.max": "Date must in the past",
  "any.required": "Date is required",
  "date.base": "Date is required",
});

// Validates that the date must be now or in the future (i.e. not a past date)
const NowOrLaterDateValidation = Joi.date().min("now").required().messages({
  "date.min": "Date must in the future",
  "any.required": "Date is required",
  "date.base": "Invalid date format",
});


export {
  NameValidation,
  EmailValidation,
  DropDownValidation,
  NationalIdValidation,
  PhoneValidation,
  PasswordValidation,
  WithoutValidation,
  pastOrNowDateValidation,
  NowOrLaterDateValidation,
  NameAndNumberValidation,
};
