import sqlite from 'sqlite3';
import crypto from 'crypto';
import { User, Card, Game, GameCard } from './model.mjs';

const db_path = './db/database.db';

const db = new sqlite.Database(db_path, (err) => {
    if (err) {
        console.error('Error opening database: ', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

export const getUser = (username, password) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE username = ?';
        db.get(sql, [username], (err, row) => {
            if (err) {
                reject(err);
            } else if (row === undefined) {
                resolve(false);
            } else {
                const user = new User(row.id, row.name, row.username);
                const salt = row.salt;
                crypto.scrypt(password, salt, 32, (err, hashedPassword) => {
                    if (err) reject(err);
                    if (!crypto.timingSafeEqual(Buffer.from(row.password, 'hex'), hashedPassword)) {
                        resolve(false);
                    } else {
                        resolve(user);
                    }
                });
            }
        });
    });
};

export const createGame = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO games (userId, status, rounds, startTime) VALUES (?, ?, ?, datetime("now"))';
        db.run(sql, [userId, 'active', 0], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
};

export const getAllCards = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM cards';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const cards = rows.map(row => new Card(row.id, row.imageUrl, row.situationName, row.miseryIndex));
                resolve(cards);
            }
        });
    })
};

export const addGameCard = (gameId, cardId, roundNumber, won, isInitial = false) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO game_cards (gameId, cardId, roundNumber, won, isInitial) VALUES (?, ?, ?, ?, ?)';
        db.run(sql, [gameId, cardId, roundNumber, won ? 1 : 0, isInitial ? 1 : 0], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
};


export const updateGameStatus = (gameId, status, result, rounds) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE games SET status = ?, result = ?, rounds = ?, endTime = datetime("now") WHERE id = ?';
        db.run(sql, [status, result, rounds, gameId], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
};

export const getUserGameHistory = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT g.id, g.userId, g.status, g.rounds, g.startTime, g.endTime, g.result,
                   COUNT(CASE WHEN gc.won = 1 OR gc.isInitial = 1 THEN 1 END) as total_cards_won
            FROM games g 
            LEFT JOIN game_cards gc ON g.id = gc.gameId 
            WHERE g.userId = ? AND g.status != 'active'
            GROUP BY g.id 
            ORDER BY g.startTime DESC
        `;
        db.all(sql, [userId], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const games = rows.map(row => {
                    const isDemo = row.userId === null;
                    return new Game(row.id, row.userId, isDemo, row.status, row.rounds, row.startTime, row.endTime, row.result, row.total_cards_won);
                });
                resolve(games);
            }
        });
    });
}

export const getGameDetails = (gameId) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT gc.*, c.situationName, c.imageUrl, c.miseryIndex 
            FROM game_cards gc 
            JOIN cards c ON gc.cardId = c.id 
            WHERE gc.gameId = ? 
            ORDER BY gc.isInitial DESC, gc.roundNumber
        `;
        db.all(sql, [gameId], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const gameCards = rows.map(row => {
                    const gameCard = new GameCard(row.gameId, row.cardId, row.roundNumber, row.won === 1, row.isInitial === 1);
                    gameCard.card = new Card(row.cardId, row.imageUrl, row.situationName, row.miseryIndex);
                    return gameCard;
                });
                resolve(gameCards);
            }
        });
    });
};