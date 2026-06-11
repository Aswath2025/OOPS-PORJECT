import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Badge, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { getExamById, bookmarkExamForUser, removeExamBookmark, getMaterialsByExam } from '../../api/apiService';
import { useAuth } from '../../context/AuthContext';

const ExamDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const { user } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [materialsLoading, setMaterialsLoading] = useState(false);

  useEffect(() => {
    fetchExam();
  }, [id]);

  const fetchExam = async () => {
    try {
      const res = await getExamById(id);
      setExam(res.data);
      // Fetch study materials for this exam
      setMaterialsLoading(true);
      try {
        const matRes = await getMaterialsByExam(id);
        setMaterials(matRes.data || []);
      } catch (e) {
        console.warn('No materials found for exam', id);
      } finally {
        setMaterialsLoading(false);
      }
    } catch (err) {
      console.error('Failed to load exam', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      if (!bookmarked) {
        await bookmarkExamForUser(exam.id, user.id);
        setBookmarked(true);
      } else {
        await removeExamBookmark(exam.id, user.id);
        setBookmarked(false);
      }
    } catch (err) {
      console.error('Bookmark action failed', err);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading exam...</div>;
  if (!exam) return <div className="text-center mt-5">Exam not found.</div>;

  // Placeholder data for the UI
  const enrolledCount = Math.floor(Math.random() * 5000) + 1000;
  
  return (
    <div className="exam-detail-page bg-white pb-5">
      {/* Hero Section */}
      <div className="exam-hero">
        <Container>
          <div className="breadcrumb">
            <span style={{cursor:'pointer'}} onClick={() => navigate('/')}>Home</span> &gt; {exam.category} &gt; <span>{exam.name}</span>
          </div>

          <Row className="align-items-center">
            <Col lg={8}>
              <div className="d-flex align-items-center gap-3 mb-3">
                <div style={{width:'60px', height:'60px', backgroundColor:'white', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center'}}>
                   <span style={{fontSize:'2rem'}}>🏛️</span>
                </div>
                <div>
                  <h1>{exam.name} - Notification, Exam Date, Eligibility</h1>
                </div>
              </div>
              
              <div className="enrolled-stats">
                <i className="bi bi-person-fill"></i>
                {enrolledCount}k+ Students Enrolled
              </div>

              <div className="hero-actions d-flex gap-3">
                <Button className="btn-primary">Get started for free!</Button>
                <Button className="btn-outline"><i className="bi bi-download me-2"></i>Download as PDF</Button>
              </div>
            </Col>
            <Col lg={4} className="d-none d-lg-block text-center">
              <img src="https://illustrations.popsy.co/emerald/student-going-to-school.svg" alt="Exam Study" style={{maxWidth: '250px'}} />
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        {/* Custom Tabs */}
        <ul className="exam-tabs flex-wrap">
          {['Overview', 'Exam Info', 'Study Materials', 'Super Coaching', 'Test Series', 'Latest Quizzes', 'Prev. Papers'].map(tab => (
            <li 
              key={tab} 
              className={activeTab === tab ? 'active' : ''}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </li>
          ))}
        </ul>

        <Row>
          {/* Left Content Area */}
          <Col lg={8}>
            
            {activeTab === 'Overview' && (
               <>
                 <p className="text-muted mb-4" style={{fontSize: '1.1rem', lineHeight: '1.8'}}>
                   The {exam.name} Exam is one of the most demanding competitive exams. It is conducted by {exam.conductingBody} to recruit eligible candidates. Check {exam.name} latest updates notification, online application form, exam date, admit card, study plan, exam pattern, and more from the sections below.
                 </p>

                 <Row className="g-4">
                   <Col md={6}>
                      <h4 className="mb-3">{exam.name} Overview</h4>
                      
                      <div className="detail-box">
                         <div className="detail-box-header bg-purple">Registration Date</div>
                         <div className="detail-box-content">
                            {exam.applicationStartDate ? new Date(exam.applicationStartDate).toLocaleDateString() : 'To be announced'} - {exam.applicationEndDate ? new Date(exam.applicationEndDate).toLocaleDateString() : 'To be announced'}
                         </div>
                      </div>

                      <div className="detail-box">
                         <div className="detail-box-header bg-cyan">Vacancies <Badge bg="warning" className="ms-2 text-dark">EXPECTED</Badge></div>
                         <div className="detail-box-content">
                            {Math.floor(Math.random() * 5000) + 500}
                         </div>
                      </div>

                   </Col>
                   <Col md={6}>
                      <h4 className="mb-3 d-none d-md-block">&nbsp;</h4>

                      <div className="detail-box">
                         <div className="detail-box-header bg-purple" style={{backgroundColor: '#6366f1'}}>Salary</div>
                         <div className="detail-box-content">
                            Rs. 25,500 - Rs. 1,42,400
                         </div>
                      </div>

                      <div className="detail-box">
                         <div className="detail-box-header bg-cyan">Eligibility</div>
                         <div className="detail-box-content">
                            {exam.eligibilityCriteria || 'Not specified'}
                         </div>
                      </div>
                   </Col>
                 </Row>

                 <div className="mt-5">
                   <h4 className="mb-3">{exam.name} Updates</h4>
                   <div className="detail-box p-3 border text-danger mb-2" style={{backgroundColor: '#fef2f2', fontWeight: 600, cursor: 'pointer'}}>
                      👉 {exam.name} Previous Year Question Paper
                   </div>
                   <div className="detail-box p-3 border text-danger" style={{backgroundColor: '#fef2f2', fontWeight: 600, cursor: 'pointer'}}>
                      👉 {exam.name} Syllabus
                   </div>
                 </div>
               </>
            )}

            {activeTab === 'Study Materials' && (
              <div className="animate__animated animate__fadeIn">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h4 className="mb-1">Study Materials for {exam.name}</h4>
                    <p className="text-muted mb-0">Handpicked resources to help you crack {exam.name}</p>
                  </div>
                  {materials.length > 0 && (
                    <span className="badge bg-primary rounded-pill px-3 py-2">{materials.length} resources</span>
                  )}
                </div>

                {materialsLoading ? (
                  <div className="text-center py-4"><div className="spinner-border text-primary" role="status" /></div>
                ) : materials.length === 0 ? (
                  <div className="text-center py-5 bg-light rounded-3">
                    <i className="bi bi-book text-muted" style={{ fontSize: '3rem' }} />
                    <p className="text-muted mt-3">No study materials available yet for this exam.</p>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {materials.map((mat, idx) => {
                      const icon = mat.type === 'PDF' ? '📄' : mat.type === 'Video' ? '🎬' : '🔗';
                      const badgeColor = mat.type === 'PDF' ? 'danger' : mat.type === 'Video' ? 'info' : 'success';
                      const link = mat.fileUrl || mat.externalLink || '#';
                      return (
                        <div key={mat.id || idx} style={{
                          background: 'white', border: '1px solid #e9ecef',
                          borderRadius: '12px', padding: '1rem 1.25rem',
                          display: 'flex', alignItems: 'center', gap: '1rem',
                          transition: 'box-shadow 0.2s, transform 0.2s',
                        }}
                          onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                          onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
                        >
                          <div style={{ fontSize: '2rem', flexShrink: 0 }}>{icon}</div>
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center gap-2 mb-1">
                              <span className="fw-bold" style={{ fontSize: '0.95rem' }}>{mat.title}</span>
                              <span className={`badge bg-${badgeColor} rounded-pill`} style={{ fontSize: '0.7rem' }}>{mat.type}</span>
                            </div>
                            {mat.description && (
                              <p className="text-muted mb-1" style={{ fontSize: '0.85rem', lineHeight: 1.5 }}>
                                {mat.description.length > 120 ? mat.description.substring(0, 120) + '...' : mat.description}
                              </p>
                            )}
                            {mat.downloadCount > 0 && (
                              <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                                <i className="bi bi-download me-1" />{mat.downloadCount.toLocaleString()} downloads
                              </span>
                            )}
                          </div>
                          <a href={link} target="_blank" rel="noopener noreferrer"
                            className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-bold flex-shrink-0">
                            {mat.type === 'Video' ? 'Watch' : mat.type === 'PDF' ? 'Download' : 'Open'}
                            <i className="bi bi-arrow-right ms-1" />
                          </a>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Exam Info' && (
              <div className="animate__animated animate__fadeIn">
                <h4 className="mb-3">Detailed Information</h4>
                <p className="text-muted mb-4">Understanding the exam structure and rules is key to clearing {exam.name} effectively.</p>
                <Row className="g-4 mb-4">
                   <Col md={6}>
                      <div className="detail-box">
                         <div className="detail-box-header bg-purple">Exam Mode</div>
                         <div className="detail-box-content">{exam.mode || 'Online / CBT'}</div>
                      </div>
                      <div className="detail-box">
                         <div className="detail-box-header bg-cyan">Duration</div>
                         <div className="detail-box-content">{exam.duration || '120 Minutes'}</div>
                      </div>
                      <div className="detail-box">
                         <div className="detail-box-header bg-orange">Age Limit</div>
                         <div className="detail-box-content">{exam.minAge ? `${exam.minAge} - ${exam.maxAge} Years` : '18 - 25 Years'}</div>
                      </div>
                   </Col>
                   <Col md={6}>
                      <div className="detail-box">
                         <div className="detail-box-header bg-purple" style={{backgroundColor: '#6366f1'}}>Total Marks</div>
                         <div className="detail-box-content">{exam.totalMarks || '200 Marks'}</div>
                      </div>
                      <div className="detail-box">
                         <div className="detail-box-header bg-cyan">No. of Subjects</div>
                         <div className="detail-box-content">{exam.numberOfSubjects || '4 Subjects'}</div>
                      </div>
                      <div className="detail-box">
                         <div className="detail-box-header bg-orange">Marking Scheme</div>
                         <div className="detail-box-content">{exam.markingScheme || '+1 for correct, -0.25 for incorrect'}</div>
                      </div>
                   </Col>
                </Row>
                
                <h4 className="mb-3">Syllabus Overview</h4>
                <div className="p-4 bg-light rounded border mb-4">
                  <p className="m-0" style={{whiteSpace: 'pre-line'}}>{exam.syllabus || 'Detailed syllabus will be published shortly before the exam notification.'}</p>
                </div>

                <h4 className="mb-3">Exam Pattern</h4>
                <div className="p-4 bg-light rounded border">
                  <p className="m-0" style={{whiteSpace: 'pre-line'}}>{exam.examPattern || 'Preliminary Round -> Mains Examination -> Personal Interview.'}</p>
                </div>
              </div>
            )}

            {activeTab === 'Super Coaching' && (
              <div className="animate__animated animate__fadeIn">
                <h4 className="mb-3">Super Coaching Courses</h4>
                <p className="text-muted">Accelerate your {exam.name} prep with interactive live batches by top educators.</p>
                <div className="d-flex flex-column gap-3">
                   <div className="p-4 border rounded shadow-sm d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                      <div>
                        <Badge bg="danger" className="mb-2">Bestseller</Badge>
                        <h5 className="mb-1">{exam.name} Foundation Batch 2024</h5>
                        <div className="text-muted small mb-2"><i className="bi bi-camera-video"></i> 500+ Live Classes • <i className="bi bi-journal-text"></i> 100+ Notes PDF</div>
                        <div className="fw-bold text-success">₹2,999 <span className="text-muted text-decoration-line-through fw-normal ms-2">₹5,999</span></div>
                      </div>
                      <Button variant="success" className="px-4 py-2" style={{whiteSpace: 'nowrap'}}>Enroll Now</Button>
                   </div>
                   <div className="p-4 border rounded shadow-sm d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                      <div>
                        <h5 className="mb-1">{exam.name} Crash Course</h5>
                        <div className="text-muted small mb-2"><i className="bi bi-camera-video"></i> 150+ Hours • <i className="bi bi-stars"></i> Expert Strategy sessions</div>
                        <div className="fw-bold text-success">₹1,499 <span className="text-muted text-decoration-line-through fw-normal ms-2">₹3,499</span></div>
                      </div>
                      <Button variant="outline-success" className="px-4 py-2" style={{whiteSpace: 'nowrap'}}>View Batch</Button>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'Test Series' && (
              <div className="animate__animated animate__fadeIn">
                <h4 className="mb-3">Comprehensive Test Series</h4>
                <p className="text-muted">Simulate the real {exam.name} environment with exact exam-level mock tests.</p>
                <div className="d-flex flex-column gap-3">
                   {[1, 2, 3, 4, 5].map(num => (
                     <div key={num} className="p-3 border rounded d-flex justify-content-between align-items-center bg-light">
                        <div>
                          <h6 className="mb-1 text-primary">Full Mock Test {num}</h6>
                          <div className="text-muted" style={{fontSize: '0.85rem'}}>100 Questions • 120 Mins • 200 Marks</div>
                        </div>
                        <Button variant={num === 1 ? 'primary' : 'outline-primary'} size="sm" className="px-3">
                          {num === 1 ? 'Attempt Free' : 'Unlock Pro'}
                        </Button>
                     </div>
                   ))}
                </div>
              </div>
            )}

            {activeTab === 'Latest Quizzes' && (
              <div className="animate__animated animate__fadeIn">
                <h4 className="mb-3">Sectional Quizzes</h4>
                <p className="text-muted">Master subject-wise concepts with 10-minute rapid-fire quizzes.</p>
                <Row className="g-3">
                  {['Quantitative Aptitude', 'General Intelligence', 'English Language', 'General Awareness'].map((subject, idx) => (
                    <Col md={6} key={idx}>
                       <div className="p-3 border rounded h-100">
                          <h6 className="mb-2">{subject} Quiz</h6>
                          <div className="text-muted mb-3" style={{fontSize: '0.85rem'}}>10 Qs • 10 Mins • 20 Marks</div>
                          <Button variant="outline-secondary" size="sm" className="w-100">Start Quiz</Button>
                       </div>
                    </Col>
                  ))}
                </Row>
              </div>
            )}

            {activeTab === 'Prev. Papers' && (
               <div className="animate__animated animate__fadeIn">
                <h4 className="mb-3">Previous Year Papers</h4>
                <p className="text-muted">Analyze trends and difficulty levels from past actual exams.</p>
                <div className="table-responsive border rounded p-0">
                  <table className="table mb-0 text-center align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Year</th>
                        <th>Shift/Phase</th>
                        <th>Format</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {['2023', '2022', '2021', '2020'].map((year) => (
                        <tr key={year}>
                          <td className="fw-bold">{year}</td>
                          <td>Tier 1 - Shift 1</td>
                          <td><span className="badge bg-danger">PDF</span></td>
                          <td><Button variant="link" size="sm">Download</Button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Persistent Action Bar */}
            <div className="mt-4 pt-3 border-top d-flex gap-2 align-items-center">
                 <Button 
                    variant={bookmarked ? 'success' : 'outline-primary'} 
                    onClick={handleBookmark}
                    className="px-4"
                 >
                    {bookmarked ? <><i className="bi bi-bookmark-check-fill me-2"></i> Saved</> : <><i className="bi bi-bookmark me-2"></i> Save Exam for Later</>}
                 </Button>
                 <span className="text-muted ms-2" style={{fontSize: '0.9rem'}}>Adds this to your dashboard bookmarks.</span>
            </div>

          </Col>

          {/* Right Sidebar Promo */}
          <Col lg={4}>
            <div className="promo-sidebar mt-4 mt-lg-0">
               <div style={{fontSize: '0.9rem', opacity: 0.9}}>Preparation Starts Here — Just ₹1</div>
               <h3>{exam.name.split(' ')[0]} / CHSL</h3>
               <div className="my-3">
                 <div className="price-badge">Start ₹1 Trial</div>
               </div>
               
               <ul className="text-start m-0 p-0" style={{listStyle: 'none', fontSize: '0.9rem', lineHeight: '1.8'}}>
                 <li>✅ 10 Full Test Papers PDF</li>
                 <li>✅ 1000+ Important MCQs PDF</li>
                 <li>✅ Chapter-wise Practice Sets</li>
               </ul>

               <div className="mt-4" style={{fontSize: '0.8rem', opacity: 0.8}}>FOR 2 DAYS ONLY</div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ExamDetail;
