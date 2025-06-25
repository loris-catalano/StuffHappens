import express from 'express';
import db from './db/database.mjs';
import cors from 'cors';
import morgan from 'morgan';

import LocalStrategy from 'passport-local'; 
import session from 'express-session';
import passport from 'passport';

import * as controller from './controller.mjs';
import * as dao from './dao.mjs';


const app = new express();
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3001;

app.use('/static', express.static('public'));
app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));


const cleanSession = (reqSession) => {
  reqSession.missedAttempt = 0;
  reqSession.gameId = null;
  reqSession.roundNumber = 0;
  reqSession.playerCards = [];
  reqSession.roundCards = [];
  reqSession.nextCard = null;
  reqSession.timerStart = null;
  console.log('Session cleaned');
}

/* Autentication and session management */

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',  
  }, 
  function verify(username, password, cb) {
    dao.getUser(username, password).then((user) => {
    if (!user) return cb(null, false, { message:'Incorrect username or password.' });
    return cb(null, user);
    });
  }
));

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (user, cb) {
    return cb(null, user);
})

app.use(session({
  secret: process.env.SESSION_SECRET || "test-key",
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({error: 'Not authorized'});
}

/* Routes */

app.post('/api/v1/login', passport.authenticate('local'), (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Login failed' });
  }
  res.json({ message: 'Login successful', user: req.user });
});

app.post('/api/v1/logout', isLoggedIn, (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed', error: err });
    }
    res.json({ message: 'Logout successful' });
  });
});

app.get('/api/v1/user', isLoggedIn, (req, res) => {
  res.json({ user: req.user });
});

app.get('/api/v1/user/history', isLoggedIn, (req, res) => {
  const userId = req.user.id;
  controller.getUserHistory(userId)
    .then(history => {
      res.json(history);
    })
    .catch(err => {
      res.status(500).json({ error: 'Failed to fetch user history' });
    });
});

app.post('/api/v1/game/startGame', (req, res) => {
  const userId = req.user?.id;

  controller.startNewGame(userId)
    .then(game => {
      req.session.isDemo = game.isDemo;
      req.session.gameId = game.gameId; 
      req.session.userId = userId;
      //req.session.timerStart = Date.now(); 
      req.session.playerCards = game.playerCards
      req.session.roundNumber = 0;
      const initialCards = game.playerCards.slice(0, 3).map(card => ({
        cardId: card.id,
        imageUrl: card.imageUrl,
        situationName: card.situationName,
        miseryIndex: card.miseryIndex
      }));
      
      req.session.roundCards = initialCards;
      res.status(201).json({
        isDemo: game.isDemo,
        initialCards: initialCards,
        //roundNumber: 1
      });
    })
    .catch(err => {
      console.error('Error starting game:', err);
      res.status(500).json({ error: 'Failed to start game' });
    });
});

app.post('/api/v1/game/checkPosition', (req, res) => {
  /* Timer Handling */
  if (req.session.timerStart) {
    const now = Date.now();
    const elapsed = now - req.session.timerStart;

    if (elapsed > 30000) { // 30 seconds
      const gameId = req.session.gameId;
      const cardToCheck = req.session.nextCard;
      const roundCards = req.session.roundCards;

      const cardPositionId = -1;
      controller.checkCardPosition(gameId, roundCards, cardToCheck, cardPositionId, req.session.roundNumber);
      req.session.missedAttempt = (req.session.missedAttempt || 0) + 1;
      return res.json({
        error: 'Timer expired',
      });
    }
  }

  const cardPositionId = req.body.cardPositionId; 

  const gameId = req.session.gameId;
  const cardToCheck = req.session.nextCard;
  const roundCards = req.session.roundCards;

  controller.checkCardPosition(gameId, roundCards, cardToCheck, cardPositionId, req.session.roundNumber)
    .then(result => {
      if(req.session.roundCards.length >= 6 || (req.session.isDemo && req.session.roundCards.length==4) ) { // Won
          controller.endGame(gameId, true, req.session.roundNumber);
          const roundNumber = req.session.roundNumber;
          cleanSession(req.session);
          return res.json({
            message: 'You won the game!',
            roundCards: result.roundCards,
            roundNumber: roundNumber,
            finished: true
          });
        }

      if (result.isCorrect) {
        res.json({
          isCorrect: true,
          roundCards: result.roundCards,
          //cardDetails: result.cardDetails,
          roundNumber: req.session.roundNumber,
          finished: false
        });
      } else {
        req.session.missedAttempt = (req.session.missedAttempt || 0) + 1;
        if (req.session.missedAttempt >= 3 || (req.session.isDemo && req.session.roundCards.length==3) ) { // Lost
          controller.endGame(gameId, false, req.session.roundNumber);
          cleanSession(req.session);
          return res.json({
            message: 'Game Over',
            finished: true
          });
        }else{
          res.json({  
            isCorrect: false,
            message: 'Card position is incorrect',
            finished: false
          });
        }
      }
    })
    .catch(err => {
      console.error('Error checking card:', err);
      res.status(500).json({ error: 'Failed to check card' });
    });
});

app.post('/api/v1/game/newRound', (req, res) => { 
  req.session.timerStart = Date.now(); 
  req.session.roundNumber = req.session.roundNumber + 1;
  
  const nextCard = req.session.playerCards[2 + req.session.roundNumber];
  req.session.nextCard = nextCard;

  if (!nextCard) {
    if(req.session.isDemo) {
      return res.json({
        message: 'Demo finished'
      });
    } else {
      return res.json({
        message: 'Game finished'
      });
    }
  }
  
  const nextCardDetails = {
    cardId: nextCard.id,
    imageUrl: nextCard.imageUrl,
    situationName: nextCard.situationName,
    //miseryIndex: nextCard.miseryIndex
  };

  res.json({
    nextCard: nextCardDetails,
    roundNumber: req.session.roundNumber
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://${host}:${port}`);
});
