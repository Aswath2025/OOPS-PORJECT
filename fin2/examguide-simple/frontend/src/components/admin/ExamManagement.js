import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Table, Modal } from 'react-bootstrap';
import { createExam, getAllExams } from '../../api/apiService';

const ExamManagement = () => {
  const [exams, setExams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    conductingBody: '',
    category: '',
    level: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await getAllExams();
      setExams(response.data);
    } catch (error) {
      console.error('Failed to fetch exams:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createExam(formData);
      setMessage('Exam created successfully');
      setFormData({});
      setShowModal(false);
      fetchExams();
    } catch (error) {
      setMessage('Failed to create exam');
    }
  };

  return (
    <Container className="my-5">
      <h1 className="mb-4">Exam Management</h1>

      {message && <Alert variant="info" dismissible onClose={() => setMessage('')}>{message}</Alert>}

      <Button variant="primary" className="mb-3" onClick={() => setShowModal(true)}>Add New Exam</Button>

      <Card>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Conducting Body</th>
                <th>Category</th>
                <th>Level</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam) => (
                <tr key={exam.id}>
                  <td>{exam.id}</td>
                  <td>{exam.name}</td>
                  <td>{exam.conductingBody}</td>
                  <td>{exam.category}</td>
                  <td>{exam.level}</td>
                  <td>
                    <Button variant="info" size="sm" className="me-2">Edit</Button>
                    <Button variant="danger" size="sm">Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Exam</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Exam Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Conducting Body</Form.Label>
              <Form.Control
                type="text"
                name="conductingBody"
                value={formData.conductingBody}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select name="category" value={formData.category} onChange={handleChange}>
                <option value="">Select Category</option>
                <option value="Banking">Banking</option>
                <option value="Engineering">Engineering</option>
                <option value="CivilServices">Civil Services</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Level</Form.Label>
              <Form.Select name="level" value={formData.level} onChange={handleChange}>
                <option value="">Select Level</option>
                <option value="National">National</option>
                <option value="State">State</option>
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">Create Exam</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ExamManagement;
