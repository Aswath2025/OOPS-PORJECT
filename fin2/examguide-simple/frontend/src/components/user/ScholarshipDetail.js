import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Badge, Button, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { getScholarshipById, saveScholarship } from '../../api/apiService';

const ScholarshipDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    fetchScholarship();
  }, [id]);

  const fetchScholarship = async () => {
    try {
      const res = await getScholarshipById(id);
      setScholarship(res.data);
    } catch (err) {
      console.error('Failed to load scholarship', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await saveScholarship(scholarship.id);
      setSaved(true);
      setSaveMsg('Scholarship saved to your bookmarks!');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (err) {
      setSaveMsg('Failed to save. Please try again.');
    }
  };

  const fmt = (date) => date ? new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';
  const daysLeft = (deadline) => {
    if (!deadline) return null;
    const diff = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  if (loading) return (
    <div className="text-center mt-5 py-5">
      <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }} />
      <p className="mt-3 text-muted">Loading scholarship details...</p>
    </div>
  );

  if (!scholarship) return (
    <div className="text-center mt-5 py-5">
      <i className="bi bi-exclamation-circle text-danger" style={{ fontSize: '3rem' }} />
      <h4 className="mt-3">Scholarship not found</h4>
      <Button variant="primary" className="mt-3" onClick={() => navigate('/scholarships')}>Back to Scholarships</Button>
    </div>
  );

  const days = daysLeft(scholarship.deadline);
  const isExpired = days !== null && days < 0;
  const isExpiringSoon = days !== null && days >= 0 && days <= 15;
  const tabs = ['Overview', 'Eligibility', 'How to Apply', 'Documents Required'];

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh', paddingBottom: '4rem' }}>
      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1c2e 0%, #2d3561 50%, #1a1c2e 100%)',
        color: 'white',
        padding: '2.5rem 0 3rem',
      }}>
        <Container>
          {/* Breadcrumb */}
          <div className="mb-3" style={{ fontSize: '0.85rem', opacity: 0.7 }}>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/scholarships')}>
              <i className="bi bi-arrow-left me-2" />Scholarships
            </span>
            {' / '}
            <span style={{ opacity: 0.9 }}>{scholarship.name}</span>
          </div>

          <Row className="align-items-center">
            <Col lg={8}>
              <div className="d-flex align-items-start gap-4 mb-4">
                <div style={{
                  width: '72px', height: '72px', borderRadius: '16px',
                  background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2rem', flexShrink: 0, border: '1px solid rgba(255,255,255,0.2)'
                }}>
                  🎓
                </div>
                <div>
                  <div className="d-flex flex-wrap gap-2 mb-2">
                    {scholarship.isFeatured && (
                      <Badge style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', fontSize: '0.75rem', padding: '0.4em 0.8em' }}>
                        ⭐ Featured
                      </Badge>
                    )}
                    {isExpired && <Badge bg="secondary">Expired</Badge>}
                    {isExpiringSoon && <Badge bg="danger">Expiring in {days} days</Badge>}
                    {!isExpired && !isExpiringSoon && days !== null && (
                      <Badge style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)' }}>
                        {days} days left
                      </Badge>
                    )}
                  </div>
                  <h1 style={{ fontWeight: 700, fontSize: '1.8rem', lineHeight: 1.3, marginBottom: '0.5rem' }}>
                    {scholarship.name}
                  </h1>
                  <p style={{ opacity: 0.8, fontSize: '1.05rem', marginBottom: 0 }}>
                    <i className="bi bi-bank2 me-2" />Provided by <strong>{scholarship.provider}</strong>
                  </p>
                </div>
              </div>

              {/* Key Stats Row */}
              <div className="d-flex flex-wrap gap-4 mt-3">
                <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '0.75rem 1.25rem', backdropFilter: 'blur(8px)' }}>
                  <div style={{ fontSize: '0.75rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Award Amount</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#4ade80' }}>{scholarship.amount || 'Varies'}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '0.75rem 1.25rem', backdropFilter: 'blur(8px)' }}>
                  <div style={{ fontSize: '0.75rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Deadline</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 600, color: isExpiringSoon ? '#fbbf24' : 'white' }}>
                    {fmt(scholarship.deadline)}
                  </div>
                </div>
                {scholarship.viewCount > 0 && (
                  <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '0.75rem 1.25rem', backdropFilter: 'blur(8px)' }}>
                    <div style={{ fontSize: '0.75rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Views</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{scholarship.viewCount.toLocaleString()}</div>
                  </div>
                )}
              </div>
            </Col>

            <Col lg={4} className="d-none d-lg-flex justify-content-end">
              <img
                src="https://illustrations.popsy.co/emerald/graduation.svg"
                alt="Scholarship"
                style={{ maxWidth: '220px', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.3))' }}
              />
            </Col>
          </Row>
        </Container>
      </div>

      <Container style={{ marginTop: '-1rem', position: 'relative', zIndex: 1 }}>
        {saveMsg && (
          <Alert variant="success" className="mb-4 shadow-sm rounded-3" dismissible onClose={() => setSaveMsg('')}>
            <i className="bi bi-check-circle-fill me-2" />{saveMsg}
          </Alert>
        )}

        <Row className="g-4">
          {/* Main Content */}
          <Col lg={8}>
            {/* Tabs */}
            <div className="bg-white rounded-3 shadow-sm overflow-hidden mb-4">
              <div className="d-flex" style={{ borderBottom: '1px solid #e9ecef', overflowX: 'auto' }}>
                {tabs.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      background: 'none', border: 'none', padding: '1rem 1.5rem',
                      fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', cursor: 'pointer',
                      color: activeTab === tab ? '#6366f1' : '#6c757d',
                      borderBottom: activeTab === tab ? '3px solid #6366f1' : '3px solid transparent',
                      transition: 'all 0.2s',
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-4">
                {/* Overview Tab */}
                {activeTab === 'Overview' && (
                  <div>
                    <p className="text-muted mb-4" style={{ fontSize: '1.05rem', lineHeight: 1.8 }}>
                      The <strong>{scholarship.name}</strong> is offered by <strong>{scholarship.provider}</strong> to support deserving students in their academic journey.
                      {scholarship.amount && ` This scholarship provides financial assistance of up to ${scholarship.amount}.`}
                    </p>

                    <Row className="g-3 mb-4">
                      {[
                        { label: 'Provider', value: scholarship.provider, icon: 'bi-bank2', color: '#6366f1' },
                        { label: 'Award Amount', value: scholarship.amount || 'Varies', icon: 'bi-currency-rupee', color: '#10b981' },
                        { label: 'Application Deadline', value: fmt(scholarship.deadline), icon: 'bi-calendar-event', color: isExpiringSoon ? '#ef4444' : '#f59e0b' },
                        { label: 'Status', value: isExpired ? 'Closed' : 'Open for Applications', icon: 'bi-circle-fill', color: isExpired ? '#6c757d' : '#10b981' },
                      ].map(({ label, value, icon, color }) => (
                        <Col sm={6} key={label}>
                          <div style={{
                            padding: '1rem 1.25rem', borderRadius: '12px',
                            border: `1px solid ${color}30`, background: `${color}08`,
                            display: 'flex', alignItems: 'center', gap: '1rem'
                          }}>
                            <div style={{
                              width: '40px', height: '40px', borderRadius: '10px',
                              background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              <i className={`bi ${icon}`} style={{ color, fontSize: '1.1rem' }} />
                            </div>
                            <div>
                              <div style={{ fontSize: '0.75rem', color: '#6c757d', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>{label}</div>
                              <div style={{ fontWeight: 600, color: '#1a1a2e', fontSize: '0.95rem' }}>{value}</div>
                            </div>
                          </div>
                        </Col>
                      ))}
                    </Row>

                    {/* Application Link */}
                    {scholarship.applicationLink && (
                      <div style={{
                        background: 'linear-gradient(135deg, #eff6ff, #e0f2fe)',
                        border: '1px solid #bae6fd', borderRadius: '12px', padding: '1.25rem'
                      }}>
                        <div className="d-flex align-items-center gap-3">
                          <i className="bi bi-link-45deg text-primary" style={{ fontSize: '1.5rem' }} />
                          <div className="flex-grow-1">
                            <div className="fw-bold mb-1">Official Application Portal</div>
                            <a href={scholarship.applicationLink} target="_blank" rel="noopener noreferrer"
                              className="text-primary small">{scholarship.applicationLink}</a>
                          </div>
                          <a href={scholarship.applicationLink} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" variant="primary" className="px-4 rounded-pill">Apply Now</Button>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Eligibility Tab */}
                {activeTab === 'Eligibility' && (
                  <div>
                    <h5 className="fw-bold mb-3">Eligibility Criteria</h5>
                    {scholarship.eligibilityCriteria ? (
                      <div style={{
                        background: '#f8faff', borderLeft: '4px solid #6366f1',
                        borderRadius: '0 12px 12px 0', padding: '1.5rem', lineHeight: 1.8
                      }}>
                        {scholarship.eligibilityCriteria.split('\n').map((line, i) => (
                          line.trim() && (
                            <div key={i} className="d-flex align-items-start gap-2 mb-2">
                              <i className="bi bi-check-circle-fill text-success mt-1 flex-shrink-0" style={{ fontSize: '0.9rem' }} />
                              <span>{line.trim()}</span>
                            </div>
                          )
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 bg-light rounded-3 text-center text-muted">
                        <i className="bi bi-info-circle fs-2 mb-2 d-block" />
                        Eligibility details will be announced with the official notification.
                      </div>
                    )}
                  </div>
                )}

                {/* How to Apply Tab */}
                {activeTab === 'How to Apply' && (
                  <div>
                    <h5 className="fw-bold mb-4">Application Process</h5>
                    {scholarship.applicationProcess ? (
                      <div style={{ lineHeight: 1.9 }}>
                        {scholarship.applicationProcess.split('\n').filter(l => l.trim()).map((step, i) => (
                          <div key={i} className="d-flex align-items-start gap-3 mb-3">
                            <div style={{
                              width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: 'white', fontWeight: 700, fontSize: '0.85rem', marginTop: '2px'
                            }}>
                              {i + 1}
                            </div>
                            <p className="mb-0" style={{ paddingTop: '4px' }}>{step.trim()}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <>
                        {[
                          { step: 'Visit the Official Website', desc: 'Go to the official scholarship portal using the application link provided.' },
                          { step: 'Register / Login', desc: 'Create a new account or log in to your existing account on the portal.' },
                          { step: 'Fill the Application Form', desc: 'Complete all required fields with accurate personal and academic information.' },
                          { step: 'Upload Documents', desc: 'Upload all required supporting documents in the specified format and size.' },
                          { step: 'Submit & Note Reference', desc: 'Review your application, submit it, and save your application reference number.' },
                        ].map(({ step, desc }, i) => (
                          <div key={i} className="d-flex align-items-start gap-3 mb-3">
                            <div style={{
                              width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: 'white', fontWeight: 700, fontSize: '0.85rem', marginTop: '2px'
                            }}>
                              {i + 1}
                            </div>
                            <div>
                              <div className="fw-semibold">{step}</div>
                              <div className="text-muted small mt-1">{desc}</div>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                )}

                {/* Documents Tab */}
                {activeTab === 'Documents Required' && (
                  <div>
                    <h5 className="fw-bold mb-4">Required Documents</h5>
                    {scholarship.requiredDocuments ? (
                      <div>
                        {scholarship.requiredDocuments.split('\n').filter(l => l.trim()).map((doc, i) => (
                          <div key={i} className="d-flex align-items-center gap-3 p-3 mb-2 border rounded-3 bg-light">
                            <i className="bi bi-file-earmark-check-fill text-success fs-5" />
                            <span>{doc.trim()}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div>
                        {[
                          'Academic Certificates & Marksheets',
                          'Income Certificate (issued by competent authority)',
                          'Aadhaar Card / Government-issued Photo ID',
                          'Passport-size Photographs (recent)',
                          'Caste / Category Certificate (if applicable)',
                          'Domicile Certificate',
                          'Bank Account Details / Passbook copy',
                          'Letter of Admission / Enrollment proof',
                        ].map((doc, i) => (
                          <div key={i} className="d-flex align-items-center gap-3 p-3 mb-2 border rounded-3 bg-light">
                            <i className="bi bi-file-earmark-check-fill text-success fs-5" />
                            <span>{doc}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Col>

          {/* Right Sidebar */}
          <Col lg={4}>
            {/* Action Card */}
            <div className="bg-white rounded-3 shadow-sm p-4 mb-4 sticky-top" style={{ top: '80px' }}>
              <div className="text-center mb-4">
                <div style={{
                  fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em',
                  color: '#6c757d', fontWeight: 600, marginBottom: '0.5rem'
                }}>
                  Award Amount
                </div>
                <div style={{
                  fontSize: '2.2rem', fontWeight: 700,
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                }}>
                  {scholarship.amount || 'View Details'}
                </div>
                {!isExpired && scholarship.deadline && (
                  <div className="mt-2" style={{ color: isExpiringSoon ? '#ef4444' : '#6c757d', fontSize: '0.9rem', fontWeight: 500 }}>
                    <i className="bi bi-clock me-1" />
                    {days === 0 ? 'Last day to apply!' : `${days} days remaining`}
                  </div>
                )}
                {isExpired && (
                  <div className="mt-2 text-danger small fw-bold">Applications Closed</div>
                )}
              </div>

              <div className="d-grid gap-2">
                {scholarship.applicationLink && !isExpired && (
                  <a href={scholarship.applicationLink} target="_blank" rel="noopener noreferrer">
                    <Button variant="primary" className="w-100 py-2 fw-bold rounded-pill" size="lg">
                      <i className="bi bi-box-arrow-up-right me-2" />Apply Now
                    </Button>
                  </a>
                )}
                <Button
                  variant={saved ? 'success' : 'outline-primary'}
                  className="py-2 fw-bold rounded-pill"
                  onClick={handleSave}
                >
                  {saved
                    ? <><i className="bi bi-bookmark-check-fill me-2" />Saved to Bookmarks</>
                    : <><i className="bi bi-bookmark-plus me-2" />Save Scholarship</>
                  }
                </Button>
                <Button variant="outline-secondary" className="py-2 rounded-pill"
                  onClick={() => navigate('/scholarships')}>
                  <i className="bi bi-arrow-left me-2" />Back to List
                </Button>
              </div>

              <hr className="my-4" />

              {/* Quick Info */}
              <div className="d-flex flex-column gap-3">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted small">Provider</span>
                  <span className="fw-semibold small">{scholarship.provider}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted small">Deadline</span>
                  <span className="fw-semibold small">{fmt(scholarship.deadline)}</span>
                </div>
                {scholarship.saveCount > 0 && (
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted small">Times Saved</span>
                    <span className="fw-semibold small">{scholarship.saveCount}</span>
                  </div>
                )}
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted small">Status</span>
                  <Badge bg={isExpired ? 'secondary' : 'success'}>
                    {isExpired ? 'Closed' : 'Open'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Tips Card */}
            <div style={{
              background: 'linear-gradient(135deg, #fdf4ff, #f0f9ff)',
              border: '1px solid #e9d5ff', borderRadius: '16px', padding: '1.5rem'
            }}>
              <h6 className="fw-bold mb-3">
                <i className="bi bi-lightbulb-fill text-warning me-2" />Pro Application Tips
              </h6>
              <ul className="list-unstyled mb-0">
                {[
                  'Apply well before the deadline',
                  'Keep scanned documents ready (PDF, JPEG)',
                  'Double-check eligibility before applying',
                  'Save your application reference number',
                ].map((tip, i) => (
                  <li key={i} className="d-flex align-items-start gap-2 mb-2">
                    <i className="bi bi-check2-circle text-success flex-shrink-0 mt-1" />
                    <span style={{ fontSize: '0.875rem', color: '#374151' }}>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ScholarshipDetail;
