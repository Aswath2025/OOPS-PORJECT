import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getAllScholarships, saveScholarship } from '../../api/apiService';

const ScholarshipList = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    try {
      const response = await getAllScholarships();
      setScholarships(response.data);
    } catch (error) {
      console.error('Failed to fetch scholarships:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (scholarshipId) => {
    try {
      await saveScholarship(scholarshipId);
      setMessage('Scholarship saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to save scholarship');
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"></div></div>;

  return (
    <div className="bg-light pb-5 min-vh-100">
      <div className="bg-white border-bottom py-4 mb-5">
        <Container>
          <div className="d-flex align-items-center gap-3">
             <div className="icon-box warning" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)' }}>
               <i className="bi bi-mortarboard-fill"></i>
             </div>
             <div>
               <h1 className="fw-bold mb-0">Scholarships & Grants</h1>
               <p className="text-muted mb-0">Discover financial aid opportunities to fund your education</p>
             </div>
          </div>
        </Container>
      </div>

      <Container>
        {message && <Alert variant="success" className="mb-4 shadow-sm" dismissible onClose={() => setMessage('')}><i className="bi bi-check-circle-fill me-2"></i>{message}</Alert>}

        <Row className="g-4 animate-slide-up">
          {scholarships.map((scholarship) => {
            const isExpiringSoon = scholarship.deadline && (new Date(scholarship.deadline) - new Date() < 15 * 24 * 60 * 60 * 1000);
            return (
              <Col md={6} lg={4} key={scholarship.id}>
                <Card className="hover-card h-100 border-0 shadow-sm rounded-4 position-relative overflow-hidden">
                  {isExpiringSoon && (
                     <div className="position-absolute top-0 end-0 bg-danger text-white px-3 py-1 rounded-bl-3 fw-bold" style={{ fontSize: '0.75rem', zIndex: 1, borderBottomLeftRadius: '12px' }}>
                        EXPIRING SOON
                     </div>
                  )}
                  <Card.Body className="p-4 d-flex flex-column">
                    <div className="mb-auto">
                      <div className="d-flex align-items-start gap-3 mb-3">
                         <div className="icon-box bg-light text-secondary flex-shrink-0" style={{ width: '40px', height: '40px' }}>
                            <i className="bi bi-bank2 fs-5"></i>
                         </div>
                         <div>
                           <Card.Title className="fw-bold mb-1 fs-5 lh-sm">{scholarship.name}</Card.Title>
                           <p className="text-muted small mb-0 fw-medium">{scholarship.provider}</p>
                         </div>
                      </div>
                      
                      <div className="my-4 p-3 bg-light rounded-3 text-center border">
                         <div className="text-uppercase text-muted" style={{ fontSize: '0.75rem', letterSpacing: '0.05em', fontWeight: 600 }}>Amount up to</div>
                         <div className="display-6 fw-bold text-gradient-success mt-1">{scholarship.amount}</div>
                      </div>

                      {scholarship.deadline && (
                        <div className="d-flex align-items-center text-muted small fw-medium mt-3 px-1">
                          <i className="bi bi-clock-history me-2 text-warning fs-5"></i>
                          Deadline: <span className="ms-1 text-dark fw-bold">{new Date(scholarship.deadline).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </Card.Body>
                  <Card.Footer className="bg-white border-top-0 p-4 pt-0 d-flex gap-2">
                    <Button variant="primary" className="flex-grow-1 rounded-pill fw-bold py-2" onClick={() => navigate(`/scholarships/${scholarship.id}`)}>View Details</Button>
                    <Button variant="outline-primary" className="rounded-pill px-4 fw-bold py-2" onClick={() => handleSave(scholarship.id)}>
                      Save <i className="bi bi-bookmark-plus ms-1"></i>
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </div>
  );
};

export default ScholarshipList;
