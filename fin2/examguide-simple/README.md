# ExamGuide - Simplified Version

A comprehensive full-stack application for exam preparation and scholarship discovery.

## Project Overview

ExamGuide is a web platform that helps students:
- **Browse and search exams** with detailed information
- **Discover scholarships** matching their profile
- **Access study materials** organized by exam
- **Get personalized recommendations** based on education level
- **Manage their profile** and bookmark exams

Admins can:
- **Manage users** (enable/disable/delete)
- **Create and manage exams** and scholarships
- **Upload study materials** 
- **View analytics** and statistics

## Tech Stack

### Backend
- **Framework**: Spring Boot 3.3.0
- **Security**: Spring Security with JWT Authentication
- **Database**: PostgreSQL 15
- **ORM**: Spring Data JPA with Hibernate
- **Caching**: Spring Cache with ConcurrentMapCacheManager
- **Validation**: Jakarta Validation Framework
- **Logging**: SLF4J with Logback
- **Testing**: JUnit 5, Mockito, Spring Boot Test
- **Build**: Maven 4.0.0
- **API Documentation**: Swagger/OpenAPI 3

### Frontend
- **Framework**: React 18
- **Routing**: React Router v6
- **State Management**: Context API
- **HTTP Client**: Axios
- **UI Framework**: Bootstrap 5
- **Styling**: CSS3

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Database Migrations**: Flyway
- **CI/CD**: GitHub Actions
- **Orchestration**: Kubernetes-ready (manifests included)
- **Cloud**: AWS-compatible deployment scripts

## Project Structure

```
examguide-simple/
├── backend/                    # Spring Boot Application
│   ├── src/main/java/         # Java source code
│   ├── src/main/resources/    # Configuration & SQL migrations
│   ├── pom.xml               # Maven dependencies
│   ├── Dockerfile            # Backend Docker image
│   └── .env.example          # Environment variables template
│
├── frontend/                  # React Application
│   ├── src/                  # React components & styles
│   ├── public/               # Static assets
│   ├── package.json          # NPM dependencies
│   ├── Dockerfile            # Frontend Docker image
│   └── .env.example          # Environment variables template
│
├── database/
│   └── init.sql             # Initial database data
│
├── docker-compose.yml       # Multi-container orchestration
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Java 17+ (for local development)
- Node.js 18+ (for local development)
- PostgreSQL 15+ (for local development)

### Using Docker Compose (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd examguide-simple
```

2. Start all services:
```bash
docker-compose up -d
```

3. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- API Documentation: http://localhost:8080/swagger-ui.html

4. Stop services:
```bash
docker-compose down
```

### Local Development Setup

#### Backend Setup

1. Configure database:
```bash
# Create PostgreSQL database
createdb examguide_db
```

2. Set environment variables (create `.env` in backend folder):
```
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/examguide_db
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres
```

3. Run backend:
```bash
cd backend
mvn spring-boot:run
```

#### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Create `.env` file:
```
REACT_APP_API_URL=http://localhost:8080/api
```

3. Start development server:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user (with validation)
- `POST /api/auth/register` - Register new user (with validation)

### User Routes
- `GET /api/user/profile` - Get user profile (protected)
- `PUT /api/user/profile` - Update profile (protected)
- `POST /api/user/change-password` - Change password (protected)

### Exam Routes
- `GET /api/exams` - Get all exams
- `GET /api/exams/{id}` - Get exam details
- `GET /api/exams/search?keyword=...` - Search exams
- `GET /api/exams/category/{category}` - Filter by category
- `GET /api/exams/level/{level}` - Filter by level
- `GET /api/exams/featured` - Get featured exams (cached)
- `GET /api/exams/upcoming/{days}` - Get upcoming exams
- `POST /api/exams` - Create exam (admin only)
- `PUT /api/exams/{id}` - Update exam (admin only)
- `DELETE /api/exams/{id}` - Delete exam (admin only)

### Scholarship Routes
- `GET /api/scholarships` - Get all scholarships
- `GET /api/scholarships/{id}` - Get scholarship details
- `GET /api/scholarships/search?keyword=...` - Search scholarships
- `GET /api/scholarships/featured` - Get featured scholarships (cached)
- `GET /api/scholarships/active` - Get active scholarships
- `GET /api/scholarships/expiring/{days}` - Get expiring scholarships
- `POST /api/scholarships` - Create scholarship (admin only)
- `PUT /api/scholarships/{id}` - Update scholarship (admin only)
- `DELETE /api/scholarships/{id}` - Delete scholarship (admin only)

