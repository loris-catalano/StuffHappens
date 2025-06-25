import React, { useContext, useState } from 'react';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

import API from '../API/API.mjs'; 



function HomePage() {
    const { user } = useContext(AuthContext);
    const [error, setError] = useState(null);

    const handleStart = async () => {
        try {
            const response = await API.startGame();
            const initialCards = response.initialCards;
            navigate("/game", {
                state: {
                    initialCards: initialCards || [],
                    user: user || null
                }
            });
        } catch (err) {
            setError(err.message || "An error occurred while starting the game.");
        }
    }

    const navigate = useNavigate();

    return (
        <Container className="d-flex flex-column justify-content-center align-items-center py-5" style={{ minHeight: "80vh" }}>
            <Row className="w-100 justify-content-center">
                <Col md={8} className="text-center p-4 bg-white rounded shadow">
                    <h1 className="text-warning fw-bold mb-4">Welcome to Stuff Happens!</h1>
                    <p className="text-secondary fs-5 mb-4">
                        {user
                            ? `Hello, ${user.name}. Press Start to begin a new game.`
                            : "Try the demo game or log in to play and save your progress."}
                    </p>
                    {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
                    
                    <Button
                        variant="warning"
                        size="lg"
                        className="fw-bold px-4 py-2 shadow-sm"
                        onClick={handleStart}
                    >
                        <i className="bi bi-play-circle me-2"></i>
                        {user ? "Start" : "Try Demo"}
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}

export default HomePage;