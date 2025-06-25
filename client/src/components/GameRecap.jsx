import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function GameRecap(props) {
    const navigate = useNavigate();
    const { cards, result } = props;

    const handleBackToHome = () => {
        navigate('/');
    };

    return (
        <div className="text-center">
            <h2 className="mb-4">{result === "won" ? "You Won!" : "Game Over!"}</h2>
            <div className="mb-4">
                <h5>Your Cards:</h5>
                <div className="d-flex flex-wrap justify-content-center gap-2 mt-3">
                    {cards.map((card, index) => (
                        <Card key={index} style={{ width: '12rem' }}>
                            <Card.Img 
                                variant="top" 
                                src={`http://localhost:3001/static${card.imageUrl}`} 
                                alt={card.imageUrl} 
                                style={{ 
                                    width: '100%', 
                                    height: '200px', 
                                    objectFit: 'cover' 
                                }}
                            />
                            <Card.Body>
                                <Card.Title className="small">{card.situationName}</Card.Title>
                                <Card.Text className="small">
                                    <strong>Misery Index:</strong> {card.miseryIndex}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            </div>
            <Button variant="primary" onClick={handleBackToHome}>
                Back to Home
            </Button>
        </div>
    );
}

export default GameRecap;
