import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Form, Button, Alert, Pagination, Spinner } from 'react-bootstrap';
import { getAllExams, searchExams, bookmarkExam } from '../../api/apiService';
import { bookmarkExamForUser } from '../../api/apiService';
import { useAuth } from '../../context/AuthContext';

const ExamList = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');
  const [conductingBody, setConductingBody] = useState('');
  const [mode, setMode] = useState('');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(9);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sort, setSort] = useState('deadline');
  const [message, setMessage] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    setPage(0);
  }, [category, level]);

  useEffect(() => {
    fetchExams();
  }, [category, level, page, size, search]);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const params = { page, size };
      if (search && search.trim()) params.search = search.trim();
      if (category) params.category = category;
      if (level) params.level = level;

      const response = await getAllExams(params);
      // backend returns Page<Exam>
      const pageData = response.data;
      const content = pageData.content || pageData;
      setExams(content);
      setTotalPages(pageData.totalPages ?? 0);
      setTotalElements(pageData.totalElements ?? content.length);
    } catch (error) {
      console.error('Failed to fetch exams:', error);
      setMessage('Failed to load exams');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setPage(0);
    fetchExams();
  };

  const handleBookmark = async (examId) => {
    try {
      if (user?.id) {
        await bookmarkExamForUser(examId, user.id);
        setMessage('Exam bookmarked successfully!');
      } else {
        setMessage('Please login to bookmark exams');
      }
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to bookmark exam');
    }
  };

  const renderPaginationItems = () => {
    let items = [];
    const maxVisible = 5;
    let startPage = Math.max(0, page - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisible - 1);

    // Adjust start page if we are near the end
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(0, endPage - maxVisible + 1);
    }

    // First page and Ellipsis
    if (startPage > 0) {
      items.push(<Pagination.Item key="first" onClick={() => setPage(0)}>1</Pagination.Item>);
      if (startPage > 1) {
        items.push(<Pagination.Ellipsis key="ellipsis-start" disabled />);
      }
    }

    // Numbered pages
    for (let i = startPage; i <= endPage; i++) {
        items.push(
            <Pagination.Item key={i} active={i === page} onClick={() => setPage(i)}>
                {i + 1}
            </Pagination.Item>
        );
    }

    // Ellipsis and Last page
    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) {
        items.push(<Pagination.Ellipsis key="ellipsis-end" disabled />);
      }
      items.push(<Pagination.Item key="last" onClick={() => setPage(totalPages - 1)}>{totalPages}</Pagination.Item>);
    }

    return items;
  };

  if (loading) return <div className="text-center mt-5">Loading exams...</div>;

  return (
    <Container className="my-5">
      <h1 className="mb-4">Browse Exams</h1>

      {message && <Alert variant="info" dismissible onClose={() => setMessage('')}>{message}</Alert>}

      <Card className="mb-4">
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Control
                  type="text"
                  placeholder="Search exams..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </Col>
              <Col md={4}>
                <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="">All Categories</option>
                  <option value="Banking">Banking</option>
                  <option value="Engineering">Engineering</option>
                  <option value="CivilServices">Civil Services</option>
                  <option value="Railways">Railways</option>
                  <option value="SSC">SSC</option>
                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Select value={level} onChange={(e) => setLevel(e.target.value)}>
                  <option value="">All Levels</option>
                  <option value="National">National</option>
                  <option value="State">State</option>
                </Form.Select>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Select value={conductingBody} onChange={(e) => setConductingBody(e.target.value)}>
                  <option value="">All Bodies</option>
                  <option value="IBPS">IBPS</option>
                  <option value="SBI">SBI</option>
                  <option value="UPSC">UPSC</option>
                  <option value="IIT">IIT</option>
                  <option value="SSC">SSC</option>
                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Select value={mode} onChange={(e) => setMode(e.target.value)}>
                  <option value="">Any Mode</option>
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Select value={sort} onChange={(e) => { setSort(e.target.value); setPage(0); }}>
                  <option value="deadline">Sort: Deadline</option>
                  <option value="name">Sort: Name (A-Z)</option>
                  <option value="popularity">Sort: Popularity</option>
                </Form.Select>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={12} className="text-end">
                <Button variant="secondary" onClick={() => { setCategory(''); setLevel(''); setConductingBody(''); setMode(''); setSearch(''); setPage(0); setSort('deadline'); }}>Clear Filters</Button>
              </Col>
            </Row>
            <Button variant="primary" type="submit">Search</Button>
          </Form>
        </Card.Body>
      </Card>

      <Row>
        {exams.map((exam) => (
          <Col md={6} lg={4} key={exam.id} className="mb-3">
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title>{exam.name}</Card.Title>
                <p className="text-muted">{exam.conductingBody}</p>
                <div className="mb-2">
                  <Badge bg="primary" className="me-2">{exam.category}</Badge>
                  <Badge bg="secondary">{exam.level}</Badge>
                  {exam.examDate && new Date(exam.examDate) - new Date() < 30 * 24 * 60 * 60 * 1000 && (
                    <Badge bg="warning">Upcoming</Badge>
                  )}
                </div>
                {exam.applicationEndDate && (() => {
                  const end = new Date(exam.applicationEndDate);
                  const now = new Date();
                  const diffDays = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
                  return (
                    <div>
                      <p className="small">Deadline: <strong>{end.toLocaleDateString()}</strong></p>
                      {diffDays <= 15 && diffDays > 7 && <Badge bg="warning" className="me-2">Expires in {diffDays} days</Badge>}
                      {diffDays <= 7 && diffDays >= 0 && <Badge bg="danger" className="me-2">Expires in {diffDays} days</Badge>}
                      {diffDays < 0 && <Badge bg="secondary" className="me-2">Closed</Badge>}
                    </div>
                  );
                })()}
              </Card.Body>
              <Card.Footer className="bg-white border-top">
                <Button as="a" href={`/exams/${exam.id}`} variant="primary" size="sm" className="me-2">View Details</Button>
                <Button variant="outline-primary" size="sm" onClick={() => handleBookmark(exam.id)}>Bookmark</Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            <Pagination.Prev disabled={page === 0} onClick={() => setPage(Math.max(0, page - 1))} />
            {renderPaginationItems()}
            <Pagination.Next disabled={page >= totalPages - 1} onClick={() => setPage(Math.min(totalPages - 1, page + 1))} />
          </Pagination>
        </div>
      )}
    </Container>
  );
};

export default ExamList;