### Study Materials Routes
- `GET /api/materials` - Get all materials
- `GET /api/materials/{id}` - Get material details
- `GET /api/materials/search?keyword=...` - Search materials
- `GET /api/materials/type/{type}` - Filter by type (PDF/Video/Link)
- `GET /api/materials/exam/{examId}` - Get materials for exam
- `POST /api/materials` - Upload material (admin only)
- `PUT /api/materials/{id}` - Update material (admin only)
- `DELETE /api/materials/{id}` - Delete material (admin only)

### Recommendation Routes
- `POST /api/recommendations` - Get exam recommendations (with validation)
- `POST /api/recommendations/{examId}/feedback` - Submit feedback

### Notification Routes (New)
- `GET /api/notifications` - Get all notifications
- `GET /api/notifications/unread` - Get unread notifications
- `GET /api/notifications/unread-count` - Get unread count
- `PUT /api/notifications/{id}/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/{id}` - Delete notification

### Bookmark Routes (New)
- `GET /api/bookmarks/exams` - Get bookmarked exams
- `GET /api/bookmarks/scholarships` - Get bookmarked scholarships
- `POST /api/bookmarks/exams/{id}` - Bookmark exam
- `DELETE /api/bookmarks/exams/{id}` - Remove exam bookmark
- `POST /api/bookmarks/scholarships/{id}` - Bookmark scholarship
- `DELETE /api/bookmarks/scholarships/{id}` - Remove scholarship bookmark
- `GET /api/bookmarks/exams/{id}/status` - Check if exam bookmarked
- `GET /api/bookmarks/scholarships/{id}/status` - Check if scholarship bookmarked

### Analytics Routes (New - Admin Only)
- `GET /api/analytics/today` - Get today's analytics
- `GET /api/analytics/range?start=...&end=...` - Get date range analytics
- `POST /api/analytics/user-registrations` - Record user registration
- `POST /api/analytics/exam-view` - Record exam view
- `POST /api/analytics/scholarship-view` - Record scholarship view
- `POST /api/analytics/material-download` - Record material download
- `POST /api/analytics/recommendation` - Record recommendation
- `POST /api/analytics/recommendation-feedback` - Record feedback

