import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getRecommendations } from '../../api/apiService';

const RecommendationBox = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    educationLevel: '',
    fieldOfStudy: '',
    preferredExamTypes: '',
    additionalNotes: '',
  });
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await getRecommendations(formData);
      setRecommendations(response.data);
      setHasSearched(true);
    } catch (error) {
      console.error('Failed to generate recommendations', error);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light pb-5 min-vh-100">
      <div className="bg-white border-bottom py-4 mb-5">
        <Container>
          <div className="d-flex align-items-center gap-3">
             <div className="icon-box" style={{ background: 'linear-gradient(135deg, #db2777 0%, #be185d 100%)', color: 'white' }}>
               <i className="bi bi-magic fs-4"></i>
             </div>
             <div>
               <h1 className="fw-bold mb-0">AI Recommendations</h1>
               <p className="text-muted mb-0">Tell us about yourself and we'll find the perfect exams for you</p>
             </div>
          </div>
        </Container>
      </div>

      <Container>
        <Row className="g-5">
          {/* Form Side */}
          <Col lg={5} className="animate-slide-up">
            <Card className="border-0 shadow-lg rounded-4 overflow-hidden position-sticky top-0">
              <div className="bg-primary p-4 text-white text-center position-relative" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #db2777 100%)' }}>
                 <i className="bi bi-person-lines-fill fs-1 opacity-50 mb-2 d-inline-block"></i>
                 <h4 className="fw-bold m-0">Your Profile</h4>
                 <p className="small mb-0 opacity-75">Fill in the details for a tailored list</p>
              </div>
              <Card.Body className="p-4 p-md-5">
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold text-dark small text-uppercase">Education Level</Form.Label>
                    <Form.Select
                      name="educationLevel"
                      value={formData.educationLevel}
                      onChange={handleChange}
                      className="bg-light border-0 py-3 px-3 fw-medium cursor-pointer"
                    >
                      <option value="">Select your highest qualification</option>
                      <option value="10th">10th Standard Pass</option>
                      <option value="12th">12th Standard Pass</option>
                      <option value="Graduate">Undergraduate / Bachelor's</option>
                      <option value="PostGraduate">Postgraduate / Master's</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold text-dark small text-uppercase">Field of Study</Form.Label>
                    <Form.Control
                      type="text"
                      name="fieldOfStudy"
                      placeholder="e.g., B.Tech Computer Science, B.Com"
                      value={formData.fieldOfStudy}
                      onChange={handleChange}
                      className="bg-light border-0 py-3 px-3 fw-medium"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold text-dark small text-uppercase">Preferred Sector</Form.Label>
                    <Form.Control
                      type="text"
                      name="preferredExamTypes"
                      placeholder="e.g., Banking, IT, Civil Services"
                      value={formData.preferredExamTypes}
                      onChange={handleChange}
                      className="bg-light border-0 py-3 px-3 fw-medium"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold text-dark small text-uppercase">Career Goals (Optional)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows="3"
                      name="additionalNotes"
                      placeholder="I want a challenging role with good pay..."
                      value={formData.additionalNotes}
                      onChange={handleChange}
                      className="bg-light border-0 py-3 px-3"
                      style={{ resize: 'none' }}
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit" size="lg" className="w-100 rounded-pill fw-bold py-3 mt-2 shadow-sm" disabled={loading}>
                    {loading ? (
                       <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Processing AI Analysis...</>
                    ) : (
                       <><i className="bi bi-stars me-2"></i> Reveal My Matches</>
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Results Side */}
          <Col lg={7} className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {!hasSearched ? (
               <div className="h-100 d-flex flex-column align-items-center justify-content-center text-center p-5 bg-white border border-light rounded-4">
                  <img src="https://illustrations.popsy.co/emerald/web-design.svg" alt="Awaiting input" style={{ maxWidth: '300px' }} className="mb-4 opacity-75" />
                  <h3 className="fw-bold text-muted mb-2">Awaiting your details</h3>
                  <p className="text-secondary" style={{ maxWidth: '400px' }}>Our engine analyzes thousands of exams to find the ones perfectly matched to your academic background and career goals.</p>
               </div>
            ) : recommendations.length > 0 ? (
              <div>
                <div className="d-flex align-items-center justify-content-between mb-4">
                   <h3 className="fw-bold m-0"><i className="bi bi-check-circle-fill text-success me-2"></i>Top Matches Found</h3>
                   <span className="text-muted fw-bold small">{recommendations.length} Results</span>
                </div>
                
                {recommendations.map((rec, index) => (
                  <Card key={index} className="hover-card mb-4 border-0 shadow-sm rounded-4 overflow-hidden animate-slide-up" style={{ animationDelay: `${0.1 * index}s` }}>
                    <Card.Body className="p-4 d-flex flex-column flex-sm-row gap-4 align-items-center">
                      
                      {/* Match Percentage Ring */}
                      <div className="position-relative d-flex align-items-center justify-content-center rounded-circle border border-4 border-success flex-shrink-0 bg-success bg-opacity-10" style={{ width: '90px', height: '90px' }}>
                        <div className="text-center">
                           <span className="fs-3 fw-bolder text-success lh-1">{rec.matchPercentage}</span>
                           <span className="fw-bold text-success small position-absolute top-0" style={{ right: '15px' }}>%</span>
                           <div className="small fw-bold text-uppercase text-success mt-1" style={{ fontSize: '0.6rem' }}>Match</div>
                        </div>
                      </div>

                      {/* Info Details */}
                      <div className="flex-grow-1 text-center text-sm-start">
                        <h4 className="fw-bold mb-2">{rec.examName}</h4>
                        <p className="text-muted small mb-0 fw-medium d-flex align-items-start text-start">
                           <i className="bi bi-info-circle-fill me-2 mt-1 text-primary opacity-50"></i>
                           {rec.matchReasons}
                        </p>
                      </div>

                      {/* Action */}
                      <div className="flex-shrink-0 text-center">
                         <Button 
                           variant="outline-primary" 
                           className="rounded-pill px-4 py-2 fw-bold w-100 mt-3 mt-sm-0"
                           onClick={() => navigate(`/exams/${rec.examId}`)}
                         >
                           View Exam
                         </Button>
                      </div>

                    </Card.Body>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="h-100 d-flex flex-column align-items-center justify-content-center text-center p-5 bg-white border border-light rounded-4">
                  <h3 className="fw-bold text-dark mb-2">No direct matches found</h3>
                  <p className="text-secondary">Try broadening your search criteria or checking out our general featured exams list.</p>
               </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RecommendationBox;
