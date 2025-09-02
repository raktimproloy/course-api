# 📚 Course Management API

A robust and scalable backend API for managing courses with comprehensive CRUD operations, authentication, and advanced features.
---

## ✨ Features

- 🔐 **JWT Authentication** with admin role verification
- 📝 **Full CRUD Operations** for courses
- ✅ **Data Validation** using express-validator
- 🔍 **Search & Filter** functionality
- 📄 **Pagination** for optimized data loading
- 🛡️ **Security Features** (Rate limiting, CORS, Helmet)
- 🚀 **Performance Optimized** with MongoDB indexing
- 📊 **Comprehensive Error Handling**

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime Environment |
| **Express.js** | Web Framework |
| **MongoDB** | Database |
| **Mongoose** | ODM for MongoDB |
| **JWT** | Authentication |
| **express-validator** | Input Validation |
| **Helmet** | Security Headers |

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- ✅ [Node.js](https://nodejs.org/) (v14 or higher)
- ✅ [MongoDB](https://www.mongodb.com/try/download/community) (v4.4 or higher)
- ✅ npm or yarn package manager

---

## 🚀 Quick Start

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/course-management-api.git
cd course-management-api
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Environment Setup

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/course_management
```

### 4️⃣ Start MongoDB

```bash
# Make sure MongoDB is running
mongod
```

### 5️⃣ Launch the Application

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

🎉 **Your API is now running at** `http://localhost:5000`

---

## 📚 API Documentation

### 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```http
Authorization: Bearer admin
```

### 📖 Course Endpoints

| Method | Endpoint | Description | Protected |
|--------|----------|-------------|-----------|
| `POST` | `/api/courses` | Create a new course | ✅ |
| `GET` | `/api/courses` | Get all courses (with filters) | ❌ |
| `GET` | `/api/courses/:id` | Get course by ID | ❌ |
| `GET` | `/api/courses/slug/:slug` | Get course by slug | ❌ |
| `PUT` | `/api/courses/:id` | Update course | ✅ |
| `DELETE` | `/api/courses/:id` | Delete course | ✅ |

---

## 💡 Usage Examples

### Create a New Course

```javascript
// POST /api/courses
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
    "moduleCount": 12,
    "projectCount": 5,
    "assignmentCount": 15,
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
  ]
}
```

### Get Courses with Filters

```bash
# Get paginated courses with filters
GET /api/courses?page=1&limit=10
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

---

## 📁 Project Structure

```
course-management-api/
├── 📄 server.js              # Main server file
├── ⚙️ config.js              # Configuration
├── 📦 package.json           # Dependencies
├── 📖 README.md              # Documentation
├── 🗂️ models/
│   └── Course.js            # Course data model
├── 🎛️ controllers/
│   └── courseController.js   # Business logic
├── 🛣️ routes/
│   └── courseRoutes.js      # API routes
└── 🛡️ middleware/
    ├── auth.js              # Authentication
    └── validation.js        # Data validation
```

---

## 🔒 Security Features

- 🛡️ **JWT Authentication** for secure access
- ✅ **Input Validation** to prevent malicious data
- 🔐 **Security Headers** with Helmet.js
- 💉 **MongoDB Injection Protection** via Mongoose

---

## 📊 Response Format

### Success Response
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

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

<div align="center">

**⭐ Star this repository if you found it helpful!**

Made with ❤️ by [Your Name](https://github.com/your-username)

</div>

