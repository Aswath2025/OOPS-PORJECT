import React, { useState, useRef } from 'react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ExamsMegaMenu from './ExamsMegaMenu';
import '../../styles/Layout.css';

const NavigationBar = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const hideTimeoutRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMouseEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    setShowMegaMenu(true);
  };

  const handleMouseLeave = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setShowMegaMenu(false);
    }, 400); // 400ms delay gives adequate time to move the mouse down
  };

  return (
    <Navbar bg="dark" expand="lg" sticky="top" style={{ position: 'relative' }}>
      <Container>
        <Navbar.Brand onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          ExamGuide
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {!isAuthenticated ? (
              <>
                <Nav.Link onClick={() => navigate('/login')}>Login</Nav.Link>
                <Nav.Link onClick={() => navigate('/register')}>Register</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link onClick={() => navigate('/dashboard')}>Dashboard</Nav.Link>
                
                {/* Mega Menu Trigger Wrapper */}
                <div 
                  className="nav-item mega-menu-wrapper"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <Nav.Link 
                    onClick={() => navigate('/exams')}
                    className={showMegaMenu ? 'active' : ''}
                  >
                    Exams <i className="bi bi-chevron-down ms-1" style={{fontSize: '0.75rem'}}></i>
                  </Nav.Link>
                  {showMegaMenu && <ExamsMegaMenu onClose={() => setShowMegaMenu(false)} />}
                </div>

                <Nav.Link onClick={() => navigate('/bookmarks')}>Bookmarks</Nav.Link>
                <Nav.Link onClick={() => navigate('/scholarships')}>Scholarships</Nav.Link>
                <Nav.Link onClick={() => navigate('/materials')}>Materials</Nav.Link>
                <Nav.Link onClick={() => navigate('/recommendations')}>Recommendations</Nav.Link>
                {isAdmin && (
                  <Nav.Link onClick={() => navigate('/admin')}>Admin Dashboard</Nav.Link>
                )}
                <Dropdown className="d-inline ms-3">
                  <Dropdown.Toggle variant="outline-light" id="user-dropdown">
                      {user?.fullName || user?.email || 'User'}
                    </Dropdown.Toggle>
                  <Dropdown.Menu align="end">
                    <Dropdown.Item onClick={() => navigate('/profile')}>
                      My Profile
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
