import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Container, Row, Col, Card, Badge, ListGroup } from 'react-bootstrap';
import API from '../API/API.mjs'; 

const profileIcon = (
    <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#007bff"/>
      <circle cx="50" cy="35" r="15" fill="white"/>
      <path d="M25 75 Q25 60 50 60 Q75 60 75 75 L75 100 L25 100 Z" fill="white"/>
    </svg>
  )

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-EN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}; 

function UserPage(){
  const { user } = useContext(AuthContext);
  const [ games, setGames ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState(null);

  useEffect(() => {
    setLoading(true);

    API.getUserHistory()
      .then(response => {
        setGames(response);
      })
    .catch(err => {
      setError("Failed to load game history: " + (err.message || "Unknown error"));
    })
    .finally(() => {
      setLoading(false);
    });
  }, [user]);


  return (
    loading ? (
      <Container className="py-4">
        <Row>
          <Col className="text-center">
            <h4>Loading user history...</h4>
          </Col>
        </Row>
      </Container>
    ) : error ? (
      <Container className="py-4">
        <Row>
          <Col className="text-center text-danger">
            <h4>{error}</h4>
          </Col>
        </Row>
      </Container>
    ) : (user && <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Body className="text-center">
              <div className="mb-3">
                {profileIcon}
              </div>
              <Card.Title className="h3 mb-2">{user.name}</Card.Title>
              <Card.Text className="text-muted">
                <i className="bi bi-envelope me-2"></i>
                {user.username}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <h4 className="mb-3">Games History</h4>
          {games.map((game) => (
            <Card key={game.id} className="mb-3 shadow-sm">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>{formatDate(game.endTime)}</strong>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <Badge 
                    bg={game.result === 'won' ? 'success' : 'danger'}
                    className="px-3 py-2"
                  >
                    {game.result === 'won' ? 'Won' : 'Lost'}
                  </Badge>
                  <span className="text-muted">
                    <strong>{game.cards.filter(card => card.won).length}</strong> cards won
                  </span>
                </div>
              </Card.Header>
              <Card.Body>
                <h6 className="mb-3">Cards situations:</h6>
                <ListGroup variant="flush">
                  {game.cards.map((entry, index) => (
                    <ListGroup.Item 
                      key={index} 
                      className="d-flex justify-content-between align-items-center px-0"
                    >
                      <div>
                        <span className="fw-medium">{entry.card.situationName}</span>
                        <small className="text-muted ms-2">Round {entry.roundNumber}</small>
                      </div>
                      <Badge 
                        bg={entry.won ? 'success' : 'secondary'}
                        className="ms-2"
                      >
                        {entry.won ? 'Won' : 'Lost'}
                      </Badge>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>
    </Container>)
  );
};

export default UserPage;