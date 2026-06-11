import axiosConfig from './axiosConfig';

// Auth APIs
export const login = (email, password) => 
  axiosConfig.post('/auth/login', { email, password });

export const register = (fullName, email, password, confirmPassword) =>
  axiosConfig.post('/auth/register', { fullName, email, password, confirmPassword });

// User APIs
export const getUserProfile = () => axiosConfig.get('/user/profile');

export const updateUserProfile = (userDTO) =>
  axiosConfig.put('/user/profile', userDTO);

export const changePassword = (oldPassword, newPassword) =>
  axiosConfig.post('/user/change-password', null, {
    params: { oldPassword, newPassword },
  });

// Exam APIs
export const getAllExams = (params = {}) => axiosConfig.get('/exams', { params });

export const getExamById = (id) => axiosConfig.get(`/exams/${id}`);

export const searchExams = (keyword, page = 0, size = 10) =>
  axiosConfig.get('/exams/search', { params: { keyword, page, size } });

export const getExamsByCategory = (category) =>
  axiosConfig.get(`/exams/category/${category}`);

export const getFeaturedExams = () => axiosConfig.get('/exams/featured');

export const getUpcomingExams = (days) =>
  axiosConfig.get(`/exams/upcoming/${days}`);

export const bookmarkExam = (id) => axiosConfig.post(`/exams/${id}/bookmark`);
export const bookmarkExamForUser = (examId, userId) => axiosConfig.post(`/bookmarks/exams/${examId}`, null, { params: { userId } });
export const getUserBookmarkedExams = (userId) => axiosConfig.get(`/bookmarks/exams`, { params: { userId } });
export const removeExamBookmark = (examId, userId) => axiosConfig.delete(`/bookmarks/exams/${examId}`, { params: { userId } });

export const getUserBookmarkedScholarships = (userId) => axiosConfig.get(`/bookmarks/scholarships`, { params: { userId } });
export const removeScholarshipBookmark = (scholarshipId, userId) => axiosConfig.delete(`/bookmarks/scholarship/${scholarshipId}`, { params: { userId } });

// Scholarship APIs
export const getAllScholarships = () => axiosConfig.get('/scholarships');

export const getScholarshipById = (id) => axiosConfig.get(`/scholarships/${id}`);

export const searchScholarships = (keyword, page = 0, size = 10) =>
  axiosConfig.get('/scholarships/search', { params: { keyword, page, size } });

export const getFeaturedScholarships = () =>
  axiosConfig.get('/scholarships/featured');

export const getActiveScholarships = () =>
  axiosConfig.get('/scholarships/active');

export const getExpiringScholarships = (days) =>
  axiosConfig.get(`/scholarships/expiring/${days}`);

export const saveScholarship = (id) =>
  axiosConfig.post(`/scholarships/${id}/save`);

// Material APIs
export const getAllMaterials = () => axiosConfig.get('/materials');

export const getMaterialById = (id) => axiosConfig.get(`/materials/${id}`);

export const searchMaterials = (keyword, page = 0, size = 10) =>
  axiosConfig.get('/materials/search', { params: { keyword, page, size } });

export const getMaterialsByType = (type) =>
  axiosConfig.get(`/materials/type/${type}`);

export const getMaterialsByExam = (examId) =>
  axiosConfig.get(`/materials/exam/${examId}`);

export const getMostDownloadedMaterials = () =>
  axiosConfig.get('/materials/popular');

export const incrementDownloadCount = (id) =>
  axiosConfig.post(`/materials/${id}/download`);

// Recommendation APIs
export const getRecommendations = (request) =>
  axiosConfig.post('/recommendations', request);

export const submitRecommendationFeedback = (examId, feedback) =>
  axiosConfig.post(`/recommendations/${examId}/feedback`, null, {
    params: { feedback },
  });

// Admin APIs
export const getAdminDashboardStats = () =>
  axiosConfig.get('/admin/dashboard/stats');

export const getAllUsers = () => axiosConfig.get('/admin/users');

export const getUserById = (id) => axiosConfig.get(`/admin/users/${id}`);

export const disableUser = (id) =>
  axiosConfig.put(`/admin/users/${id}/disable`);

export const enableUser = (id) =>
  axiosConfig.put(`/admin/users/${id}/enable`);

export const deleteUser = (id) =>
  axiosConfig.delete(`/admin/users/${id}`);

export const promoteToAdmin = (id) =>
  axiosConfig.put(`/admin/users/${id}/promote`);

// Admin Exam Management
export const createExam = (examDTO) =>
  axiosConfig.post('/admin/exams', examDTO);

export const updateExam = (id, examDTO) =>
  axiosConfig.put(`/admin/exams/${id}`, examDTO);

export const deleteExam = (id) =>
  axiosConfig.delete(`/admin/exams/${id}`);

// Admin Scholarship Management
export const createScholarship = (scholarshipDTO) =>
  axiosConfig.post('/admin/scholarships', scholarshipDTO);

export const updateScholarship = (id, scholarshipDTO) =>
  axiosConfig.put(`/admin/scholarships/${id}`, scholarshipDTO);

export const deleteScholarship = (id) =>
  axiosConfig.delete(`/admin/scholarships/${id}`);

// Admin Material Management
export const uploadMaterial = (material) =>
  axiosConfig.post('/admin/materials', material);

export const updateMaterial = (id, material) =>
  axiosConfig.put(`/admin/materials/${id}`, material);

export const deleteMaterial = (id) =>
  axiosConfig.delete(`/admin/materials/${id}`);

// Admin Analytics Management
export const getTodayAnalytics = () =>
  axiosConfig.get('/analytics/today');

export const getAnalyticsRange = (start, end) =>
  axiosConfig.get('/analytics/range', { params: { start, end } });
