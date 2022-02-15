import { CaseProperty } from './../../../../common/assets/case-property';
import { letterNumber, letterValue } from './../../../../common/assets/reserve-letters';
import { MAXIMUM_PASSES_COUNT, NUMBER_TILEHOLDER } from './../../../../common/constants/general-constants';
import { Tile } from './../../../../common/tile/Tile';
import { GameBoardService } from './../../services/gameBoard.service';
import { Player } from './../player/player';

export class Game {
    gameBoard: GameBoardService;
    firstTurn: boolean;
    player1: Player;
    player2: Player;
    passesCount: number;
    reserveLetters: string[] = [];
    gameFinished: boolean;

    constructor() {
        this.reserveLetters = this.initializeReserveLetters();
        this.player1 = new Player(this.randomLettersInitialization(), true, 'player1');
        this.player2 = new Player(this.randomLettersInitialization(), false, 'player2');
        this.gameBoard = new GameBoardService();
        this.firstTurn = true;
        this.passesCount = 0;
        this.gameFinished = false;
    }

    verifyGameState() {
        if (this.passesCount !== MAXIMUM_PASSES_COUNT) return;
        if (this.reserveLetters.length !== 0) return;
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

    getRandomLetterReserve(): string {
        const reserveLength = this.reserveLetters.length;
        if (reserveLength === 0) {
            return '';
        }
        const element = this.reserveLetters[Math.floor(Math.random() * this.reserveLetters.length)];
        const indexElement = this.reserveLetters.indexOf(element);
        this.reserveLetters.splice(indexElement, 1);
        return element;
    }

    tileHolderContains(word: string): boolean {
        const lettersWord = word.split('');
        const player: Player = this.playerTurn();
        const lettersPlayer: string[] = player.lettersToStringArray();
        for (const letter of lettersWord) {
            if (this.isUpperCase(letter) && this.findLetterTileHolder('*')) {
                lettersPlayer[lettersPlayer.indexOf('*')] = '';
            } else if (!this.isUpperCase(letter) && this.findLetterTileHolder(letter.toUpperCase())) {
                lettersPlayer[lettersPlayer.indexOf(letter)] = '';
            } else {
                return false;
            }
        }
        return true;
    }

    private randomLettersInitialization(): Tile[] {
        const letters: Tile[] = [];
        for (let i = 0; i < NUMBER_TILEHOLDER; i++) {
            const tile: Tile = new Tile(CaseProperty.Normal, 0, i);
            tile.letter = this.getRandomLetterReserve();
            tile.value = letterValue[tile.letter];
            letters.push(tile);
        }
        return letters;
    }

    private initializeReserveLetters(): string[] {
        const reserveLettersObject = letterNumber;
        const reserve: string[] = [];
        Object.keys(reserveLettersObject).forEach((key) => {
            for (let i = 0; i < reserveLettersObject[key]; i++) {
                reserve.push(key);
            }
        });
        return reserve;
    }

    private isUpperCase(letter: string): boolean {
        return letter === letter.toUpperCase();
    }

    private findLetterTileHolder(letter: string): boolean {
        const player: Player = this.playerTurn();
        const lettersPlayer: Tile[] = player.getLetters();
        for (const letterPlayer of lettersPlayer) {
            if (letterPlayer.letter === letter) {
                return true;
            }
        }
        return false;
    }
}
