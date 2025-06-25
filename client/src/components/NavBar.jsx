import { useContext, useState } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import API from '../API/API.mjs'; 

function NavBar(props) {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);
    const [expanded, setExpanded] = useState(false);

    const handleLogout = async () => {
        await logout();
        setExpanded(false);
        navigate('/');
    };

    return (
        <Navbar bg="warning" expand="lg" expanded={expanded} className="mb-3 shadow-sm">
            <Container>
                <Navbar.Brand as={Link} to="/" className="fw-bold fs-4">
                    <i className="bi bi-dice-5 me-2"></i>
                    Stuff Happens
                </Navbar.Brand>
                {<Navbar.Toggle 
                    aria-controls="navbar-nav" 
                    onClick={() => setExpanded(expanded ? false : "expanded")}
                    className="border-0"
                />}
                <Navbar.Collapse id="navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/instructions" onClick={() => setExpanded(false)} className="fw-semibold">
                            <i className="bi bi-info-circle me-1"></i>
                            Instructions
                        </Nav.Link>
                    </Nav>
                    <Nav>
                        {user ? (
                            <>
                                <Nav.Link as={Link} to="/user" onClick={() => setExpanded(false)} className="me-3 text-dark fw-semibold">
                                    <i className="bi bi-person-circle me-1"></i>
                                    {user.name || 'Unknown'}
                                </Nav.Link>
                                <Button variant="dark" onClick={handleLogout} className="rounded-pill px-3">
                                    <i className="bi bi-box-arrow-right me-1"></i>
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <Button variant="dark" as={Link} to="/login" onClick={() => setExpanded(false)} className="rounded-pill px-3">
                                <i className="bi bi-box-arrow-in-right me-1"></i>
                                Login
                            </Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavBar;