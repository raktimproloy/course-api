const Course = require('../models/Course');

/**
 * Create a new course
 * POST /api/courses
 */
const createCourse = async (req, res) => {
  try {
    const {
      title,
      batchName,
      description,
      slug,
      imageUrl,
      courseType,
      upcomingCourse,
      statistics,
      instructors,
      courseFeatures,
      courseModules,
      assignments,
      projects
    } = req.body;

    // Check if slug already exists
    const isSlugUnique = await Course.isSlugUnique(slug);
    if (!isSlugUnique) {
      return res.status(400).json({
        success: false,
        message: 'Slug already exists. Please choose a different slug.'
      });
    }

    // Create new course
    const course = new Course({
      title,
      batchName,
      description,
      slug,
      imageUrl,
      courseType,
      upcomingCourse,
      statistics,
      instructors,
      courseFeatures,
      courseModules,
      assignments: assignments || [],
      projects: projects || []
    });

    const savedCourse = await course.save();

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: savedCourse
    });
  } catch (error) {
    console.error('Create course error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Slug already exists. Please choose a different slug.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create course',
      error: error.message
    });
  }
};

/**
 * Get all courses with pagination
 * GET /api/courses
 */
const getAllCourses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    
    // Filter by upcoming course status
    if (req.query.upcomingCourse !== undefined) {
      query.upcomingCourse = parseInt(req.query.upcomingCourse);
    }

    // Filter by course type
    if (req.query.courseType) {
      query.courseType = req.query.courseType;
    }

    // Search by title or description
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Get total count
    const total = await Course.countDocuments(query);

    // Get courses with pagination
    const courses = await Course.find(query)
      .select('-__v')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      success: true,
      message: 'Courses retrieved successfully',
      data: {
        courses,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage,
          hasPrevPage
        }
      }
    });
  } catch (error) {
    console.error('Get all courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve courses',
      error: error.message
    });
  }
};

/**
 * Get single course by ID
 * GET /api/courses/:id
 */
const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID format'
      });
    }

    const course = await Course.findById(id).select('-__v');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Course retrieved successfully',
      data: course
    });
  } catch (error) {
    console.error('Get course by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve course',
      error: error.message
    });
  }
};

/**
 * Get single course by slug
 * GET /api/courses/slug/:slug
 */
const getCourseBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: 'Slug is required'
      });
    }

    const course = await Course.findOne({ slug }).select('-__v');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Course retrieved successfully',
      data: course
    });
  } catch (error) {
    console.error('Get course by slug error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve course',
      error: error.message
    });
  }
};

/**
 * Update course by ID
 * PUT /api/courses/:id
 */
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID format'
      });
    }

    // Check if course exists
    const existingCourse = await Course.findById(id);
    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check slug uniqueness if slug is being updated
    if (updateData.slug && updateData.slug !== existingCourse.slug) {
      const isSlugUnique = await Course.isSlugUnique(updateData.slug, id);
      if (!isSlugUnique) {
        return res.status(400).json({
          success: false,
          message: 'Slug already exists. Please choose a different slug.'
        });
      }
    }

    // Add updated timestamp
    updateData.updatedAt = new Date();

    // Update course
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true, 
        runValidators: true,
        select: '-__v'
      }
    );

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: updatedCourse
    });
  } catch (error) {
    console.error('Update course error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Slug already exists. Please choose a different slug.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update course',
      error: error.message
    });
  }
};

/**
 * Delete course by ID
 * DELETE /api/courses/:id
 */
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID format'
      });
    }

    // Check if course exists
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Delete course
    await Course.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
      data: {
        id: course._id,
        title: course.title,
        slug: course.slug
      }
    });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete course',
      error: error.message
    });
  }
};


module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  getCourseBySlug,
  updateCourse,
  deleteCourse
};
