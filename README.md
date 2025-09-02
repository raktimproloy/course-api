# Course Management API

A robust backend API for managing courses with full CRUD operations, built with Node.js, Express, and MongoDB.

## 🚀 Features

- **Full CRUD Operations** for courses
- **JWT Authentication** with admin role verification
- **Data Validation** using express-validator
- **Pagination & Filtering** for course listings
- **Search Functionality** across course titles and descriptions
- **Comprehensive Error Handling**
- **Rate Limiting** for API protection
- **Security Headers** with helmet
- **MongoDB Integration** with Mongoose ODM

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **Security**: helmet, cors, express-rate-limit

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## 🚀 Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd course-management-api
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/course_management
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=30d
```

### 4. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# Start MongoDB service
mongod
```

### 5. Run the application
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:5000`

## 📚 API Endpoints

### Authentication
All protected routes require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Course Management

#### 1. Create Course
```http
POST /api/courses
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete Web Development Bootcamp",
  "batchName": "Batch 2024",
  "description": "Learn web development from scratch to advanced concepts",
  "slug": "web-development-bootcamp-2024",
  "imageUrl": "https://example.com/course-image.jpg",
  "courseType": "Programming",
  "upcomingCourse": 0,
  "statistics": {
    "enrolledStudents": 0,
    "moduleCount": 0,
    "projectCount": 0,
    "assignmentCount": 0,
    "price": 99.99,
    "originalPrice": 199.99
  },
  "instructors": [
    {
      "name": "John Doe",
      "role": "Senior Web Developer",
      "bio": "10+ years of experience in web development",
      "imageUrl": "https://example.com/instructor.jpg"
    }
  ],
  "courseFeatures": [
    "Lifetime access",
    "Certificate of completion",
    "24/7 support"
  ],
  "courseModules": [
    {
      "title": "HTML & CSS Fundamentals",
      "lessons": [
        "Introduction to HTML",
        "HTML Structure",
        "CSS Basics",
        "Responsive Design"
      ]
    }
  ],
  "assignments": [
    "Build a portfolio website",
    "Create a responsive layout"
  ],
  "projects": [
    "E-commerce website",
    "Blog application"
  ]
}
```

#### 2. Get All Courses
```http
GET /api/courses?page=1&limit=10&upcomingCourse=0&courseType=Programming&search=web
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `upcomingCourse`: Filter by upcoming status (0 or 1)
- `courseType`: Filter by course type
- `search`: Search in title and description

#### 3. Get Course by ID
```http
GET /api/courses/64f1a2b3c4d5e6f7g8h9i0j1
```

#### 4. Get Course by Slug
```http
GET /api/courses/slug/web-development-bootcamp-2024
```

#### 5. Update Course
```http
PUT /api/courses/64f1a2b3c4d5e6f7g8h9i0j1
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Course Title",
  "statistics": {
    "price": 89.99
  }
}
```

#### 6. Delete Course
```http
DELETE /api/courses/64f1a2b3c4d5e6f7g8h9i0j1
Authorization: Bearer <token>
```

## 🔐 Authentication

### JWT Token Format
```json
{
  "Authorization": "Bearer admin"
}
```

### Admin Verification
Currently, the system verifies admin access by checking if a valid JWT token exists. In production, you should implement proper role-based access control.

## 📊 Data Models

### Course Schema
```javascript
{
  title: String (required, 3-200 chars),
  batchName: String (required),
  description: String (required, min 10 chars),
  slug: String (required, unique, lowercase, alphanumeric + hyphens),
  imageUrl: String (required, valid URL),
  courseType: String (required),
  upcomingCourse: Number (0 or 1),
  statistics: {
    enrolledStudents: Number (default: 0),
    moduleCount: Number (default: 0),
    projectCount: Number (default: 0),
    assignmentCount: Number (default: 0),
    price: Number (required, positive),
    originalPrice: Number (required, positive)
  },
  instructors: [{
    name: String (required),
    role: String (required),
    bio: String (required),
    imageUrl: String (required, valid URL)
  }],
  courseFeatures: [String] (required, min 1),
  courseModules: [{
    title: String (required),
    lessons: [String] (required, min 1)
  }] (required, min 1),
  assignments: [String] (optional),
  projects: [String] (optional),
  timestamps: true
}
```

## 📁 Project Structure

```
course-management-api/
├── config.js                 # Configuration and environment variables
├── server.js                 # Main server file
├── package.json             # Dependencies and scripts
├── README.md                # Project documentation
├── models/
│   └── Course.js           # Course data model
├── controllers/
│   └── courseController.js  # Course business logic
├── routes/
│   └── courseRoutes.js     # API route definitions
└── middleware/
    ├── auth.js             # Authentication middleware
    └── validation.js       # Data validation middleware
```

## 🔒 Security Features

- **JWT Authentication** for protected routes
- **Input Validation** to prevent malicious data
- **Rate Limiting** to prevent abuse
- **Security Headers** with helmet
- **CORS Configuration** for cross-origin requests
- **MongoDB Injection Protection** with Mongoose

## 🚀 Performance Features

- **Database Indexing** on frequently queried fields
- **Pagination** for large datasets
- **Efficient Queries** with proper MongoDB aggregation
- **Response Optimization** with selective field projection

## 🐛 Error Handling

The API provides comprehensive error handling:
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (missing/invalid token)
- **404**: Not Found (resource doesn't exist)
- **500**: Internal Server Error

## 📝 Validation Rules

### Required Fields
- Title (3-200 characters)
- Slug (unique, alphanumeric + hyphens)
- Price (positive number)
- At least 1 module with lessons

### Slug Uniqueness
- Automatically checked on creation and update
- Case-insensitive matching
- Prevents duplicate course URLs

## 🔄 Pagination Response Format

```json
{
  "success": true,
  "message": "Courses retrieved successfully",
  "data": {
    "courses": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "itemsPerPage": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

## 🚀 Deployment

### Environment Variables
Set these environment variables in production:
- `NODE_ENV=production`
- `JWT_SECRET`: Use a strong, unique secret
- `MONGODB_URI`: Production MongoDB connection string

### PM2 (Recommended)
```bash
npm install -g pm2
pm2 start server.js --name "course-api"
pm2 startup
pm2 save
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team

## 🔮 Future Enhancements

- User management system
- Course enrollment functionality
- Payment integration
- File upload for course materials
- Real-time notifications
- Advanced analytics dashboard
#   c o u r s e - a p i  
 