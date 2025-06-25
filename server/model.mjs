import dayjs from 'dayjs';

function User(id, name, username, password, salt) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.password = password;
    this.salt = salt;
}

function Card(id, imageUrl, situationName, miseryIndex) {
    this.id = id;
    this.imageUrl = imageUrl;
    this.situationName = situationName;
    this.miseryIndex = miseryIndex;
}

function Game(id, userId, isDemo, status, rounds, startTime, endTime, result) {
    this.id = id;
    this.userId = userId;
    this.isDemo = isDemo || false;
    this.status = status; // 'active', 'finished', 'quitted'
    this.rounds = rounds;
    this.startTime = startTime ? dayjs(startTime) : null;
    this.endTime = endTime ? dayjs(endTime) : null;
    this.result = result;
}

function GameCard(gameId, cardId, roundNumber, won, isInitial) {
    this.gameId = gameId;
    this.cardId = cardId;
    this.roundNumber = roundNumber;
    this.won = won || false;
    this.isInitial = isInitial || false;
}

export { User, Card, Game, GameCard };