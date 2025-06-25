import React, { useContext, useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext.jsx';
import { Row, Col, Button, Card, Alert, Form, ProgressBar } from 'react-bootstrap';
import API from '../API/API.mjs';
import GameRecap from '../components/GameRecap.jsx';


function GamePage() {
    const { user } = useContext(AuthContext);
    const location = useLocation();
    const initialCards = location.state?.initialCards || [];

    const [cards, setCards] = useState(initialCards);
    const [roundCard, setRoundCard] = useState(null);
    const [roundNumber, setRoundNumber] = useState(0);
    const [wrongAttempts, setWrongAttempts] = useState(0);
    const [currentIsCorrect, setCurrentIsCorrect] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState(null);

    const [finished, setFinished] = useState(false);
    const [result, setResult] = useState(null);

    const [nextButtonDisabled, setNextButtonDisabled] = useState(false);

    const [timeLeft, setTimeLeft] = useState(30);
    const [timerActive, setTimerActive] = useState(false);
    const timerRef = useRef(null);
    const [timeExpired, setTimeExpired] = useState(false);

    const startTimer = () => {
        setTimeLeft(30);
        setTimerActive(true);
        setTimeExpired(false);

        setNextButtonDisabled(true); 
        
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
          timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    setTimerActive(false);
                    setTimeout(() => handleTimeExpired(), 0);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };
    
    const stopTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        setTimerActive(false);
    };
      
    const handleTimeExpired = async () => {
        setNextButtonDisabled(false);
        try {
            // Check if the timer has already expired to avoid multiple calls
            if (timeExpired) return;
            
            if(!user) {
                setFinished(true);
                setResult('lost');
                return;
            }
 
            stopTimer();
            setTimeExpired(true);
            setCurrentIsCorrect(false);            
        } catch (error) {
            console.error('Error handling timer expiration:', error);
        }
    };
    
    // Timer cleanup on component unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);      
    
    const handleNextRound = async () => {
        setNextButtonDisabled(true);
        try {
            if (user || roundNumber === 0) {
                if (!timerActive && timeExpired){
                    await handleCheckPosition();
                }

                setSelectedPosition(null);
                setCurrentIsCorrect(false);

                startTimer();
                const data = await API.newRound();
                setRoundNumber(data.roundNumber);
                setRoundCard(data.nextCard);
            }
        } catch (error) {
            console.error('Error fetching next round:', error);
        }
    }

    const handleCheckPosition = async () => {
        setNextButtonDisabled(false);
        stopTimer();
        setSelectedPosition(null);

        if(roundNumber > 0) {
            const posResult = await API.checkPosition(selectedPosition);
            if(posResult.finished) {
                setFinished(true);
                if (posResult.message === 'You won the game!') {
                    setCards(posResult.roundCards);
                    setResult('won');
                }else{
                    setResult('lost');
                }
            } else {
                if (posResult.error === 'Timer expired') {
                    setCurrentIsCorrect(false);
                    setWrongAttempts(prev => prev + 1);
                } else if (posResult.isCorrect === false) {
                    setWrongAttempts(prev => prev + 1);
                    setCurrentIsCorrect(false);
                } else if (posResult.isCorrect) {
                    setCards(posResult.roundCards);
                    setCurrentIsCorrect(true);
                }
            }
        }
    }

    const handlePositionSelection = (position) => {
        setSelectedPosition(position);
    };

    if (!Array.isArray(cards)) {
        return (
            <Row className="justify-content-center mt-5 w-100">
                <Col md={8}>
                    <Alert variant="warning">Loading game data...</Alert>
                </Col>
            </Row>
        );
    }

    return (
        <Row className="justify-content-center mt-5 w-100">
            <Col md={8}>
                {finished ? (
                    <GameRecap cards={cards} result={result} />
                ) : (
                    <>
                        {user && (
                            <>
                                <h1 className="text-center mb-4">Round {roundNumber}</h1>
                                <h3 className="text-center mb-4">Lost Rounds: {wrongAttempts} / 3 </h3>
                            </>
                        )}
                                <>
                                {/* Timer Display */}
                                {timerActive && roundCard && (
                                    <div className="text-center mb-4">
                                        <div className="d-flex justify-content-center align-items-center">
                                            <div className={`badge ${timeLeft <= 10 ? 'bg-danger' : timeLeft <= 20 ? 'bg-warning' : 'bg-success'} fs-6 p-2`}>
                                                {timeLeft} s
                                            </div>
                                        </div>
                                        <ProgressBar 
                                            now={(timeLeft / 30) * 100} 
                                            variant={timeLeft <= 10 ? 'danger' : timeLeft <= 20 ? 'warning' : 'success'}
                                            className="mt-2"
                                            style={{ height: '10px' }}
                                        />
                                        <small className="text-muted">Choose before the time is over!</small>
                                    </div>
                                )}
                            </>
                        

                        <h1 className="text-center mb-4">Your Cards</h1>
                            <>                                
                            <div className="d-flex flex-wrap justify-content-center gap-2">
                                    {cards.map((card, index) => (
                                        <Card key={index} style={{ width: '18rem' }}>
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
                                                <Card.Title>{card.situationName}</Card.Title>
                                                <Card.Text>
                                                    <strong>Misery Index:</strong> {card.miseryIndex}
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    ))}
                                </div>
                                {roundCard && (
                                    <>
                                        <div className="mt-4 text-center">
                                            <h3>Current Round Card</h3>                                            
                                            <div className="d-flex justify-content-center mt-3">
                                                <Card style={{ width: '18rem' }}>
                                                    <Card.Img 
                                                        variant="top" 
                                                        src={`http://localhost:3001/static${roundCard.imageUrl}`} 
                                                        alt={roundCard.situationName}
                                                        style={{ 
                                                            width: '100%', 
                                                            height: '200px', 
                                                            objectFit: 'cover' 
                                                        }}
                                                    />
                                                    <Card.Body>
                                                        <Card.Title>{roundCard.situationName}</Card.Title>
                                                    </Card.Body>
                                                </Card>
                                                
                                            </div>
                                            {roundNumber > 0 && !timerActive && (
                                                    <div className='mt-3'>
                                                        <Alert variant={currentIsCorrect ? "success" : "danger"} className="py-1 px-3">
                                                            {currentIsCorrect ? "Correct Position! ✅" : "Wrong Position! ❌"}
                                                        </Alert>
                                                    </div>
                                                )}
                                        </div>
                                        <div className="mt-4 text-center">
                                            {Array.from({ length: cards.length + 1 }, (_, i) => (
                                                <Button
                                                    key={i}
                                                    variant={selectedPosition === i ? "primary" : "outline-primary"}
                                                    className="me-2 mb-2"                                                    
                                                    onClick={() => handlePositionSelection(i)}
                                                    disabled={!timerActive}
                                                >
                                                    {i === 0 ? `Less then ${cards[0].miseryIndex}`: i === cards.length ? `More then ${cards[cards.length - 1].miseryIndex}` : `More then ${cards[i - 1].miseryIndex} and less then ${cards[i].miseryIndex}`}
                                                </Button>
                                            ))}
                                            {timeLeft === 0 && (
                                                <div className="mt-3">
                                                    <Alert variant="danger" className="text-center">
                                                        ⏰ Tempo scaduto! Clicca "Next Round" per continuare.
                                                    </Alert>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </>
                        <div className="d-flex justify-content-center mt-4 mb-5">                            
                            <Button variant="primary" onClick={handleCheckPosition} hidden={(selectedPosition===null) || !timerActive}>
                                Check Position
                            </Button>
                            <Button variant="primary" className="ms-2" onClick={handleNextRound} hidden={nextButtonDisabled}>
                                Next Round
                            </Button>
                        </div>
                    </>
                )}
            </Col>
        </Row>
    );
}

export default GamePage;