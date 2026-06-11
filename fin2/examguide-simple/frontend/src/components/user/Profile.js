import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Alert } from 'react-bootstrap';
import { getUserProfile, updateUserProfile, changePassword } from '../../api/apiService';
import '../../styles/User.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({});

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await getUserProfile();
      setUser(response.data);
      setFormData(response.data);
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      await updateUserProfile(formData);
      setUser(formData);
      setEditMode(false);
      setSuccessMessage('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const handleChangePassword = async () => {
    try {
      await changePassword(passwordData.oldPassword, passwordData.newPassword);
      setPasswordData({});
      setPasswordMode(false);
      setSuccessMessage('Password changed successfully');
    } catch (err) {
      setError('Failed to change password');
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <Container className="my-5">
      <Row>
        <Col md={8} className="mx-auto">
          <Card className="mb-4">
            <Card.Header className="bg-primary">
              <h4 className="mb-0 text-white">My Profile</h4>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
              {successMessage && <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>{successMessage}</Alert>}
              
              <Row className="mb-3">
                <Col md={6}>
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="fullName"
                    value={formData.fullName || ''}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </Col>
                <Col md={6}>
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email || ''}
                    disabled
                  />
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="phoneNumber"
                    value={formData.phoneNumber || ''}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </Col>
                <Col md={6}>
                  <label className="form-label">Date of Birth</label>
                  <input
                    type="date"
                    className="form-control"
                    name="dateOfBirth"
                    value={formData.dateOfBirth || ''}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <label className="form-label">Education</label>
                  <input
                    type="text"
                    className="form-control"
                    name="education"
                    placeholder="e.g., B.Tech"
                    value={formData.education || ''}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </Col>
                <Col md={6}>
                  <label className="form-label">Category</label>
                  <select
                    className="form-control"
                    name="category"
                    value={formData.category || ''}
                    onChange={handleChange}
                    disabled={!editMode}
                  >
                    <option value="">Select Category</option>
                    <option value="General">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                  </select>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col>
                  <label className="form-label">Work Experience</label>
                  <textarea
                    className="form-control"
                    name="workExperience"
                    rows="2"
                    placeholder="Enter your work experience"
                    value={formData.workExperience || ''}
                    onChange={handleChange}
                    disabled={!editMode}
                  ></textarea>
                </Col>
              </Row>

              <div className="d-flex gap-2">
                {editMode ? (
                  <>
                    <button className="btn btn-success" onClick={handleSaveProfile}>Save Changes</button>
                    <button className="btn btn-secondary" onClick={() => setEditMode(false)}>Cancel</button>
                  </>
                ) : (
                  <button className="btn btn-primary" onClick={() => setEditMode(true)}>Edit Profile</button>
                )}
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header className="bg-warning">
              <h4 className="mb-0">Change Password</h4>
            </Card.Header>
            <Card.Body>
              {passwordMode ? (
                <>
                  <div className="mb-3">
                    <label className="form-label">Old Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={passwordData.oldPassword || ''}
                      onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={passwordData.newPassword || ''}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    />
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn btn-success" onClick={handleChangePassword}>Change Password</button>
                    <button className="btn btn-secondary" onClick={() => setPasswordMode(false)}>Cancel</button>
                  </div>
                </>
              ) : (
                <button className="btn btn-warning" onClick={() => setPasswordMode(true)}>Change Password</button>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
