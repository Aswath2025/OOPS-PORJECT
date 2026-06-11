import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Badge, Row, Col, Tab, Nav } from 'react-bootstrap';
import { getUserBookmarkedExams, removeExamBookmark, getUserBookmarkedScholarships, removeScholarshipBookmark } from '../../api/apiService';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MyBookmarks = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('exams');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) fetchBookmarks();
    else setLoading(false);
  }, [user]);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const [examRes, scholarshipRes] = await Promise.all([
        getUserBookmarkedExams(user.id),
        getUserBookmarkedScholarships(user.id)
      ]);
      console.log('Fetched exams:', examRes.data);
      console.log('Fetched scholarships:', scholarshipRes.data);
      setExams(examRes.data || []);
      setScholarships(scholarshipRes.data || []);
    } catch (err) {
      console.error('Failed fetching bookmarks', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveExam = async (examId) => {
    try {
      await removeExamBookmark(examId, user.id);
      setExams((prev) => prev.filter((e) => e.id !== examId));
    } catch (err) {
      console.error('Failed to remove exam bookmark', err);
    }
  };

  const handleRemoveScholarship = async (scholarshipId) => {
    try {
      await removeScholarshipBookmark(scholarshipId, user.id);
      setScholarships((prev) => prev.filter((s) => s.id !== scholarshipId));
    } catch (err) {
      console.error('Failed to remove scholarship bookmark', err);
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"></div></div>;
  if (!user) return (
       <Container className="my-5 text-center">
          <div className="mb-4 d-inline-block rounded-circle bg-light p-4" style={{ width: '120px', height: '120px', display: 'flex', alignItems:'center', justifyContent:'center', margin: '0 auto' }}>
            <i className="bi bi-lock-fill text-primary" style={{ fontSize: '4rem' }}></i>
          </div>
          <h2 className="fw-bold">Please log in to view your bookmarks</h2>
          <Button variant="primary" size="lg" className="rounded-pill mt-3 px-5" onClick={() => navigate('/login')}>Login Now</Button>
       </Container>
  );

  return (
    <div className="bg-light pb-5 min-vh-100">
      <div className="bg-white border-bottom py-4 mb-5 shadow-sm">
        <Container>
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
               <div className="icon-box primary"><i className="bi bi-bookmarks-fill"></i></div>
               <div>
                 <h1 className="fw-bold mb-0">My Bookmarks</h1>
                 <p className="text-muted mb-0">Manage everything you've saved for later</p>
               </div>
            </div>
            <div className="d-flex gap-2">
               <Badge bg="primary" className="rounded-pill px-3 py-2 fw-bold">
                 {exams.length} Exams
               </Badge>
               <Badge bg="warning" text="dark" className="rounded-pill px-3 py-2 fw-bold">
                 {scholarships.length} Scholarships
               </Badge>
            </div>
          </div>
        </Container>
      </div>

      <Container>
        <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
          <div className="mb-4 d-flex justify-content-center">
            <Nav variant="pills" className="bg-white p-1 rounded-pill shadow-sm">
              <Nav.Item>
                <Nav.Link eventKey="exams" className="rounded-pill px-4 py-2 fw-bold">
                  <i className="bi bi-book me-2"></i> Exams
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="scholarships" className="rounded-pill px-4 py-2 fw-bold">
                  <i className="bi bi-mortarboard me-2"></i> Scholarships
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </div>

          <Tab.Content>
            <Tab.Pane eventKey="exams">
              {exams.length === 0 ? (
                <div className="text-center py-5 animate-slide-up">
                  <div className="mb-4 d-inline-block rounded-circle bg-light p-4" style={{ width: '120px', height: '120px', display: 'inline-flex', alignItems:'center', justifyContent:'center', margin: '0 auto' }}>
                    <i className="bi bi-bookmark-x text-primary" style={{ fontSize: '4rem' }}></i>
                  </div>
                  <h3 className="fw-bold text-dark">No bookmarked exams yet</h3>
                  <Button variant="primary" size="lg" className="rounded-pill px-5 mt-3" onClick={() => navigate('/exams')}>
                     Browse Exams
                  </Button>
                </div>
              ) : (
                <div className="animate-fade-in">
                   {exams.map((exam) => (
                     <Card key={exam.id} className="hover-card border-0 shadow-sm mb-3 rounded-4 overflow-hidden">
                       <Card.Body className="p-0">
                         <Row className="g-0 align-items-center">
                            <Col xs="auto" className="p-4 bg-light d-flex align-items-center justify-content-center border-end" style={{ width: '100px' }}>
                               <i className="bi bi-building fs-1 text-primary opacity-50"></i>
                            </Col>
                            <Col className="p-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                               <div>
                                 <Badge bg="light" text="dark" className="border px-2 py-1 mb-2 fw-medium">{exam.category}</Badge>
                                 <h5 className="fw-bold mb-1 fs-4 text-dark">{exam.name}</h5>
                                 <div className="text-muted fw-medium small mb-0 d-flex gap-3">
                                    <span><i className="bi bi-building me-1"></i> {exam.conductingBody}</span>
                                    <span><i className="bi bi-laptop me-1"></i> CBT</span>
                                 </div>
                               </div>
                               <div className="d-flex gap-2">
                                 <Button variant="outline-danger" className="rounded-pill px-3 fw-bold btn-sm" onClick={() => handleRemoveExam(exam.id)}>
                                   Remove
                                 </Button>
                                 <Button variant="primary" className="rounded-pill px-4 btn-sm" onClick={() => navigate(`/exams/${exam.id}`)}>
                                   View Exam
                                 </Button>
                               </div>
                            </Col>
                         </Row>
                       </Card.Body>
                     </Card>
                   ))}
                </div>
              )}
            </Tab.Pane>

            <Tab.Pane eventKey="scholarships">
              {scholarships.length === 0 ? (
                <div className="text-center py-5 animate-slide-up">
                  <div className="mb-4 d-inline-block rounded-circle bg-light p-4" style={{ width: '120px', height: '120px', display: 'inline-flex', alignItems:'center', justifyContent:'center', margin: '0 auto' }}>
                    <i className="bi bi-mortarboard text-warning" style={{ fontSize: '4rem' }}></i>
                  </div>
                  <h3 className="fw-bold text-dark">No bookmarked scholarships yet</h3>
                  <Button variant="warning" size="lg" className="rounded-pill px-5 mt-3 text-dark fw-bold" onClick={() => navigate('/scholarships')}>
                     Browse Scholarships
                  </Button>
                </div>
              ) : (
                <div className="animate-fade-in">
                   {scholarships.map((s) => (
                     <Card key={s.id} className="hover-card border-0 shadow-sm mb-3 rounded-4 overflow-hidden">
                       <Card.Body className="p-0">
                         <Row className="g-0 align-items-center">
                            <Col xs="auto" className="p-4 bg-light d-flex align-items-center justify-content-center border-end" style={{ width: '100px' }}>
                               <i className="bi bi-cash-stack fs-1 text-warning opacity-50"></i>
                            </Col>
                            <Col className="p-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                               <div>
                                 <Badge bg="warning" text="dark" className="px-2 py-1 mb-2 fw-medium">Scholarship</Badge>
                                 <h5 className="fw-bold mb-1 fs-4 text-dark">{s.name}</h5>
                                 <div className="text-muted fw-medium small mb-0 d-flex gap-3">
                                    <span><i className="bi bi-bank2 me-1"></i> {s.provider}</span>
                                    <span className="text-success fw-bold"><i className="bi bi-currency-rupee"></i> {s.amount}</span>
                                 </div>
                               </div>
                               <div className="d-flex gap-2">
                                 <Button variant="outline-danger" className="rounded-pill px-3 fw-bold btn-sm" onClick={() => handleRemoveScholarship(s.id)}>
                                   Remove
                                 </Button>
                                 <Button variant="warning" className="rounded-pill px-4 btn-sm text-dark fw-bold">
                                   Apply Now
                                 </Button>
                               </div>
                            </Col>
                         </Row>
                       </Card.Body>
                     </Card>
                   ))}
                </div>
              )}
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Container>
    </div>
  );
};

export default MyBookmarks;
