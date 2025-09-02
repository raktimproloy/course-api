const { body, validationResult } = require('express-validator');

/**
 * Validation rules for creating/updating courses
 */
const courseValidationRules = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  
  body('batchName')
    .trim()
    .notEmpty()
    .withMessage('Batch name is required'),
  
  body('description')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters long'),
  
  body('slug')
    .trim()
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug can only contain lowercase letters, numbers, and hyphens'),
  
  body('imageUrl')
    .trim()
    .isURL()
    .withMessage('Image URL must be a valid URL'),
  
  body('courseType')
    .trim()
    .notEmpty()
    .withMessage('Course type is required'),
  
  body('upcomingCourse')
    .isIn([0, 1])
    .withMessage('Upcoming course must be either 0 or 1'),
  
  body('statistics.price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('statistics.originalPrice')
    .isFloat({ min: 0 })
    .withMessage('Original price must be a positive number'),
  
  body('instructors')
    .isArray({ min: 1 })
    .withMessage('At least one instructor is required'),
  
  body('instructors.*.name')
    .trim()
    .notEmpty()
    .withMessage('Instructor name is required'),
  
  body('instructors.*.role')
    .trim()
    .notEmpty()
    .withMessage('Instructor role is required'),
  
  body('instructors.*.bio')
    .trim()
    .notEmpty()
    .withMessage('Instructor bio is required'),
  
  body('instructors.*.imageUrl')
    .trim()
    .isURL()
    .withMessage('Instructor image URL must be a valid URL'),
  
  body('courseFeatures')
    .isArray({ min: 1 })
    .withMessage('At least one course feature is required'),
  
  body('courseFeatures.*')
    .trim()
    .notEmpty()
    .withMessage('Course feature cannot be empty'),
  
  body('courseModules')
    .isArray({ min: 1 })
    .withMessage('At least one course module is required'),
  
  body('courseModules.*.title')
    .trim()
    .notEmpty()
    .withMessage('Module title is required'),
  
  body('courseModules.*.lessons')
    .isArray({ min: 1 })
    .withMessage('At least one lesson is required per module'),
  
  body('courseModules.*.lessons.*')
    .trim()
    .notEmpty()
    .withMessage('Lesson content cannot be empty'),
  
  body('assignments.*')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Assignment content cannot be empty'),
  
  body('projects.*')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Project content cannot be empty')
];

/**
 * Validation rules for updating courses (some fields optional)
 */
const courseUpdateValidationRules = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  
  body('batchName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Batch name cannot be empty'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters long'),
  
  body('slug')
    .optional()
    .trim()
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug can only contain lowercase letters, numbers, and hyphens'),
  
  body('imageUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('Image URL must be a valid URL'),
  
  body('courseType')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Course type cannot be empty'),
  
  body('upcomingCourse')
    .optional()
    .isIn([0, 1])
    .withMessage('Upcoming course must be either 0 or 1'),
  
  body('statistics.price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('statistics.originalPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Original price must be a positive number'),
  
  body('instructors')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one instructor is required'),
  
  body('courseFeatures')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one course feature is required'),
  
  body('courseModules')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one course module is required')
];

/**
 * Middleware to handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

module.exports = {
  courseValidationRules,
  courseUpdateValidationRules,
  handleValidationErrors
};
