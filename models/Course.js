const mongoose = require('mongoose');

// Instructor Schema
const instructorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Instructor name is required'],
    trim: true
  },
  role: {
    type: String,
    required: [true, 'Instructor role is required'],
    trim: true
  },
  bio: {
    type: String,
    required: [true, 'Instructor bio is required'],
    trim: true
  },
  imageUrl: {
    type: String,
    required: [true, 'Instructor image URL is required'],
    trim: true
  }
});

// Statistics Schema
const statisticsSchema = new mongoose.Schema({
  enrolledStudents: {
    type: Number,
    default: 0,
    min: 0
  },
  moduleCount: {
    type: Number,
    default: 0,
    min: 0
  },
  projectCount: {
    type: Number,
    default: 0,
    min: 0
  },
  assignmentCount: {
    type: Number,
    default: 0,
    min: 0
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  originalPrice: {
    type: Number,
    required: [true, 'Original price is required'],
    min: 0
  }
});

// Course Module Schema
const courseModuleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Module title is required'],
    trim: true
  },
  lessons: [{
    type: String,
    required: [true, 'Lesson content is required'],
    trim: true
  }]
});

// Course Schema
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  batchName: {
    type: String,
    required: [true, 'Batch name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    trim: true
  },
  slug: {
    type: String,
    required: [true, 'Course slug is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens']
  },
  imageUrl: {
    type: String,
    required: [true, 'Course image URL is required'],
    trim: true
  },
  courseType: {
    type: String,
    required: [true, 'Course type is required'],
    trim: true
  },
  upcomingCourse: {
    type: Number,
    enum: [0, 1],
    default: 0,
    required: [true, 'Upcoming course status is required']
  },
  statistics: {
    type: statisticsSchema,
    required: [true, 'Course statistics are required']
  },
  instructors: {
    type: [instructorSchema],
    required: [true, 'At least one instructor is required'],
    validate: {
      validator: function(instructors) {
        return instructors && instructors.length > 0;
      },
      message: 'At least one instructor is required'
    }
  },
  courseFeatures: {
    type: [String],
    required: [true, 'Course features are required'],
    validate: {
      validator: function(features) {
        return features && features.length > 0;
      },
      message: 'At least one course feature is required'
    }
  },
  courseModules: {
    type: [courseModuleSchema],
    required: [true, 'Course modules are required'],
    validate: {
      validator: function(modules) {
        return modules && modules.length > 0;
      },
      message: 'At least one course module is required'
    }
  },
  assignments: {
    type: [String],
    default: []
  },
  projects: {
    type: [String],
    default: []
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
courseSchema.index({ slug: 1 });
courseSchema.index({ title: 'text', description: 'text' });
courseSchema.index({ 'statistics.price': 1 });
courseSchema.index({ upcomingCourse: 1 });

// Virtual for total lessons count
courseSchema.virtual('totalLessons').get(function() {
  if (!this.courseModules) return 0;
  return this.courseModules.reduce((total, module) => {
    return total + (module.lessons ? module.lessons.length : 0);
  }, 0);
});

// Pre-save middleware to update statistics
courseSchema.pre('save', function(next) {
  if (this.courseModules && this.courseModules.length > 0) {
    this.statistics.moduleCount = this.courseModules.length;
  }
  if (this.assignments) {
    this.statistics.assignmentCount = this.assignments.length;
  }
  if (this.projects) {
    this.statistics.projectCount = this.projects.length;
  }
  next();
});

// Static method to check slug uniqueness
courseSchema.statics.isSlugUnique = async function(slug, excludeId = null) {
  const query = { slug };
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  const existingCourse = await this.findOne(query);
  return !existingCourse;
};

// Instance method to get course summary
courseSchema.methods.getSummary = function() {
  return {
    id: this._id,
    title: this.title,
    slug: this.slug,
    batchName: this.batchName,
    imageUrl: this.imageUrl,
    courseType: this.courseType,
    upcomingCourse: this.upcomingCourse,
    statistics: this.statistics,
    instructorCount: this.instructors.length,
    moduleCount: this.statistics.moduleCount,
    totalLessons: this.totalLessons
  };
};

module.exports = mongoose.model('Course', courseSchema);
