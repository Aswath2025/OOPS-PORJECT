import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { getAllMaterials, getMaterialsByType } from '../../api/apiService';

const MaterialsList = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchMaterials();
  }, [filter]);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      let response;
      if (filter) {
        response = await getMaterialsByType(filter);
      } else {
        response = await getAllMaterials();
      }
      setMaterials(response.data);
    } catch (error) {
      console.error('Failed to fetch materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMediaIcon = (type) => {
    switch (type) {
      case 'PDF': return <i className="bi bi-file-earmark-pdf-fill text-danger fs-3"></i>;
      case 'Video': return <i className="bi bi-play-circle-fill text-info fs-3"></i>;
      case 'Link': return <i className="bi bi-link-45deg text-primary fs-3"></i>;
      default: return <i className="bi bi-journal-text text-secondary fs-3"></i>;
    }
  };

  return (
    <div className="bg-light pb-5 min-vh-100">
      <div className="bg-white border-bottom py-4 mb-5">
        <Container>
          <div className="d-flex align-items-center gap-3">
             <div className="icon-box info" style={{ backgroundColor: 'rgba(14, 165, 233, 0.15)', color: '#0ea5e9' }}>
               <i className="bi bi-book-half"></i>
             </div>
             <div>
               <h1 className="fw-bold mb-0">Study Materials</h1>
               <p className="text-muted mb-0">Access premium notes, video lectures, and resources</p>
             </div>
          </div>
        </Container>
      </div>

      <Container>
        {/* Interactive Pill Navigation Filters */}
        <div className="mb-5 animate-fade-in shadow-sm p-3 bg-white rounded-pill d-inline-block">
           <div className="pill-nav m-0 p-0 d-flex flex-wrap gap-2">
              <div className={`pill-tab ${filter === '' ? 'active' : ''}`} onClick={() => setFilter('')}>
                 All Materials
              </div>
              <div className={`pill-tab ${filter === 'PDF' ? 'active' : ''}`} onClick={() => setFilter('PDF')}>
                 <i className="bi bi-file-earmark-pdf me-2"></i>PDFs
              </div>
              <div className={`pill-tab ${filter === 'Video' ? 'active' : ''}`} onClick={() => setFilter('Video')}>
                 <i className="bi bi-play-circle me-2"></i>Videos
              </div>
              <div className={`pill-tab ${filter === 'Link' ? 'active' : ''}`} onClick={() => setFilter('Link')}>
                 <i className="bi bi-link me-2"></i>External Links
              </div>
           </div>
        </div>

        {loading ? (
           <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>
        ) : (
          <Row className="g-4 animate-slide-up">
            {materials.length === 0 ? (
               <Col xs={12} className="text-center py-5">
                  <h4 className="text-muted">No materials found for this filter.</h4>
               </Col>
            ) : (
               materials.map((material) => (
                <Col md={6} lg={4} key={material.id}>
                  <Card className="hover-card h-100 border-0 shadow-sm rounded-4">
                    <Card.Body className="p-4">
                      <div className="d-flex align-items-start gap-3 mb-3">
                         <div className="icon-box bg-light flex-shrink-0" style={{ width: '56px', height: '56px' }}>
                            {getMediaIcon(material.type)}
                         </div>
                         <div>
                           <Card.Title className="fw-bold mb-1 fs-5 lh-sm">{material.title}</Card.Title>
                           <p className="text-muted small fw-medium text-uppercase mb-0">{material.type}</p>
                         </div>
                      </div>
                      
                      {material.description && <p className="text-secondary small mt-3 mb-0" style={{ lineHeight: '1.6' }}>{material.description}</p>}
                    </Card.Body>
                    <Card.Footer className="bg-white border-top-0 p-4 pt-0 d-flex justify-content-between align-items-center">
                      {material.downloadCount ? (
                         <div className="text-muted small fw-bold">
                            <i className="bi bi-download me-1"></i> {material.downloadCount}
                         </div>
                      ) : <div></div>}
                      <Button 
                        variant="outline-primary" 
                        className="rounded-pill px-4 fw-bold"
                        href={material.fileUrl || material.externalLink || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open <i className="bi bi-arrow-right ms-1"></i>
                      </Button>
                    </Card.Footer>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default MaterialsList;
