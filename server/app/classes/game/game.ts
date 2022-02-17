import { MAXIMUM_PASSES_COUNT } from './../../../../common/constants/general-constants';
import { GameState } from './../../../../common/gameState';
import { GameBoardService } from './../../services/game-board.service';
import { Timer } from './../../services/timer-manager.service';
import { Player } from './../player/player';
import { ReserveLetters } from './../reserveLetters/reserve-letters';

export class Game {
    gameBoard: GameBoardService;
    player1: Player;
    player2: Player;
    reserveLetters: ReserveLetters;
    timer: Timer;
    gameState: GameState;

    constructor() {
        this.reserveLetters = new ReserveLetters();
        this.player1 = new Player(this.reserveLetters.randomLettersInitialization(), true, 'player1');
        this.player2 = new Player(this.reserveLetters.randomLettersInitialization(), false, 'player2');
        this.gameBoard = new GameBoardService();
        const firstTurn = true;
        const passesCount = 0;
        const gameFinished = false;
        const winner = '';
        const gameState: GameState = {
            firstTurn,
            passesCount,
            gameFinished,
            winner,
        };
        this.gameState = gameState;
        // this.timer = new Timer();
    }

    verifyGameState() {
        if (this.gameState.passesCount === MAXIMUM_PASSES_COUNT) {
            this.endGame();
            this.setWinner();
            return;
        }
        if (this.reserveLetters.letters.length === 0 && (this.player1.getNumberLetters() === 0 || this.player2.getNumberLetters() === 0)) {
            this.endGame();
            this.setWinner();
            return;
        }
    }

    changeTurnTwoPlayers() {
        this.player1.changeTurn();
        this.player2.changeTurn();
    }

    playerTurn(): Player {
        if (this.player1.getHisTurn()) {
            return this.player1;
        } else {
            return this.player2;
        }
    }

    playerTurnValid(playerName: string): boolean {
        return playerName === this.playerTurn().name;
    }

    private setWinner() {
        if (this.player1.points > this.player2.points) this.gameState.winner = this.player1.name;
        else if (this.player1.points < this.player2.points) this.gameState.winner = this.player2.name;
        else {
            this.gameState.winner = 'tie';
        }
    }

    private endGame() {
        this.gameState.gameFinished = true;
        if (this.player1.getNumberLetters() === 0) {
            for (const letter of this.player2.getLetters()) {
                this.player1.points += letter.value;
                this.player2.points -= letter.value;
            }
        } else if (this.player2.getNumberLetters() === 0) {
            for (const letter of this.player1.getLetters()) {
                this.player2.points += letter.value;
                this.player1.points -= letter.value;
            }
        }
    }
}
