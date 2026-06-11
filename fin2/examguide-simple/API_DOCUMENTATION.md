# ExamGuide Platform - API Documentation

This document provides comprehensive API documentation for the ExamGuide Platform backend services.

## Table of Contents

1. [Base URL](#base-url)
2. [Authentication](#authentication)
3. [Error Handling](#error-handling)
4. [API Endpoints](#api-endpoints)
   - [Authentication](#authentication-endpoints)
   - [Exams](#exam-endpoints)
   - [Scholarships](#scholarship-endpoints)
   - [Study Materials](#study-material-endpoints)
   - [Recommendations](#recommendation-endpoints)
   - [Notifications](#notification-endpoints)
   - [Analytics](#analytics-endpoints)
   - [Bookmarks](#bookmark-endpoints)

## Base URL

```
Development: http://localhost:8080/api
Production: https://api.examguide.com/api
```

## Authentication

All protected endpoints require JWT authentication via the `Authorization` header:

```http
Authorization: Bearer <JWT_TOKEN>
```

### Token Format

JWT tokens are valid for 24 hours (86400000 milliseconds) and contain user information and roles.

### Obtaining a Token

See [Login Endpoint](#login)

## Error Handling

### Error Response Format

```json
{
  "status": 400,
  "message": "Validation failed",
  "errorType": "VALIDATION_ERROR",
  "timestamp": "2024-03-02T10:30:00Z",
  "path": "/api/auth/login"
}
```

### Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## API Endpoints

### Authentication Endpoints

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200)**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "John Doe",
    "role": "USER"
  }
}
```

**Validation Rules**
- Email: Must be valid email format
- Password: Minimum 6 characters

---

#### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response (200)**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "fullName": "John Doe",
    "role": "USER"
  }
}
```

**Validation Rules**
- Full Name: 2-100 characters
- Email: Valid email format, unique
- Password: 6-50 characters
- Confirm Password: Must match password

---

### Exam Endpoints

#### Get All Exams

```http
GET /api/exams
Authorization: Bearer <token>
```

**Response (200)**
```json
[
  {
    "id": 1,
    "name": "UPSC Civil Services",
    "conductingBody": "UPSC",
    "category": "CivilServices",
    "level": "High",
    "mode": "Online",
    "examDate": "2024-06-15",
    "deadline": "2024-05-15",
    "totalMarks": 1000,
    "isFeatured": true,
    "viewCount": 250
  }
]
```

---

#### Get Exam by ID

```http
GET /api/exams/{examId}
Authorization: Bearer <token>
```

**Response (200)**
```json
{
  "id": 1,
  "name": "UPSC Civil Services",
  "conductingBody": "UPSC",
  "officialWebsite": "https://www.upsconline.nic.in",
  "category": "CivilServices",
  "level": "High",
  "mode": "Online",
  "applicationStartDate": "2024-04-01",
  "applicationEndDate": "2024-05-15",
  "examDate": "2024-06-15",
  "resultDate": "2024-08-15",
  "eligibilityCriteria": "Bachelor's degree",
  "examPattern": "Objective and Descriptive",
  "totalMarks": 1000,
  "duration": "2 hours",
  "syllabus": "Indian History, Geography, Politics...",
  "isFeatured": true,
  "viewCount": 250
}
```

---

#### Search Exams

```http
GET /api/exams/search?keyword=UPSC&page=0&size=10
Authorization: Bearer <token>
```

**Response (200)**
```json
{
  "content": [
    {
      "id": 1,
      "name": "UPSC Civil Services",
      "category": "CivilServices",
      "viewCount": 250
    }
  ],
  "totalElements": 1,
  "totalPages": 1,
  "currentPage": 0
}
```

---

#### Get Exams by Category

```http
GET /api/exams/category/{category}
Authorization: Bearer <token>
```

**Response (200)**
```json
[
  {
    "id": 1,
    "name": "UPSC Civil Services",
    "category": "CivilServices"
  }
]
```

---

#### Get Featured Exams

```http
GET /api/exams/featured
Authorization: Bearer <token>
```

**Response (200)**
```json
[
  {
    "id": 1,
    "name": "UPSC Civil Services",
    "isFeatured": true
  }
]
```

---

#### Create Exam (Admin Only)

```http
POST /api/exams
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "UPSC Civil Services",
  "conductingBody": "UPSC",
  "officialWebsite": "https://www.upsconline.nic.in",
  "category": "CivilServices",
  "level": "High",
  "mode": "Online",
  "eligibilityCriteria": "Bachelor's degree",
  "examPattern": "Objective and Descriptive",
  "totalMarks": 1000,
  "duration": "120 minutes",
  "isFeatured": true
}
```

**Response (201)**
```json
{
  "id": 1,
  "name": "UPSC Civil Services",
  "conductingBody": "UPSC",
  "category": "CivilServices"
}
```

---

#### Update Exam (Admin Only)

```http
PUT /api/exams/{examId}
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "UPSC Civil Services - Updated",
  "category": "CivilServices"
}
```

**Response (200)**
```json
{
  "id": 1,
  "name": "UPSC Civil Services - Updated",
  "category": "CivilServices"
}
```

---

#### Delete Exam (Admin Only)

```http
DELETE /api/exams/{examId}
Authorization: Bearer <admin_token>
```

**Response (200)**
```json
{
  "message": "Exam deleted successfully"
}
```

---

### Recommendation Endpoints

#### Get Recommendations

```http
POST /api/recommendations
Authorization: Bearer <token>
Content-Type: application/json

{
  "educationLevel": "Graduate",
  "fieldOfStudy": "B.Tech Engineering",
  "preferredExamTypes": "Engineering",
  "additionalNotes": "Interested in civil service exams"
}
```

**Response (200)**
```json
[
  {
    "examId": 1,
    "examName": "UPSC Civil Services",
    "matchPercentage": 85,
    "matchReasons": "Matches your education level; Relevant to B.Tech Engineering; Matches exam type preference"
  }
]
```

**Validation Rules**
- Education Level: Required
- Field of Study: 2-100 characters
- Preferred Exam Types: Max 200 characters
- Additional Notes: Max 500 characters

---

#### Submit Recommendation Feedback

```http
POST /api/recommendations/{examId}/feedback?feedback=like
Authorization: Bearer <token>
```

**Response (200)**
```json
{
  "message": "Thank you for your feedback"
}
```

---

### Notification Endpoints

#### Get All Notifications

```http
GET /api/notifications
Authorization: Bearer <token>
```

**Response (200)**
```json
[
  {
    "id": 1,
    "userId": 1,
    "title": "Exam Deadline Reminder",
    "message": "UPSC Civil Services application deadline is on 2024-05-15",
    "type": "REMINDER",
    "isRead": false,
    "createdAt": "2024-03-02T10:30:00Z"
  }
]
```

---

#### Get Unread Notifications

```http
GET /api/notifications/unread
Authorization: Bearer <token>
```

**Response (200)**
```json
[
  {
    "id": 1,
    "title": "Exam Deadline Reminder",
    "isRead": false
  }
]
```

---

#### Get Unread Count

```http
GET /api/notifications/unread-count
Authorization: Bearer <token>
```

**Response (200)**
```json
{
  "unreadCount": 3
}
```

---

#### Mark as Read

```http
PUT /api/notifications/{notificationId}/read
Authorization: Bearer <token>
```

**Response (200)**
```json
{
  "message": "Notification marked as read"
}
```

---

#### Delete Notification

```http
DELETE /api/notifications/{notificationId}
Authorization: Bearer <token>
```

**Response (200)**
```json
{
  "message": "Notification deleted"
}
```

---

### Bookmark Endpoints

#### Get Bookmarked Exams

```http
GET /api/bookmarks/exams
Authorization: Bearer <token>
```

**Response (200)**
```json
[
  {
    "id": 1,
    "name": "UPSC Civil Services",
    "category": "CivilServices"
  }
]
```

---

#### Get Bookmarked Scholarships

```http
GET /api/bookmarks/scholarships
Authorization: Bearer <token>
```

**Response (200)**
```json
[
  {
    "id": 1,
    "name": "Merit Scholarship",
    "provider": "Government of India"
  }
]
```

---

#### Add Exam Bookmark

```http
POST /api/bookmarks/exams/{examId}
Authorization: Bearer <token>
```

**Response (200)**
```json
{
  "message": "Exam bookmarked successfully"
}
```

---

#### Remove Exam Bookmark

```http
DELETE /api/bookmarks/exams/{examId}
Authorization: Bearer <token>
```

**Response (200)**
```json
{
  "message": "Exam removed from bookmarks"
}
```

---

#### Check if Exam is Bookmarked

```http
GET /api/bookmarks/exams/{examId}/status
Authorization: Bearer <token>
```

**Response (200)**
```json
{
  "isBookmarked": true
}
```

---

### Analytics Endpoints (Admin Only)

#### Get Today's Analytics

```http
GET /api/analytics/today
Authorization: Bearer <admin_token>
```

**Response (200)**
```json
{
  "dateRecorded": "2024-03-02",
  "newUserRegistrations": 5,
  "examViews": 150,
  "scholarshipViews": 30,
  "materialDownloads": 20,
  "recommendationsGenerated": 10,
  "positiveFeedback": 8,
  "negativeFeedback": 1,
  "totalActiveUsers": 1000
}
```

---

#### Get Analytics Range

```http
GET /api/analytics/range?start=2024-02-24&end=2024-03-02
Authorization: Bearer <admin_token>
```

**Response (200)**
```json
[
  {
    "dateRecorded": "2024-02-24",
    "newUserRegistrations": 5,
    "examViews": 150
  },
  {
    "dateRecorded": "2024-03-02",
    "newUserRegistrations": 6,
    "examViews": 160
  }
]
```

---

## Rate Limiting

- `100` requests per minute per API key
- `1000` requests per hour per IP

## Pagination

List endpoints support pagination:

```http
GET /api/exams?page=0&size=10&sort=name,asc
```

Parameters:
- `page`: Zero-based page number (default: 0)
- `size`: Page size (default: 20, max: 100)
- `sort`: Sort field and direction (default: id,asc)

## Changelog

### Version 1.0.0 (2024-03-02)

- Initial API release
- Authentication endpoints
- Exam management endpoints
- Scholarship endpoints
- Recommendation engine
- Notification system
- Analytics endpoints
- Bookmark functionality

---

**Last Updated**: 2024-03-02  
**API Version**: 1.0.0
