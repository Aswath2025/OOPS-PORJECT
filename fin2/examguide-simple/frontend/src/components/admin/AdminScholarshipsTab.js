import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Badge, Modal, Form, Row, Col, Spinner, InputGroup } from 'react-bootstrap';
import { getAllScholarships, createScholarship, updateScholarship, deleteScholarship } from '../../api/apiService';

const AdminScholarshipsTab = ({ activeTab }) => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentScholarship, setCurrentScholarship] = useState(getInitialState());
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  function getInitialState() {
    return {
      name: '', provider: '', amount: '', deadline: '', eligibility: '', applicationUrl: ''
    };
  }

  useEffect(() => {
    if (activeTab === 'scholarships') {
      fetchScholarships();
    }
  }, [activeTab]);

  const fetchScholarships = async () => {
    try {
      setLoading(true);
      const res = await getAllScholarships();
      setScholarships(res.data || []);
    } catch (err) {
      console.error("Failed to load scholarships", err);
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (item = null) => {
    if (item) {
      setCurrentScholarship({ ...item });
      setIsEditing(true);
    } else {
      setCurrentScholarship(getInitialState());
      setIsEditing(false);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentScholarship(getInitialState());
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentScholarship((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isEditing) {
        await updateScholarship(currentScholarship.id, currentScholarship);
      } else {
        await createScholarship(currentScholarship);
      }
      fetchScholarships();
      handleCloseModal();
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save scholarship.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this scholarship?")) {
      try {
        await deleteScholarship(id);
        fetchScholarships();
      } catch (err) {
        console.error("Delete failed", err);
        alert("Failed to delete scholarship.");
      }
    }
  };

  const filteredData = scholarships.filter(s => 
    (s.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
    (s.provider?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Card className="border-0 shadow-sm rounded-4 mb-4">
        <Card.Body className="p-4 d-flex justify-content-between align-items-center bg-light rounded-4">
          <div>
            <h4 className="fw-bold mb-1">Scholarship Programs</h4>
            <p className="text-muted mb-0">Manage financial aid, grants, and scholarship postings.</p>
          </div>
          <Button variant="success" className="rounded-pill px-4 fw-bold shadow-sm" onClick={() => handleShowModal()}>
            <i className="bi bi-plus-lg me-2"></i> Add Scholarship
          </Button>
        </Card.Body>
      </Card>

      <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-5">
        <div className="p-3 border-bottom bg-white d-flex justify-content-between align-items-center">
          <InputGroup style={{ maxWidth: '300px' }}>
            <InputGroup.Text className="bg-white border-end-0 text-muted"><i className="bi bi-search"></i></InputGroup.Text>
            <Form.Control 
              placeholder="Search scholarships..." 
              className="border-start-0 ps-0" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
          <Badge bg="success" pill>{filteredData.length} Active</Badge>
        </div>

        {loading ? (
          <div className="text-center py-5"><Spinner animation="border" variant="success" /></div>
        ) : (
          <div className="table-responsive" style={{ maxHeight: '600px' }}>
            <Table hover className="mb-0 align-middle">
              <thead className="bg-light position-sticky top-0 shadow-sm" style={{ zIndex: 1 }}>
                <tr>
                  <th className="py-3 px-4 text-muted border-bottom-0">ID</th>
                  <th className="py-3 text-muted border-bottom-0">Title</th>
                  <th className="py-3 text-muted border-bottom-0 d-none d-md-table-cell">Provider</th>
                  <th className="py-3 text-muted border-bottom-0">Amount</th>
                  <th className="py-3 text-muted border-bottom-0 d-none d-lg-table-cell">Deadline</th>
                  <th className="py-3 px-4 text-muted border-bottom-0 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                    <tr><td colSpan="6" className="text-center py-5 text-muted">No scholarships found.</td></tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 text-muted">#{item.id}</td>
                      <td className="fw-semibold text-dark">{item.name}</td>
                      <td className="text-muted d-none d-md-table-cell">{item.provider}</td>
                      <td className="fw-bold text-success">{item.amount}</td>
                      <td className="text-muted d-none d-lg-table-cell">
                        {item.deadline ? new Date(item.deadline).toLocaleDateString() : 'Rolling'}
                      </td>
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
          <Modal.Title className="fw-bold fs-5 text-success">
            {isEditing ? 'Edit Scholarship' : 'Post New Scholarship'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="p-4">
            <Row className="g-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold small text-muted">Scholarship Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control type="text" name="name" value={currentScholarship.name} onChange={handleChange} required placeholder="e.g., National Merit Scholarship" />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold small text-muted">Provider/Organization <span className="text-danger">*</span></Form.Label>
                  <Form.Control type="text" name="provider" value={currentScholarship.provider} onChange={handleChange} required placeholder="e.g., Ministry of Education" />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold small text-muted">Grant Amount</Form.Label>
                  <Form.Control type="text" name="amount" value={currentScholarship.amount} onChange={handleChange} placeholder="e.g., ₹50,000/year or Fully Funded" />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold small text-muted">Eligibility Criteria</Form.Label>
                  <Form.Control as="textarea" rows={2} name="eligibility" value={currentScholarship.eligibility} onChange={handleChange} placeholder="Who can apply for this?" />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold small text-muted">Application Deadline</Form.Label>
                  <Form.Control type="date" name="deadline" value={currentScholarship.deadline ? currentScholarship.deadline.split('T')[0] : ''} onChange={handleChange} />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold small text-muted">Application URL</Form.Label>
                  <Form.Control type="url" name="applicationUrl" value={currentScholarship.applicationUrl} onChange={handleChange} placeholder="https://" />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="bg-light">
            <Button variant="outline-secondary" className="rounded-pill px-4" onClick={handleCloseModal} disabled={submitting}>Cancel</Button>
            <Button variant="success" type="submit" className="rounded-pill px-4" disabled={submitting}>
              {submitting ? <Spinner size="sm" animation="border" /> : (isEditing ? 'Save Changes' : 'Publish Scholarship')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default AdminScholarshipsTab;
