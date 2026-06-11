import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Badge, Modal, Form, Row, Col, Spinner, InputGroup } from 'react-bootstrap';
import { getAllExams, createExam, updateExam, deleteExam } from '../../api/apiService';

const AdminExamsTab = ({ activeTab }) => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentExam, setCurrentExam] = useState(getInitialExamState());
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  function getInitialExamState() {
    return {
      name: '', category: 'SSC', conductingBody: '', level: 'NATIONAL', 
      mode: 'ONLINE / CBT', eligibilityCriteria: '', notificationDate: '', 
      lastDateToApply: '', examDate: '', applicationFee: 0, 
      selectionProcess: '', detailsUrl: '', popularity: 1
    };
  }

  useEffect(() => {
    if (activeTab === 'exams') {
      fetchExams();
    }
  }, [activeTab]);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const res = await getAllExams({ size: 1000, sort: 'name' }); // Fetch large batch for admin search
      setExams(res.data.content || []);
    } catch (err) {
      console.error("Failed to load exams", err);
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (exam = null) => {
    if (exam) {
      setCurrentExam({ ...exam });
      setIsEditing(true);
    } else {
      setCurrentExam(getInitialExamState());
      setIsEditing(false);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentExam(getInitialExamState());
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentExam((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isEditing) {
        await updateExam(currentExam.id, currentExam);
      } else {
        await createExam(currentExam);
      }
      fetchExams();
      handleCloseModal();
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save exam. Check console for details.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to completely delete this exam?")) {
      try {
        await deleteExam(id);
        fetchExams();
      } catch (err) {
        console.error("Delete failed", err);
        alert("Failed to delete exam.");
      }
    }
  };

  const filteredExams = exams.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Card className="border-0 shadow-sm rounded-4 mb-4">
        <Card.Body className="p-4 d-flex justify-content-between align-items-center bg-light rounded-4">
          <div>
            <h4 className="fw-bold mb-1">Exam Repository</h4>
            <p className="text-muted mb-0">Manage and update all competitive exams in the system.</p>
          </div>
          <Button variant="primary" className="rounded-pill px-4 fw-bold shadow-sm" onClick={() => handleShowModal()}>
            <i className="bi bi-plus-lg me-2"></i> Add New Exam
          </Button>
        </Card.Body>
      </Card>

      <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-5">
        <div className="p-3 border-bottom bg-white d-flex justify-content-between align-items-center">
          <InputGroup style={{ maxWidth: '300px' }}>
            <InputGroup.Text className="bg-white border-end-0 text-muted"><i className="bi bi-search"></i></InputGroup.Text>
            <Form.Control 
              placeholder="Search exams..." 
              className="border-start-0 ps-0" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
          <Badge bg="primary" pill>{filteredExams.length} Exams</Badge>
        </div>

        {loading ? (
          <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
        ) : (
          <div className="table-responsive" style={{ maxHeight: '600px' }}>
            <Table hover className="mb-0 align-middle">
              <thead className="bg-light position-sticky top-0 shadow-sm" style={{ zIndex: 1 }}>
                <tr>
                  <th className="py-3 px-4 text-muted border-bottom-0">ID</th>
                  <th className="py-3 text-muted border-bottom-0">Exam Name</th>
                  <th className="py-3 text-muted border-bottom-0 text-center">Category</th>
                  <th className="py-3 text-muted border-bottom-0 d-none d-md-table-cell">Conducting Body</th>
                  <th className="py-3 text-muted border-bottom-0 d-none d-lg-table-cell">Date</th>
                  <th className="py-3 px-4 text-muted border-bottom-0 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExams.length === 0 ? (
                    <tr><td colSpan="6" className="text-center py-5 text-muted">No exams found matching your search.</td></tr>
                ) : (
                  filteredExams.map((exam) => (
                    <tr key={exam.id}>
                      <td className="px-4 text-muted">#{exam.id}</td>
                      <td className="fw-semibold text-dark">{exam.name}</td>
                      <td className="text-center"><Badge bg="light" text="dark" className="border fw-normal">{exam.category}</Badge></td>
                      <td className="text-muted d-none d-md-table-cell text-truncate" style={{maxWidth:'150px'}}>{exam.conductingBody}</td>
                      <td className="text-muted d-none d-lg-table-cell">{exam.examDate ? new Date(exam.examDate).toLocaleDateString() : 'TBA'}</td>
                      <td className="px-4 text-end">
                        <Button variant="outline-primary" size="sm" className="rounded-pill px-3 me-2" onClick={() => handleShowModal(exam)}>
                          Edit
                        </Button>
                        <Button variant="outline-danger" size="sm" className="rounded-pill px-3" onClick={() => handleDelete(exam.id)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        )}
      </Card>

      {/* Create / Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered backdrop="static">
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="fw-bold fs-5">
            {isEditing ? 'Edit Exam Record' : 'Create New Exam'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="p-4">
            <Row className="g-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold small text-muted">Exam Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control type="text" name="name" value={currentExam.name} onChange={handleChange} required placeholder="e.g., SSC CGL 2024" />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold small text-muted">Category <span className="text-danger">*</span></Form.Label>
                  <Form.Select name="category" value={currentExam.category} onChange={handleChange} required>
                    <option value="SSC">SSC</option>
                    <option value="Banking">Banking</option>
                    <option value="Defence">Defence</option>
                    <option value="Railways">Railways</option>
                    <option value="Civil Services">Civil Services</option>
                    <option value="Teaching">Teaching</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Medical">Medical</option>
                    <option value="Law">Law</option>
                    <option value="State Exams">State Exams</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold small text-muted">Conducting Body</Form.Label>
                  <Form.Control type="text" name="conductingBody" value={currentExam.conductingBody} onChange={handleChange} placeholder="e.g., UPSC, NTA" />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                 <Form.Group>
                  <Form.Label className="fw-semibold small text-muted">Level</Form.Label>
                  <Form.Select name="level" value={currentExam.level} onChange={handleChange}>
                    <option value="NATIONAL">NATIONAL</option>
                    <option value="STATE">STATE</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                 <Form.Group>
                  <Form.Label className="fw-semibold small text-muted">Mode</Form.Label>
                  <Form.Select name="mode" value={currentExam.mode} onChange={handleChange}>
                    <option value="ONLINE / CBT">ONLINE / CBT</option>
                    <option value="OFFLINE / OMR">OFFLINE / OMR</option>
                    <option value="HYBRID (CBT + INTERVIEW)">HYBRID</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold small text-muted">Application Fee (₹)</Form.Label>
                  <Form.Control type="number" name="applicationFee" value={currentExam.applicationFee} onChange={handleChange} />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold small text-muted">Exam Date</Form.Label>
                  <Form.Control type="date" name="examDate" value={currentExam.examDate ? currentExam.examDate.split('T')[0] : ''} onChange={handleChange} />
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold small text-muted">App Deadline</Form.Label>
                  <Form.Control type="date" name="lastDateToApply" value={currentExam.lastDateToApply ? currentExam.lastDateToApply.split('T')[0] : ''} onChange={handleChange} />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold small text-muted">Eligibility Criteria</Form.Label>
                  <Form.Control as="textarea" rows={2} name="eligibilityCriteria" value={currentExam.eligibilityCriteria} onChange={handleChange} placeholder="e.g., Graduation in any discipline" />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold small text-muted">Official Portal URL</Form.Label>
                  <Form.Control type="url" name="detailsUrl" value={currentExam.detailsUrl} onChange={handleChange} placeholder="https://" />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="bg-light">
            <Button variant="outline-secondary" className="rounded-pill px-4" onClick={handleCloseModal} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" className="rounded-pill px-4" disabled={submitting}>
              {submitting ? <Spinner size="sm" animation="border" /> : (isEditing ? 'Save Changes' : 'Publish Exam')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default AdminExamsTab;
