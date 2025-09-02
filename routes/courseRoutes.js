const express = require('express');
const router = express.Router();

// Import controller and middleware
const {
  createCourse,
  getAllCourses,
  getCourseById,
  getCourseBySlug,
  updateCourse,
  deleteCourse,
  getCourseStats
} = require('../controllers/courseController');

const { requireAdmin } = require('../middleware/auth');
const {
  courseValidationRules,
  courseUpdateValidationRules,
  handleValidationErrors
} = require('../middleware/validation');

/**
 * POST /api/courses
 * Create a new course
 * Private (Admin only)
 */
router.post(
  '/',
  requireAdmin,
  courseValidationRules,
  handleValidationErrors,
  createCourse
);

/**
 * GET /api/courses
 * Get all courses with pagination and filtering
 * Public
 */
router.get('/', getAllCourses);

/**
 * GET /api/courses/:id
 * Get single course by ID
 * Public
 */
router.get('/:id', getCourseById);

/**
 * GET /api/courses/slug/:slug
 * Get single course by slug
 * Public
 */
router.get('/slug/:slug', getCourseBySlug);

/**
 * PUT /api/courses/:id
 * Update course by ID
 * Private (Admin only)
 */
router.put(
  '/:id',
  requireAdmin,
  courseUpdateValidationRules,
  handleValidationErrors,
  updateCourse
);

/**
 * DELETE /api/courses/:id
 * Delete course by ID
 * Private (Admin only)
 */
router.delete('/:id', requireAdmin, deleteCourse);

module.exports = router;
