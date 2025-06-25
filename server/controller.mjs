import * as dao from './dao.mjs';

export const startNewGame = async (userId) => {
    try {
        const isDemo = userId === undefined || userId === null;

        const gameId = await dao.createGame(userId);

        const allCards = await dao.getAllCards();
        // Shuffle
        let playerCards = [...allCards].sort(() => 0.5 - Math.random());
        // Get the first three and sort them by miseryIndex
        const firstThree = playerCards.slice(0, 3).sort((a, b) => a.miseryIndex - b.miseryIndex);
        // Reinsert them into the array
        playerCards = [...firstThree, ...playerCards.slice(3)];
        // Limit the number of cards for demo 
        playerCards = playerCards.slice(0, isDemo ? 4 : 8);

       for (let i = 0; i < 3; i++) {
            await dao.addGameCard(gameId, playerCards[i].id, 0, true, true);
        }

        return {
            isDemo,
            gameId,
            playerCards,
        };
    } catch (error) {
        throw new Error('Error starting the game: ' + error.message);
    }
};


export const checkCardPosition = async (gameId, roundCards, cardToInsert, cardPositionId, roundNumber) => {
        let isCorrect;

        if(cardPositionId === -1){
            isCorrect = false;
        }else if(cardPositionId === 0) {
            if(cardToInsert.miseryIndex < roundCards[0].miseryIndex) {
                isCorrect = true;
            }else {
                isCorrect = false;
            }
        }else if(cardPositionId === roundCards.length) {
            if(cardToInsert.miseryIndex >= roundCards[roundCards.length - 1].miseryIndex) {
                isCorrect = true;
            }else {
                isCorrect = false;
            }
        }else{
            const card1 = roundCards[cardPositionId - 1];
            const card2 = roundCards[cardPositionId];
            isCorrect = cardToInsert.miseryIndex >= card1.miseryIndex && cardToInsert.miseryIndex < card2.miseryIndex; 
        }  

       await dao.addGameCard(gameId, cardToInsert.id, roundNumber, isCorrect, false);

        if (isCorrect) {
            const cardToAdd = {
                cardId: cardToInsert.id,
                imageUrl: cardToInsert.imageUrl,
                situationName: cardToInsert.situationName,
                miseryIndex: cardToInsert.miseryIndex
            };
            roundCards.splice(cardPositionId, 0, cardToAdd);
        }
        
        const result = {
            isCorrect,
            roundCards: roundCards,
        };
        
        return result;
}

export const endGame = async (gameId, won, rounds) => {
    try {
        const result = won ? 'won' : 'lost';
        await dao.updateGameStatus(gameId, 'finished', result, rounds);
        
        return {
            gameStatus: 'finished',
            gameResult: result
        };
    } catch (error) {
        throw new Error('Error ending the game: ' + error.message);
    }
}


export const getUserHistory = async (userId) => {
    try {
        const games = await dao.getUserGameHistory(userId);
        
        const historyWithDetails = await Promise.all(
            games.map(async (game) => {
                const gameDetails = await dao.getGameDetails(game.id);
                return {
                    id: game.id,
                    userId: game.userId,
                    isDemo: game.isDemo,
                    status: game.status,
                    rounds: game.rounds,
                    startTime: game.startTime,
                    endTime: game.endTime,
                    result: game.result,
                    totalCardsWon: game.totalCardsWon,
                    cards: gameDetails
                };
            })
        );
        
        return historyWithDetails;
    } catch (error) {
        throw new Error('Error retrieving history: ' + error.message);
    }
};