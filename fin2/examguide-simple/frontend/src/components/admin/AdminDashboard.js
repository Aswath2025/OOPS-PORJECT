import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Alert, Spinner, Tabs, Tab } from 'react-bootstrap';
import { 
  getAdminDashboardStats, 
  getAllUsers, 
  disableUser, 
  enableUser, 
  deleteUser,
  getTodayAnalytics,
  getAnalyticsRange 
} from '../../api/apiService';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

import AdminExamsTab from './AdminExamsTab';
import AdminScholarshipsTab from './AdminScholarshipsTab';
import AdminMaterialsTab from './AdminMaterialsTab';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [todayAnalytics, setTodayAnalytics] = useState({});
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [activeKey, setActiveKey] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const statsResponse = await getAdminDashboardStats();
      const usersResponse = await getAllUsers();
      
      // Calculate last 7 days range
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 6);
      
      // Format to YYYY-MM-DD for backend
      const formatString = (date) => date.toISOString().split('T')[0];
      const startStr = formatString(start);
      const endStr = formatString(end);

      const [todayRes, rangeRes] = await Promise.all([
        getTodayAnalytics().catch(() => ({ data: {} })),
        getAnalyticsRange(startStr, endStr).catch(() => ({ data: [] }))
      ]);

      setStats(statsResponse.data);
      setUsers(usersResponse.data);
      setTodayAnalytics(todayRes.data || {});
      
      // Format chart data for recharts
      const formattedData = (rangeRes.data || []).reverse().map(item => ({
        date: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
        registrations: item.newRegistrations || 0,
        examViews: item.examViews || 0,
        scholarshipViews: item.scholarshipViews || 0,
        materialDownloads: item.materialDownloads || 0,
        recommendations: item.recommendationsGenerated || 0
      }));
      
      // If we don't have exactly 7 days of data, pad it out
      if (formattedData.length < 7) {
        const dummyData = [];
        for (let i = 0; i < 7 - formattedData.length; i++) {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          dummyData.push({
            date: d.toLocaleDateString('en-US', { weekday: 'short' }),
            registrations: 0, examViews: 0, scholarshipViews: 0, materialDownloads: 0, recommendations: 0
          });
        }
        setChartData([...dummyData, ...formattedData]);
      } else {
        setChartData(formattedData);
      }
      
    } catch (err) {
      setError('Failed to load admin dashboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDisableUser = async (userId) => {
    try {
      await disableUser(userId);
      setMessage('User disabled successfully');
      fetchDashboardData();
    } catch (err) {
      setError('Failed to disable user');
    }
  };

  const handleEnableUser = async (userId) => {
    try {
      await enableUser(userId);
      setMessage('User enabled successfully');
      fetchDashboardData();
    } catch (err) {
      setError('Failed to enable user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        setMessage('User deleted successfully');
        fetchDashboardData();
      } catch (err) {
        setError('Failed to delete user');
      }
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" variant="primary" />
        <span className="ms-3 fs-5">Loading admin portal...</span>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold mb-0">Admin Headquarters</h1>
        <Badge bg="primary" className="p-2 px-3 rounded-pill fs-6">Live Editing Enabled</Badge>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {message && <Alert variant="success" dismissible onClose={() => setMessage('')}>{message}</Alert>}

      <Tabs
        activeKey={activeKey}
        onSelect={(k) => setActiveKey(k)}
        className="mb-4 admin-tabs"
        variant="pills"
      >
        <Tab eventKey="overview" title={<span><i className="bi bi-graph-up-arrow me-2"></i>Analytics & Users</span>}>
          
          {/* KPI Cards */}
          <Row className="mb-4 g-4 mt-2">
            <Col md={3}>
              <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative">
                <div className="bg-primary position-absolute top-0 start-0 w-100" style={{height: '4px'}}></div>
                <Card.Body className="p-4 text-center">
                  <h1 className="display-4 fw-bold text-primary mb-1">{stats.totalUsers || 0}</h1>
                  <h6 className="text-uppercase text-muted fw-semibold tracking-wide">Total Users</h6>
                  <div className="mt-3 fs-7 bg-light rounded-pill py-1 px-3 d-inline-block">
                    <span className="text-success fw-bold">+{todayAnalytics.newRegistrations || 0}</span> today
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative">
                <div className="bg-success position-absolute top-0 start-0 w-100" style={{height: '4px'}}></div>
                <Card.Body className="p-4 text-center">
                  <h1 className="display-4 fw-bold text-success mb-1">{stats.activeUsers || 0}</h1>
                  <h6 className="text-uppercase text-muted fw-semibold tracking-wide">Active Users</h6>
                  <div className="mt-3 fs-7 bg-light rounded-pill py-1 px-3 d-inline-block text-muted">
                    Currently engaged
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative">
                <div className="bg-info position-absolute top-0 start-0 w-100" style={{height: '4px'}}></div>
                <Card.Body className="p-4 text-center">
                  <h1 className="display-4 fw-bold text-info mb-1">{todayAnalytics.examViews || 0}</h1>
                  <h6 className="text-uppercase text-muted fw-semibold tracking-wide">Exam Views Today</h6>
                  <div className="mt-3 fs-7 bg-light rounded-pill py-1 px-3 d-inline-block text-muted">
                    Platform traffic
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative">
                <div className="bg-warning position-absolute top-0 start-0 w-100" style={{height: '4px'}}></div>
                <Card.Body className="p-4 text-center">
                  <h1 className="display-4 fw-bold text-warning mb-1">{todayAnalytics.recommendationsGenerated || 0}</h1>
                  <h6 className="text-uppercase text-muted fw-semibold tracking-wide">AI Predictions Today</h6>
                  <div className="mt-3 fs-7 bg-light rounded-pill py-1 px-3 d-inline-block text-muted">
                    ML Service Activity
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Visual Analytics Charts */}
          <Row className="mb-5 g-4">
            <Col lg={7}>
              <Card className="h-100 border-0 shadow-sm rounded-4">
                <Card.Body className="p-4">
                  <h5 className="fw-bold mb-4">Traffic Insights (7 Days)</h5>
                  <div style={{ width: '100%', height: 350 }}>
                    <ResponsiveContainer>
                      <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                        <Tooltip cursor={{fill: 'rgba(226, 232, 240, 0.4)'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                        <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                        <Bar dataKey="examViews" name="Exam Views" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={20} />
                        <Bar dataKey="scholarshipViews" name="Scholarship Views" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={20} />
                        <Bar dataKey="materialDownloads" name="Material DLs" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={5}>
              <Card className="h-100 border-0 shadow-sm rounded-4">
                <Card.Body className="p-4">
                  <h5 className="fw-bold mb-4">User Growth Tracking</h5>
                  <div style={{ width: '100%', height: 350 }}>
                    <ResponsiveContainer>
                      <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} allowDecimals={false} />
                        <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                        <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                        <Line type="monotone" dataKey="registrations" name="New Users" stroke="#db2777" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                        <Line type="monotone" dataKey="recommendations" name="ML Predictions" stroke="#f59e0b" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* User Management Table */}
          <h3 className="fw-bold mb-3">User Management</h3>
          <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-5">
            <Table responsive hover className="mb-0 align-middle">
              <thead className="bg-light">
                <tr>
                  <th className="py-3 px-4 text-muted fw-semibold border-bottom-0">ID</th>
                  <th className="py-3 text-muted fw-semibold border-bottom-0">Name</th>
                  <th className="py-3 text-muted fw-semibold border-bottom-0">Email</th>
                  <th className="py-3 text-muted fw-semibold border-bottom-0">Role</th>
                  <th className="py-3 text-muted fw-semibold border-bottom-0">Status</th>
                  <th className="py-3 px-4 text-muted fw-semibold border-bottom-0 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">No users found</td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-4 text-muted fw-medium">#{user.id}</td>
                      <td className="fw-semibold text-dark">{user.fullName}</td>
                      <td className="text-muted">{user.email}</td>
                      <td>
                        <Badge bg={user.role === 'ADMIN' ? 'danger' : 'primary'} className="rounded-pill px-3 py-2 fw-medium tracking-wide border border-white">
                          {user.role}
                        </Badge>
                      </td>
                      <td>
                        <Badge bg={user.isActive ? 'success' : 'secondary'} className="rounded-pill bg-opacity-10 text-dark border-0 px-3 py-2 fw-medium">
                          <span className={`d-inline-block rounded-circle me-2 bg-${user.isActive ? 'success' : 'secondary'}`} style={{width: '8px', height: '8px'}}></span>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="px-4 text-end">
                        <div className="d-flex justify-content-end gap-2">
                          {user.isActive ? (
                            <Button variant="outline-warning" size="sm" onClick={() => handleDisableUser(user.id)} className="rounded-pill px-3 fw-medium">Disable</Button>
                          ) : (
                            <Button variant="outline-info" size="sm" onClick={() => handleEnableUser(user.id)} className="rounded-pill px-3 fw-medium">Enable</Button>
                          )}
                          <Button variant="outline-danger" size="sm" onClick={() => handleDeleteUser(user.id)} className="rounded-pill px-3 fw-medium">Delete</Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Card>
        </Tab>

        <Tab eventKey="exams" title={<span><i className="bi bi-journal-text me-2"></i>Manage Exams</span>}>
          <div className="mt-3">
            <AdminExamsTab activeTab={activeKey} />
          </div>
        </Tab>

        <Tab eventKey="scholarships" title={<span><i className="bi bi-cash-coin me-2"></i>Manage Scholarships</span>}>
          <div className="mt-3">
            <AdminScholarshipsTab activeTab={activeKey} />
          </div>
        </Tab>

        <Tab eventKey="materials" title={<span><i className="bi bi-file-earmark-pdf me-2"></i>Study Materials</span>}>
          <div className="mt-3">
            <AdminMaterialsTab activeTab={activeKey} />
          </div>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default AdminDashboard;
