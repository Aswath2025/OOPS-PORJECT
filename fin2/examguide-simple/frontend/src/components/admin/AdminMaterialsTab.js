import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Badge, Modal, Form, Row, Col, Spinner, InputGroup } from 'react-bootstrap';
import { getAllMaterials, uploadMaterial, updateMaterial, deleteMaterial } from '../../api/apiService';

const AdminMaterialsTab = ({ activeTab }) => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState(getInitialState());
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  function getInitialState() {
    return {
      title: '', type: 'PDF', subject: '', examCategory: '', description: '', fileUrl: ''
    };
  }

  useEffect(() => {
    if (activeTab === 'materials') {
      fetchMaterials();
    }
  }, [activeTab]);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const res = await getAllMaterials();
      setMaterials(res.data || []);
    } catch (err) {
      console.error("Failed to load materials", err);
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (item = null) => {
    if (item) {
      setCurrentMaterial({ ...item });
      setIsEditing(true);
    } else {
      setCurrentMaterial(getInitialState());
      setIsEditing(false);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentMaterial(getInitialState());
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentMaterial((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Backend expects 'downloads' field to exist even if new
      const payload = { ...currentMaterial };
      if (!isEditing) payload.downloads = 0;

      if (isEditing) {
        await updateMaterial(currentMaterial.id, payload);
      } else {
        await uploadMaterial(payload);
      }
      fetchMaterials();
      handleCloseModal();
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save material.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this study material?")) {
      try {
        await deleteMaterial(id);
        fetchMaterials();
      } catch (err) {
        console.error("Delete failed", err);
        alert("Failed to delete material.");
      }
    }
  };

  const filteredData = materials.filter(m => 
    (m.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
    (m.subject?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const getMediaIcon = (type) => {
    switch (type) {
      case 'PDF': return <i className="bi bi-file-earmark-pdf-fill text-danger me-2"></i>;
      case 'VIDEO': return <i className="bi bi-play-btn-fill text-primary me-2"></i>;
      case 'LINK': return <i className="bi bi-link-45deg text-success me-2 fs-5"></i>;
      default: return <i className="bi bi-file-earmark-text text-secondary me-2"></i>;
    }
  };

  return (
    <>
      <Card className="border-0 shadow-sm rounded-4 mb-4">
        <Card.Body className="p-4 d-flex justify-content-between align-items-center bg-light rounded-4">
          <div>
            <h4 className="fw-bold mb-1">Study Materials Library</h4>
            <p className="text-muted mb-0">Upload and manage PDFs, video lectures, and resource links.</p>
          </div>
          <Button variant="info" className="text-white rounded-pill px-4 fw-bold shadow-sm" onClick={() => handleShowModal()}>
            <i className="bi bi-cloud-arrow-up-fill me-2"></i> Upload Resource
          </Button>
        </Card.Body>
      </Card>

      <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-5">
        <div className="p-3 border-bottom bg-white d-flex justify-content-between align-items-center">
          <InputGroup style={{ maxWidth: '300px' }}>
            <InputGroup.Text className="bg-white border-end-0 text-muted"><i className="bi bi-search"></i></InputGroup.Text>
            <Form.Control 
              placeholder="Search library..." 
              className="border-start-0 ps-0" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
          <Badge bg="info" pill>{filteredData.length} Files</Badge>
        </div>

        {loading ? (
          <div className="text-center py-5"><Spinner animation="border" variant="info" /></div>
        ) : (
          <div className="table-responsive" style={{ maxHeight: '600px' }}>
            <Table hover className="mb-0 align-middle">
              <thead className="bg-light position-sticky top-0 shadow-sm" style={{ zIndex: 1 }}>
                <tr>
                  <th className="py-3 px-4 text-muted border-bottom-0">ID</th>
                  <th className="py-3 text-muted border-bottom-0">Resource Title</th>
                  <th className="py-3 text-muted border-bottom-0">Type</th>
                  <th className="py-3 text-muted border-bottom-0 d-none d-md-table-cell">Subject</th>
                  <th className="py-3 text-muted border-bottom-0 d-none d-lg-table-cell">Target Exam</th>
                  <th className="py-3 px-4 text-muted border-bottom-0 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                    <tr><td colSpan="6" className="text-center py-5 text-muted">No materials found.</td></tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 text-muted">#{item.id}</td>
                      <td className="fw-semibold text-dark">
                        {getMediaIcon(item.type)} 
                        <a href={item.fileUrl || item.externalLink || '#'} target="_blank" rel="noopener noreferrer" className="text-decoration-none text-dark header-hover">
                          {item.title}
                        </a>
                      </td>
                      <td>
                        <Badge bg="light" text="dark" className="border fw-normal">{item.type}</Badge>
                      </td>
                      <td className="text-muted d-none d-md-table-cell">{item.subject}</td>
                      <td className="text-muted d-none d-lg-table-cell">{item.examCategory || 'General'}</td>
                      <td className="px-4 text-end">
                        <Button variant="outline-primary" size="sm" className="rounded-pill px-3 me-2" onClick={() => handleShowModal(item)}>Edit</Button>
                        <Button variant="outline-danger" size="sm" className="rounded-pill px-3" onClick={() => handleDelete(item.id)}>Delete</Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        )}
      </Card>

      {/* Modal Form */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered backdrop="static">
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="fw-bold fs-5 text-info">
            {isEditing ? 'Edit Material Details' : 'Upload Study Material'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="p-4">
            <Row className="g-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold small text-muted">Resource Title <span className="text-danger">*</span></Form.Label>
                  <Form.Control type="text" name="title" value={currentMaterial.title} onChange={handleChange} required placeholder="e.g., Complete Ancient History Notes" />
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold small text-muted">File Type <span className="text-danger">*</span></Form.Label>
                  <Form.Select name="type" value={currentMaterial.type} onChange={handleChange} required>
                    <option value="PDF">PDF Document</option>
                    <option value="VIDEO">Video Lecture</option>
                    <option value="LINK">External Link</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold small text-muted">Subject Domain</Form.Label>
                  <Form.Control type="text" name="subject" value={currentMaterial.subject} onChange={handleChange} placeholder="e.g., Mathematics, History" />
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold small text-muted">Target Exam Category</Form.Label>
                  <Form.Control type="text" name="examCategory" value={currentMaterial.examCategory} onChange={handleChange} placeholder="e.g., SSC, UPSC, All" />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold small text-muted">Resource URL / File Link <span className="text-danger">*</span></Form.Label>
                  <Form.Control type="url" name="fileUrl" value={currentMaterial.fileUrl} onChange={handleChange} required placeholder="https://..." />
                  <Form.Text className="text-muted">Must be a direct link to the securely hosted file or YouTube video.</Form.Text>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold small text-muted">Description & Context</Form.Label>
                  <Form.Control as="textarea" rows={3} name="description" value={currentMaterial.description} onChange={handleChange} placeholder="Brief summary of what this material covers..." />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="bg-light">
            <Button variant="outline-secondary" className="rounded-pill px-4" onClick={handleCloseModal} disabled={submitting}>Cancel</Button>
            <Button variant="info" type="submit" className="text-white rounded-pill px-4" disabled={submitting}>
              {submitting ? <Spinner size="sm" animation="border" /> : (isEditing ? 'Save Changes' : 'Upload Resource')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default AdminMaterialsTab;