### Admin Routes (Protected - ROLE_ADMIN only)
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/{id}/disable` - Disable user
- `PUT /api/admin/users/{id}/enable` - Enable user
- `DELETE /api/admin/users/{id}` - Delete user
- `PUT /api/admin/users/{id}/promote` - Promote to admin

## Features Implemented

### Core User Features
- ✅ User Registration & Login with JWT Authentication
- ✅ Email Validation & Password Strength Requirements
- ✅ User Profile Management
- ✅ Password Change with Validation
- ✅ Browse Exams with Advanced Filters & Search
- ✅ Exam Details & Bookmarking
- ✅ Browse Scholarships with Filters
- ✅ Scholarship Deadline Alerts
- ✅ Study Materials Library
- ✅ Material Download Tracking
- ✅ Rule-Based Exam Recommendations
- ✅ Recommendation Feedback (Like/Dislike)

### New Features (Phase 2)
- ✅ **Notification System**
  - User notifications with read/unread status
  - Notification types (Reminder, Alert, Announcement)
  - Bulk notification operations
  
- ✅ **Analytics & Tracking**
  - User registration tracking
  - Exam/Scholarship view analytics
  - Material download analytics
  - Recommendation generation tracking
  - User feedback analytics
  - Daily statistics reports
  
- ✅ **Bookmark Management**
  - Save favorite exams
  - Save favorite scholarships
  - Quick access to bookmarks
  - Check bookmark status
  
- ✅ **Enhanced Error Handling**
  - Centralized exception handling with custom exceptions
  - Field-level validation errors
  - Meaningful error messages
  - Proper HTTP status codes
  
- ✅ **Input Validation**
  - Jakarta Validation Framework annotations
  - Email format validation
  - Password strength requirements
  - Field length constraints
  - Custom validation rules
  
- ✅ **Comprehensive Logging**
  - SLF4J logging throughout services
  - Request/response logging
  - Error tracking with stack traces
  - Audit logs for sensitive operations
  
- ✅ **Performance Optimization**
  - Spring Cache with ConcurrentMapCacheManager
  - @Cacheable on frequently accessed data
  - @CacheEvict on mutations
  - @Transactional for data consistency
  - Read-only transaction optimization
  
- ✅ **Comprehensive Testing**
  - Unit tests for services (Mockito)
  - Integration tests for controllers
  - Test coverage for critical paths
  
- ✅ **CI/CD Pipeline**
  - GitHub Actions workflow
  - Automated testing on push
  - Docker image building
  - Code quality analysis (SonarCloud)
  - Security scanning (Trivy)
  - Automated deployment to staging/production

### Admin Features
- ✅ Admin Dashboard with Statistics
- ✅ User Management (View/Disable/Enable/Delete)
- ✅ Exam Management (CRUD with validation)
- ✅ Scholarship Management (CRUD with validation)
- ✅ Study Material Management (CRUD)
- ✅ Analytics Dashboard (Daily/Range reports)
- ✅ System Health Monitoring

## Security Features

- JWT Token-based Authentication
- Role-based Access Control (USER/ADMIN)
- Password Encryption with BCrypt
- CORS Configuration for Frontend Communication
- Protected Routes on Frontend
- Admin-only API Endpoints

## Database Schema

### Users Table
Stores user account information including profile, education, category, and preferences.

### Exams Table
Contains exam details with dates, eligibility criteria, syllabus, and statistics.

### Scholarships Table
Stores scholarship information with amount, deadline, and eligibility details.

### Study Materials Table
Manages study resources (PDFs, Videos, Links) associated with exams.

## Configuration Files

### Backend
- `application.properties` - Spring Boot configuration
- `pom.xml` - Maven dependencies
- `Dockerfile` - Backend containerization

### Frontend
- `package.json` - NPM dependencies
- `.env.example` - Environment variables template
- `Dockerfile` - Frontend containerization

## Documentation

Comprehensive documentation is available in the following files:

- [API Documentation](API_DOCUMENTATION.md) - Detailed API endpoint documentation with examples
- [Deployment Guide](DEPLOYMENT.md) - Deployment instructions for various environments
- [CI/CD Pipeline](.github/workflows/ci-cd-pipeline.yml) - GitHub Actions workflow configuration

## Testing

### Running Tests

```bash
# Run all tests
cd backend
mvn test

# Run specific test class
mvn test -Dtest=AuthServiceTest

# Run with coverage report
mvn clean test jacoco:report
```

### Test Coverage

- **Service Layer**: Unit tests with Mockito for all services
- **Controller Layer**: Integration tests for API endpoints
- **Validation**: Input validation and error handling tests

Test files are located in `backend/src/test/java/com/examguide/`.

### Test Examples

- `NotificationServiceTest` - Notification CRUD operations
- `BookmarkServiceTest` - Bookmark functionality
- `AnalyticsServiceTest` - Analytics tracking
- `AuthControllerIntegrationTest` - Authentication endpoints
- `NotificationControllerIntegrationTest` - Notification endpoints

## Performance & Caching

### Caching Strategy

The application uses Spring Cache with the following cached entities:

- **exams** - Exam details (invalidated on CRUD)
- **scholarships** - Scholarship details (invalidated on CRUD)
- **materials** - Study materials
- **featuredExams** - Featured exams list (30-min TTL)
- **featuredScholarships** - Featured scholarships list (30-min TTL)
- **userProfile** - User profile information
- **bookmarks** - User bookmarks
- **notifications** - User notifications

### Database Optimization

- Connection pooling with HikariCP (10 max pool size)
- Lazy loading with `@Transactional(readOnly=true)`
- Batch processing for bulk operations
- Database indexes on frequently searched columns:
  - `users.email` (unique)
  - `exams.category`
  - `scholarships.deadline`
  - `notifications.user_id`

## CI/CD Pipeline

### GitHub Actions Workflow

The project includes an automated CI/CD pipeline with the following stages:

1. **Backend Build & Test**
   - Maven build and compilation
   - Unit and integration tests
   - Code coverage analysis

2. **Frontend Build & Test**
   - NPM dependencies installation
   - Build production bundle
   - Jest tests execution

3. **Docker Image Build**
   - Build Docker images for frontend and backend
   - Push to GitHub Container Registry
   - Cache layer optimization

4. **Code Quality Analysis**
   - SonarCloud code quality scanning
   - Dependency check
   - Security scanning with Trivy

5. **Automated Deployment**
   - Staging deployment on develop branch
   - Production deployment on main branch

### Deployment Options

The project supports multiple deployment options:

- **Docker Compose** (Development & Staging)
- **Kubernetes** (Production)
- **AWS ECS** (Cloud deployment)

## Environment Configuration

### Configuration Files

- `.env.development` - Development environment
- `.env.staging` - Staging environment
- `.env.production` - Production environment (⚠️ Update secrets!)

### Key Configuration Variables

```environment
# Database
DB_HOST=postgres
DB_PORT=5432
DB_NAME=examguide_db
DB_USER=postgres
DB_PASSWORD=***

