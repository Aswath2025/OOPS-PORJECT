import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getAllExams, getFeaturedExams, getUpcomingExams, bookmarkExamForUser } from '../../api/apiService';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalExams: 0,
    upcomingExams: 0,
    scholarships: 0,
  });
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const examsResponse = await getAllExams();
      const upcomingResponse = await getUpcomingExams(30);
      const featuredResponse = await getFeaturedExams();

      setStats({
        totalExams: examsResponse.data.length,
        upcomingExams: upcomingResponse.data.length,
        scholarships: 45, // Placeholder for newly added scholarships
      });
      setFeatured(featuredResponse.data.slice(0, 3));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async (examId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await bookmarkExamForUser(examId, user.id);
      alert('Exam bookmarked successfully!');
    } catch (err) {
      console.error('Bookmark action failed', err);
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"></div></div>;

  return (
    <div className="dashboard pb-5 bg-white">
      {/* Premium Hero Section */}
      <div className="bg-light py-5 mb-5 border-bottom">
        <Container>
          <Row className="align-items-center">
            <Col lg={7} className="animate-fade-in">
              <Badge bg="primary" className="mb-3 px-3 py-2 rounded-pill shadow-sm">🚀 Your Prep Hub</Badge>
              <h1 className="display-4 fw-bolder mb-3" style={{ letterSpacing: '-0.03em' }}>
                Welcome to <span className="text-gradient-primary">ExamGuide</span>
              </h1>
              <p className="lead text-muted mb-4" style={{ fontSize: '1.25rem' }}>
                Track your exams, discover life-changing scholarships, and access premium study materials all from your personalized dashboard.
              </p>
              <div className="d-flex gap-3">
                 <Button variant="primary" size="lg" className="rounded-pill px-4" onClick={() => navigate('/exams')}>Explore Exams</Button>
                 <Button variant="outline-primary" size="lg" className="rounded-pill px-4 bg-white" onClick={() => navigate('/scholarships')}>Find Scholarships</Button>
              </div>
            </Col>
            <Col lg={5} className="d-none d-lg-block text-center animate-slide-up">
              <img src="https://illustrations.popsy.co/emerald/student-with-diploma.svg" alt="Dashboard Welcome" style={{ maxWidth: '80%' }} />
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        {/* Stats Grid */}
        <Row className="mb-5 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <Col md={4} className="mb-4">
            <Card className="hover-card h-100 border-0 shadow-sm rounded-4 bg-white">
              <Card.Body className="d-flex align-items-center p-4">
                <div className="icon-box primary me-4">
                  <i className="bi bi-journal-text"></i>
                </div>
                <div>
                  <h2 className="mb-0 fw-bold">{stats.totalExams}</h2>
                  <p className="text-muted mb-0 fw-medium">Available Exams</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="hover-card h-100 border-0 shadow-sm rounded-4 bg-white">
              <Card.Body className="d-flex align-items-center p-4">
                <div className="icon-box warning me-4">
                  <i className="bi bi-calendar-event"></i>
                </div>
                <div>
                  <h2 className="mb-0 fw-bold text-dark">{stats.upcomingExams}</h2>
                  <p className="text-muted mb-0 fw-medium">Upcoming (30 days)</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="hover-card h-100 border-0 shadow-sm rounded-4 bg-white">
              <Card.Body className="d-flex align-items-center p-4">
                <div className="icon-box success me-4">
                  <i className="bi bi-award"></i>
                </div>
                <div>
                  <h2 className="mb-0 fw-bold">{stats.scholarships}</h2>
                  <p className="text-muted mb-0 fw-medium">New Scholarships</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Featured Exams Section */}
        <div className="d-flex justify-content-between align-items-center mb-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
           <h3 className="fw-bold m-0"><i className="bi bi-star-fill text-warning me-2"></i> Featured Exams</h3>
           <Button variant="link" className="text-decoration-none fw-bold" onClick={() => navigate('/exams')}>View All &rarr;</Button>
        </div>

        <Row className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
          {featured.map((exam) => (
            <Col md={4} key={exam.id} className="mb-4">
              <Card className="hover-card h-100 border-0 shadow-sm rounded-4">
                <div className="p-4 pb-0">
                  <Badge bg="primary" className="mb-3 px-3 py-2">{exam.category}</Badge>
                  <Card.Title className="fw-bold mb-1 fs-4">{exam.name}</Card.Title>
                  <p className="text-muted fw-medium mb-3 small"><i className="bi bi-building me-1"></i> {exam.conductingBody}</p>
                </div>
                <Card.Body className="pt-0">
                  <div className="d-flex gap-2 flex-wrap mb-3">
                     <Badge bg="light" text="dark" className="border fw-normal"><i className="bi bi-bar-chart-fill text-muted me-1"></i> {exam.level}</Badge>
                     <Badge bg="light" text="dark" className="border fw-normal"><i className="bi bi-laptop text-muted me-1"></i> {exam.mode || 'Online'}</Badge>
                  </div>
                </Card.Body>
                <Card.Footer className="bg-light border-0 p-3 pt-3 d-flex gap-2 align-items-center justify-content-between rounded-bottom-4">
                  <Button variant="primary" className="flex-grow-1 rounded-pill fw-bold" onClick={() => navigate(`/exams/${exam.id}`)}>View Details</Button>
                  <Button variant="light" className="rounded-circle border border-primary text-primary" style={{ width: '40px', height: '40px', padding: 0 }} onClick={() => handleBookmark(exam.id)}>
                    <i className="bi bi-bookmark-fill"></i>
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;
