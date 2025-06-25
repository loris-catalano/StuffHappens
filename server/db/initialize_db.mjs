import { start } from 'repl';
import db from './database.mjs';
import crypto from 'crypto';

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      salt TEXT NOT NULL
      )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      imageUrl TEXT NOT NULL,
      situationName TEXT NOT NULL,
      miseryIndex REAL NOT NULL UNIQUE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      isDemo BOOLEAN DEFAULT FALSE,
      status TEXT NOT NULL CHECK(status IN ('active', 'finished', 'quitted')),
      rounds INTEGER NOT NULL,
      startTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      endTime TIMESTAMP,
      result TEXT,
      FOREIGN KEY (userId) REFERENCES users(id)
  )`);

  db.run(`
    CREATE TABLE IF NOT EXISTS game_cards (
      gameId INTEGER NOT NULL,
      cardId INTEGER NOT NULL,
      roundNumber INTEGER NOT NULL,
      won BOOLEAN DEFAULT FALSE,
      isInitial BOOLEAN DEFAULT FALSE,
      FOREIGN KEY (gameId) REFERENCES games(id),
      FOREIGN KEY (cardId) REFERENCES cards(id),
      PRIMARY KEY (gameId, cardId)
    )
   `);

  const salt = crypto.randomBytes(16).toString('hex');
  const password = crypto.scryptSync('password', salt, 32).toString('hex');
  db.run(`INSERT INTO users (name, username, password, salt) VALUES (?, ?, ?, ?)`,
    ['Test User', 'test_user', password, salt]);

  db.run(`INSERT INTO users (name, username, password, salt) VALUES (?, ?, ?, ?)`,
    ['Demo User', 'demo_user', password, salt]);

  const cards = [
    { imageUrl: '/images/card1.jpg', situationName: 'You fail a rep in front of the girl you like', miseryIndex: 70 },
    { imageUrl: '/images/card2.jpg', situationName: 'You go to shower and forgot your flip-flops', miseryIndex: 50.5 },
    { imageUrl: '/images/card3.jpg', situationName: 'You forget your headphones at home', miseryIndex: 45 },
    { imageUrl: '/images/card4.jpg', situationName: 'Someone steals your bench while you’re filling your bottle', miseryIndex: 58 },
    { imageUrl: '/images/card5.jpg', situationName: 'You realize you forgot your shaker after the workout', miseryIndex: 48 },
    { imageUrl: '/images/card6.jpg', situationName: 'The cable snaps while you’re doing the exercise', miseryIndex: 62 },
    { imageUrl: '/images/card7.jpg', situationName: 'You do a squat and your shorts rip', miseryIndex: 71 },
    { imageUrl: '/images/card8.jpg', situationName: 'You can’t find parking and waste 1 hour', miseryIndex: 41 },
    { imageUrl: '/images/card9.jpg', situationName: 'You forget your badge and they don’t let you in', miseryIndex: 46 },
    { imageUrl: '/images/card10.jpg', situationName: 'You forget it’s leg day', miseryIndex: 37 },
    { imageUrl: '/images/card11.jpg', situationName: 'You drop a dumbbell on your foot', miseryIndex: 80 },
    { imageUrl: '/images/card12.jpg', situationName: 'Only the flat bench is free but you have to train legs', miseryIndex: 52 },
    { imageUrl: '/images/card13.jpg', situationName: 'People stare at you as you make a weird face during effort', miseryIndex: 54.5 },
    { imageUrl: '/images/card14.jpg', situationName: 'You forgot your pre-workout', miseryIndex: 43 },
    { imageUrl: '/images/card15.jpg', situationName: 'You realize mid-set that the machine is set up wrong', miseryIndex: 44.5 },
    { imageUrl: '/images/card16.jpg', situationName: 'You forgot your towel and the machine is sweaty', miseryIndex: 56 },
    { imageUrl: '/images/card17.jpg', situationName: 'Your belt comes undone during a PR', miseryIndex: 65 },
    { imageUrl: '/images/card18.jpg', situationName: 'You run out of water right after warming up', miseryIndex: 39 },
    { imageUrl: '/images/card19.jpg', situationName: 'Someone corrects your form in an arrogant way', miseryIndex: 66 },
    { imageUrl: '/images/card20.jpg', situationName: 'Someone is hogging 3 machines with their bag', miseryIndex: 53 },
    { imageUrl: '/images/card21.jpg', situationName: 'You realize you forgot it’s the gym’s closing day', miseryIndex: 49 },
    { imageUrl: '/images/card22.jpg', situationName: 'Loud commercial music is playing', miseryIndex: 38 },
    { imageUrl: '/images/card23.jpg', situationName: 'The barbell slips from your hands', miseryIndex: 76 },
    { imageUrl: '/images/card24.jpg', situationName: 'Someone asks you how many sets are left every 2 minutes', miseryIndex: 57 },
    { imageUrl: '/images/card25.jpg', situationName: 'There’s a line for the lat machine', miseryIndex: 42 },
    { imageUrl: '/images/card26.jpg', situationName: 'You realize you put different weights on each side of the barbell', miseryIndex: 61 },
    { imageUrl: '/images/card27.jpg', situationName: 'You forget a change of clothes and go home sweaty', miseryIndex: 47 },
    { imageUrl: '/images/card28.jpg', situationName: 'Cardio machine has been occupied for 30 minutes', miseryIndex: 40 },
    { imageUrl: '/images/card29.jpg', situationName: 'Your playlist stops right in the middle of a set', miseryIndex: 44 },
    { imageUrl: '/images/card30.jpg', situationName: 'You realize you didn’t lock your locker', miseryIndex: 59 },
    { imageUrl: '/images/card31.jpg', situationName: 'The press machine handles are soaked in sweat', miseryIndex: 55 },
    { imageUrl: '/images/card32.jpg', situationName: 'All the light dumbbells are gone', miseryIndex: 36.5 },
    { imageUrl: '/images/card33.jpg', situationName: 'You realize you skipped chest day', miseryIndex: 35 },
    { imageUrl: '/images/card34.jpg', situationName: 'You slip on the wet locker room floor', miseryIndex: 69 },
    { imageUrl: '/images/card35.jpg', situationName: 'Your training partner cancels last minute', miseryIndex: 41.5 },
    { imageUrl: '/images/card36.jpg', situationName: 'All the 5kg plates are in use', miseryIndex: 37.5 },
    { imageUrl: '/images/card37.jpg', situationName: 'There’s a terrible smell in the locker room', miseryIndex: 46.5 },
    { imageUrl: '/images/card38.jpg', situationName: 'You realize it was pull day and not push day', miseryIndex: 39.5 },
    { imageUrl: '/images/card39.jpg', situationName: 'You need the rack but someone’s doing biceps there', miseryIndex: 60 },
    { imageUrl: '/images/card40.jpg', situationName: 'Your shirt sticks to your sweaty back', miseryIndex: 43.5 },
    { imageUrl: '/images/card41.jpg', situationName: 'You have to ask a stranger to spot you', miseryIndex: 63 },
    { imageUrl: '/images/card42.jpg', situationName: 'The mirror is fogged up and you can’t see yourself', miseryIndex: 36 },
    { imageUrl: '/images/card43.jpg', situationName: 'You forget your foam roller for stretching', miseryIndex: 34.5 },
    { imageUrl: '/images/card44.jpg', situationName: 'You get cramps while stretching', miseryIndex: 55.5 },
    { imageUrl: '/images/card45.jpg', situationName: 'The powerlifting club took up all the space', miseryIndex: 64 },
    { imageUrl: '/images/card46.jpg', situationName: 'You forget your wallet and can’t buy a post-workout snack', miseryIndex: 48.5 },
    { imageUrl: '/images/card47.jpg', situationName: 'You feel a strange pain during a set', miseryIndex: 67 },
    { imageUrl: '/images/card48.jpg', situationName: 'You can’t remember if you did 3 or 4 sets', miseryIndex: 35.5 },
    { imageUrl: '/images/card49.jpg', situationName: 'Your backpack zipper gets stuck', miseryIndex: 33 },
    { imageUrl: '/images/card50.jpg', situationName: 'You hurt yourself trying a new exercise', miseryIndex: 74 },
    { imageUrl: '/images/card51.jpg', situationName: 'You forget to turn off your alarm during a set', miseryIndex: 50 },
    { imageUrl: '/images/card52.jpg', situationName: 'You wear gloves and end up making fun of yourself', miseryIndex: 34 },
    { imageUrl: '/images/card53.jpg', situationName: 'You arrive and the gym is closed for maintenance', miseryIndex: 68 },
    { imageUrl: '/images/card54.jpg', situationName: 'The app for logging your workout crashes', miseryIndex: 31.5 },
    { imageUrl: '/images/card55.jpg', situationName: 'You grab someone else’s water bottle by mistake', miseryIndex: 60.5 },
    { imageUrl: '/images/card56.jpg', situationName: 'People ask you questions while you’re doing a set', miseryIndex: 51 },
    { imageUrl: '/images/card57.jpg', situationName: 'You have to explain how to use a machine for the third time', miseryIndex: 49.5 },
    { imageUrl: '/images/card58.jpg', situationName: 'You drop your full bottle on the mat', miseryIndex: 40.5 },
    { imageUrl: '/images/card59.jpg', situationName: 'You forget it’s loading day and do a light workout', miseryIndex: 42.5 }
  ]
;
  cards.forEach(card => {
    db.run(`INSERT INTO cards (imageUrl, situationName, miseryIndex) VALUES (?, ?, ?)`,
      [card.imageUrl, card.situationName, card.miseryIndex]);
  });

  const games = [
    { userId: 2, isDemo: false, status: 'finished', rounds: 3, startTime: '2025-06-10 10:00:00', endTime: '2025-06-10 10:01:22', result: 'won' },
    { userId: 2, isDemo: false, status: 'finished', rounds: 4, startTime: '2025-06-11 11:00:00', endTime: '2025-06-11 11:02:15', result: 'lost' },
    { userId: 2, isDemo: false, status: 'finished', rounds: 3, startTime: '2025-06-11 11:08:26', endTime: '2025-06-11 11:09:02', result: 'lost' },
  ];
  games.forEach(game => {
    db.run(`INSERT INTO games (userId, isDemo, status, rounds, startTime, endTime, result) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [game.userId, game.isDemo, game.status, game.rounds, game.startTime, game.endTime, game.result]);
  });

  const gameCards = [
    { gameId: 1, cardId: 36, roundNumber: 0, won: true, isInitial: true },
    { gameId: 1, cardId: 28, roundNumber: 0, won: true, isInitial: true },
    { gameId: 1, cardId: 51, roundNumber: 0, won: true, isInitial: true },
    { gameId: 1, cardId: 4, roundNumber: 1, won: true, isInitial: false },
    { gameId: 1, cardId: 5, roundNumber: 2, won: true, isInitial: false },
    { gameId: 1, cardId: 8, roundNumber: 3, won: true, isInitial: false },
    { gameId: 2, cardId: 26, roundNumber: 0, won: true, isInitial: true },
    { gameId: 2, cardId: 22, roundNumber: 0, won: true, isInitial: true },
    { gameId: 2, cardId: 3, roundNumber: 0, won: true, isInitial: true },
    { gameId: 2, cardId: 9, roundNumber: 1, won: false, isInitial: false },
    { gameId: 2, cardId: 10, roundNumber: 2, won: true, isInitial: false },
    { gameId: 2, cardId: 11, roundNumber: 3, won: false, isInitial: false },
    { gameId: 2, cardId: 2, roundNumber: 4, won: false, isInitial: false },
    { gameId: 3, cardId: 12, roundNumber: 0, won: true, isInitial: true },
    { gameId: 3, cardId: 13, roundNumber: 0, won: true, isInitial: true },
    { gameId: 3, cardId: 38, roundNumber: 0, won: true, isInitial: true },
    { gameId: 3, cardId: 1, roundNumber: 1, won: false, isInitial: false },
    { gameId: 3, cardId: 7, roundNumber: 2, won: false, isInitial: false },
    { gameId: 3, cardId: 14, roundNumber: 3, won: false, isInitial: false },
  ];
  gameCards.forEach(gameCard => {
    db.run(`INSERT INTO game_cards (gameId, cardId, roundNumber, won, isInitial) VALUES (?, ?, ?, ?, ?)`,
      [gameCard.gameId, gameCard.cardId, gameCard.roundNumber, gameCard.won, gameCard.isInitial]);
  });
});

db.close((err) => {
    if (err) {
        console.error('Error closing the database: ', err.message);
    } else {
        console.log('Database initialized and closed successfully.');
    }
});
