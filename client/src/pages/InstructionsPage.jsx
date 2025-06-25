import React from 'react';
import { Container, Row, Col, Card, Alert, Badge, ListGroup } from 'react-bootstrap';

const InstructionPage = () => {
  return (
    <Container className="my-5">
      <Row>
        <Col lg={10} xl={8} className="mx-auto">
          <Card className="shadow-lg border-0">
            {/* Header */}
            <Card.Header className="bg-dark text-white text-center py-4">
              <h1 className="display-4 mb-0">🎲 Stuff Happens</h1>
              <p className="lead mb-0 mt-2">How to Play</p>
            </Card.Header>
            
            <Card.Body className="p-5">
              {/* Game Overview */}
              <section className="mb-5">
                <h2 className="h3 text-primary mb-3">
                  <Badge bg="primary" className="me-2">1</Badge>
                  Game Overview
                </h2>
                <p className="lead">
                  Stuff Happens is a single-player card game where you compete against the computer 
                  to collect exactly <strong>6 cards</strong>, each representing a terrible situation.
                </p>
                <Alert variant="info" className="mb-0">
                  <strong>Goal:</strong> Collect 6 misfortune cards by correctly guessing where new situations 
                  fit among your existing cards based on their misfortune index (1-100).
                </Alert>
              </section>

              {/* Card System */}
              <section className="mb-5">
                <h2 className="h3 text-primary mb-3">
                  <Badge bg="primary" className="me-2">2</Badge>
                  The Card System
                </h2>
                <p>Each card contains:</p>
                <ListGroup variant="flush" className="mb-3">
                  <ListGroup.Item className="d-flex justify-content-between align-items-center">
                    <span><strong>Situation Name:</strong> Description of the terrible event</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between align-items-center">
                    <span><strong>Image:</strong> Visual representation of the situation</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between align-items-center">
                    <span><strong>Misfortune Index:</strong> Rating from 1-100</span>
                    <Badge bg="secondary">1 = "Not serious" | 100 = "Why me?!"</Badge>
                  </ListGroup.Item>
                </ListGroup>
                <Alert variant="warning">
                  <strong>Note:</strong> Each card has a unique misfortune index
                </Alert>
              </section>

              {/* Game Flow */}
              <section className="mb-5">
                <h2 className="h3 text-primary mb-3">
                  <Badge bg="primary" className="me-2">3</Badge>
                  How to Play
                </h2>
                
                <div className="mb-4">
                  <h4 className="h5 text-success">Game Start</h4>
                  <p>You begin with <strong>3 random cards</strong> that are immediately visible with all their details, sorted by misfortune index.</p>
                </div>

                <div className="mb-4">
                  <h4 className="h5 text-success">Each Round</h4>
                  <ol className="ps-4">
                    <li className="mb-2">
                      <strong>New Situation:</strong> You'll see a new terrible situation (name and image only, 
                      <em> no misfortune index</em>).
                    </li>
                    <li className="mb-2">
                      <strong>Make Your Guess:</strong> Looking at your existing cards (sorted by misfortune index), 
                      decide where this new situation fits in the sequence.
                    </li>
                    <li className="mb-2">
                      <strong>Time Limit:</strong> You have <Badge bg="danger">30 seconds</Badge> to make your choice.
                    </li>
                    <li className="mb-2">
                      <strong>Results:</strong>
                      <ul className="mt-2">
                        <li><strong>Correct guess:</strong> You get the card and see all its details</li>
                        <li><strong>Wrong guess or timeout:</strong> You don't get the card (and won't see it again)</li>
                      </ul>
                    </li>
                  </ol>
                </div>
              </section>

              {/* Win/Lose Conditions */}
              <section className="mb-5">
                <h2 className="h3 text-primary mb-3">
                  <Badge bg="primary" className="me-2">4</Badge>
                  Win/Lose Conditions
                </h2>
                <Row>
                  <Col md={6}>
                    <Alert variant="success">
                      <Alert.Heading>🎉 You Win!</Alert.Heading>
                      <p className="mb-0">Collect exactly <strong>6 cards</strong> total</p>
                    </Alert>
                  </Col>
                  <Col md={6}>
                    <Alert variant="danger">
                      <Alert.Heading>💀 You Lose!</Alert.Heading>
                      <p className="mb-0">Guess incorrectly <strong>3 times</strong></p>
                    </Alert>
                  </Col>
                </Row>
              </section>

              {/* User Types */}
              <section className="mb-5">
                <h2 className="h3 text-primary mb-3">
                  <Badge bg="primary" className="me-2">5</Badge>
                  User Types
                </h2>
                <Row>
                  <Col lg={6}>
                    <Card className="h-100 border-success">
                      <Card.Header className="bg-success text-white">
                        <h5 className="mb-0">🔐 Registered Users</h5>
                      </Card.Header>
                      <Card.Body>
                        <ListGroup variant="flush">
                          <ListGroup.Item>Play full games until completion</ListGroup.Item>
                          <ListGroup.Item>Game history saved in profile</ListGroup.Item>
                          <ListGroup.Item>View detailed match statistics</ListGroup.Item>
                          <ListGroup.Item>Track cards won/lost per round</ListGroup.Item>
                        </ListGroup>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col lg={6}>
                    <Card className="h-100 border-info">
                      <Card.Header className="bg-info text-white">
                        <h5 className="mb-0">👤 Demo Users</h5>
                      </Card.Header>
                      <Card.Body>
                        <ListGroup variant="flush">
                          <ListGroup.Item>View game instructions</ListGroup.Item>
                          <ListGroup.Item>Play demo (1 round only)</ListGroup.Item>
                          <ListGroup.Item>Start with 3 initial cards</ListGroup.Item>
                          <ListGroup.Item>No game history saved</ListGroup.Item>
                        </ListGroup>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </section>

              {/* Game End */}
              <section>
                <h2 className="h3 text-primary mb-3">
                  <Badge bg="primary" className="me-2">6
                  </Badge>
                  Game End
                </h2>
                <p>
                  When a game ends (win or lose), you'll see a summary showing all your cards with their 
                  complete details (name, image, and misfortune index). You can then choose to start a new game.
                </p>
                <Alert variant="success">
                  <strong>Ready to play?</strong> Good luck collecting those misfortune cards! 🍀
                </Alert>
              </section>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default InstructionPage;