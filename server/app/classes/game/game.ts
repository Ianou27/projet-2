import * as io from 'socket.io';
import { MAXIMUM_PASSES_COUNT } from './../../../../common/constants/general-constants';
import { GameState } from './../../../../common/gameState';
import { User } from './../../../../common/types';
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
    roomName: string;
    sio: io.Server;

    constructor() {
        this.reserveLetters = new ReserveLetters();

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
    }
    player1Join(user: User, timer: string) {
        this.player1 = new Player(this.reserveLetters.randomLettersInitialization(), true, 'player1', user);
        this.timer = new Timer(timer);
        this.roomName = user.room;
    }
    player2Join(user: User, sio: io.Server) {
        this.player2 = new Player(this.reserveLetters.randomLettersInitialization(), true, 'player2', user);
        this.sio = sio;
        this.startGame();
    }
    verifyGameState() {
        const endGameValidation =
            this.gameState.passesCount === MAXIMUM_PASSES_COUNT ||
            (this.reserveLetters.letters.length === 0 && (this.player1.getNumberLetters() === 0 || this.player2.getNumberLetters() === 0));
        if (endGameValidation) {
            this.endGame();
            this.setWinner();
        }
    }

    startGame() {
        this.timer.start(this, this.sio);
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

    surrender(winner: string) {
        this.gameState.gameFinished = true;
        this.timer.stop();
        this.sio.to(this.roomName).emit('endGame', winner);
    }

    playerTurnValid(playerName: string): boolean {
        return playerName === this.playerTurn().name;
    }

    exchangeLetters(commandInformations: string[]): void {
        const player: Player = this.playerTurn();
        const oldLetters = commandInformations[1];
        for (const letter of oldLetters) {
            player.changeLetter(letter, this.reserveLetters.getRandomLetterReserve());
            this.reserveLetters.letters.push(letter);
        }
        this.changeTurnTwoPlayers();
        this.gameState.passesCount = 0;
    }

    passTurn(): void {
        this.changeTurnTwoPlayers();
        this.gameState.passesCount++;
        this.verifyGameState();
        this.timer.reset();
    }

    private setWinner() {
        if (this.player1.points > this.player2.points) this.gameState.winner = this.player1.user.username;
        else if (this.player1.points < this.player2.points) this.gameState.winner = this.player2.user.username;
        else {
            this.gameState.winner = 'tie';
        }

        this.sio.to(this.roomName).emit('endGame', this.gameState.winner);
        this.sio.to(this.roomName).emit('roomMessage', {
            username: 'Server',
            message: 'lettre joueuer 1 =>' + this.player1.lettersToStringArray() + ' \n lettre joueuer 2 ' + this.player2.lettersToStringArray(),
            player: 'server',
        });

        this.endGame();
    }

    private endGame() {
        this.gameState.gameFinished = true;
        this.timer.stop();
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