# JWT
JWT_SECRET=*** (must be 32+ characters in production)
JWT_EXPIRATION=86400000

# Logging
LOG_LEVEL=INFO

# Cache
SPRING_CACHE_TYPE=simple
```

## Security Features

### Authentication & Authorization
- JWT Token-based Authentication (24-hour expiration)
- Role-based Access Control (USER/ADMIN)
- Password Encryption with BCrypt
- CORS Configuration for secure communication
- Protected Routes on Frontend

### Input Validation
- Jakarta Validation Framework annotations
- Email format validation
- Password strength requirements
- Field length constraints
- SQL injection prevention with parameterized queries

### Error Handling
- Centralized exception handling with @RestControllerAdvice
- Custom exception types for specific errors
- Field-level validation error responses
- Secure error messages (no sensitive data leakage)

## Development Notes

### Adding New Features

1. **Backend**:
   - Add entity in `src/main/java/com/examguide/entity/`
   - Create repository in `src/main/java/com/examguide/repository/`
   - Add service logic in `src/main/java/com/examguide/service/`
   - Create controller in `src/main/java/com/examguide/controller/`
   - Add DTOs in `src/main/java/com/examguide/dto/`
   - Write unit tests in `src/test/java/com/examguide/service/`
   - Write integration tests in `src/test/java/com/examguide/controller/`

2. **Frontend**:
   - Create component in `src/components/`
   - Add service methods in `src/api/apiService.js`
   - Add routes in `src/App.js`
   - Add styles in `src/styles/`

### Code Style Guidelines

- Follow Google Style Guide for Java
- Use meaningful variable and method names
- Add comprehensive comments for complex logic
- Keep methods small and focused
- Write unit tests for all business logic

### Common Issues & Solutions

1. **Database Connection Failed**:
   - Ensure PostgreSQL is running
   - Check database credentials in `.env` file
   - Verify database exists: `createdb examguide_db`

2. **CORS Errors**:
   - Check `WebConfig.java` for allowed origins
   - Ensure frontend URL is in CORS configuration
   - Clear browser cache and cookies

3. **JWT Token Expired**:
   - Tokens expire after 24 hours
   - Implement token refresh mechanism
   - Clear localStorage and re-login

4. **Tests Failing**:
   - Ensure PostgreSQL test database exists
   - Run `mvn clean test` to reset state
   - Check mock configuration in test files

5. **Cache Issues**:
   - Clear cache manually: `curl -X POST http://localhost:8080/api/admin/cache/clear`
   - Restart application to reset cache
   - Check `CacheConfig.java` for cache names

## Future Enhancements

### Short-term (Next Release)
- [ ] Redis-based distributed caching
- [ ] Email notifications integration (JavaMailSender)
- [ ] WebSocket support for real-time notifications
- [ ] Advanced search with Elasticsearch
- [ ] Frontend notification center UI
- [ ] Admin analytics dashboard with charts
- [ ] User activity feed
- [ ] Comments and ratings system

### Medium-term
- [ ] Machine Learning-based recommendation engine
- [ ] Payment integration (Stripe/PayPal)
- [ ] Premium content subscriptions
- [ ] Mobile app (React Native)
- [ ] Multi-language support (i18n)
- [ ] SMS notifications
- [ ] Video hosting and streaming
- [ ] User forums and discussion boards

### Long-term
- [ ] AI tutoring assistant
- [ ] Adaptive learning paths
- [ ] Blockchain-based certificates
- [ ] Integration with educational institutions
- [ ] Corporate training modules
- [ ] Gamification (badges, leaderboards)
- [ ] Advanced analytics and reporting
- [ ] White-label solution

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@examguide.com or open an issue in the repository.

## Authors

- ExamGuide Development Team
- Email: support@examguide.com

---

**Version**: 1.0.0  
**Last Updated**: March 2024
