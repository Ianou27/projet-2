import { DatabaseService } from '@app/services/best-score/best-score.services';
import { BotType } from '@common/botType';
import { Goals } from '@common/constants/goals';
import * as io from 'socket.io';
import { CommandType } from './../../../../common/command-type';
import {
    MAXIMUM_PASSES_COUNT,
    PROBABILITY_EXCHANGE_COMMAND_BOT,
    PROBABILITY_PASS_COMMAND_BOT,
    THREE_SECONDS_MS,
    TWENTY_SECONDS_MS,
} from './../../../../common/constants/general-constants';
import { GameState } from './../../../../common/gameState';
import { User } from './../../../../common/types';
import { GameBoardService } from './../../services/game-board/game-board.service';
import { Timer } from './../../services/timer-manager/timer-manager.service';
import { PlacementCommand } from './../placement-command/placement-command';
import { Player } from './../player/player';
import { ReserveLetters } from './../reserve-letters/reserve-letters';
import { VirtualPlayer } from './../virtual-player/virtual-player';

export class Game {
    gameBoard: GameBoardService;
    player1: Player;
    player2: Player;
    reserveLetters: ReserveLetters;
    timer: Timer;
    gameState: GameState;
    roomName: string;
    sio: io.Server;
    databaseService: DatabaseService;
    goals: Goals;

    constructor(/* modeLog: boolean*/) {
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
        /* if (modeLog) {
        }*/
    }

    /* randomizeGoals() {
        const newGoals: Goals = {};
    }*/

    player1Join(user: User, timer: string, databaseService: DatabaseService) {
        this.player1 = new Player(this.reserveLetters.randomLettersInitialization(), true, 'player1', user);
        this.timer = new Timer(timer);
        this.roomName = user.room;
        this.timer = new Timer(timer);
        this.databaseService = databaseService;
    }

    player2Join(user: User, sio: io.Server) {
        this.player2 = new Player(this.reserveLetters.randomLettersInitialization(), false, 'player2', user);
        this.sio = sio;
        this.startGame();
    }

    gameStateUpdate() {
        const endGameValidation =
            this.gameState.passesCount === MAXIMUM_PASSES_COUNT ||
            (this.reserveLetters.letters.length === 0 && (this.player1.getNumberLetters() === 0 || this.player2.getNumberLetters() === 0));
        if (endGameValidation) {
            this.endGame();
            this.setWinner();
            this.timer.stop();
        }
    }

    startGame() {
        this.timer.start(this, this.sio);
        this.randomTurnGame();
        this.sio.to(this.player1.user.id).emit('turn', this.player1.hisTurn);
        this.sio.to(this.player2.user.id).emit('turn', this.player2.hisTurn);
        this.sio.to(this.player1.user.id).emit('modification', this.gameBoard.cases, this.playerTurn().name);
        this.sio.to(this.player2.user.id).emit('modification', this.gameBoard.cases, this.playerTurn().name);
    }

    startSoloGame(user: User, sio: io.Server, timer: string, databaseService: DatabaseService, botName: string, botType: BotType) {
        this.databaseService = databaseService;
        this.timer = new Timer(timer);
        this.player1 = new Player(this.reserveLetters.randomLettersInitialization(), true, 'player1', user);
        this.roomName = user.room;
        const userBot = {
            username: botName,
            id: 'bot',
            room: user.room,
        };
        this.player2 = new Player(this.reserveLetters.randomLettersInitialization(), false, 'player2', userBot);
        this.player2.changeHisBot(true);
        this.player2.typeBot = botType;
        this.sio = sio;
        this.startGame();
        this.sio.to(user.id).emit('tileHolder', this.player1.letters);
        this.sio.to(this.player1.user.room).emit('modification', this.gameBoard.cases, this.playerTurn().name);
        this.sio.to(user.id).emit('startGame', user.username, botName);
    }

    randomTurnGame() {
        const player1Turn = Boolean(Math.round(Math.random()));
        if (!player1Turn) {
            this.changeTurnTwoPlayers();
        }
    }

    async changeTurnTwoPlayers() {
        this.player1.changeTurn();
        this.player2.changeTurn();
        this.sio.to(this.player1.user.id).emit('turn', this.player1.hisTurn);
        this.sio.to(this.player2.user.id).emit('turn', this.player2.hisTurn);
        if (this.playerTurn().hisBot) {
            const probability = VirtualPlayer.getProbability();
            const timeoutActionBot =
                probability <= PROBABILITY_PASS_COMMAND_BOT && this.playerTurn().typeBot === BotType.Beginner ? TWENTY_SECONDS_MS : THREE_SECONDS_MS;
            setTimeout(() => {
                const command = this.getCommandBot(this.playerTurn().typeBot, probability);
                this.placementBot(command);
            }, timeoutActionBot);
        }
    }

    getCommandBot(typeBot: BotType, probability: number): string[] {
        if (typeBot === BotType.Beginner) return this.actionVirtualBeginnerPlayer(probability);
        return this.actionVirtualExpertPlayer();
    }

    placementBot(command: string[]) {
        switch (command[0]) {
            case CommandType.exchange: {
                this.exchangeLetters(command);
                this.sio.to(this.player1.user.room).emit('modification', this.gameBoard.cases, this.playerTurn().name);
                this.sio.to(this.player1.user.id).emit('roomMessage', {
                    username: 'Server',
                    message: 'Votre adversaire a échangé ' + command[1].length + ' lettres',
                    player: 'server',
                });
                break;
            }
            case CommandType.pass: {
                this.passTurn();
                this.sio.to(this.player1.user.room).emit('roomMessage', {
                    username: 'Server',
                    message: this.player2.user.username + ' a passé son tour ',
                    player: 'server',
                });
                this.sio.to(this.player1.user.room).emit('modification', this.gameBoard.cases, this.playerTurn().name);
                break;
            }
            case CommandType.place: {
                PlacementCommand.placeWord(command, this);
                this.sio
                    .to(this.player1.user.room)
                    .emit('updateReserve', this.reserveLetters.letters.length, this.player1.getNumberLetters(), this.player2.getNumberLetters());
                this.sio.to(this.player1.user.room).emit('roomMessage', {
                    username: 'Server',
                    message: this.player2.user.username + ' a placé le mot ' + command[2] + ' en ' + command[1],
                    player: 'server',
                });
                this.sio.to(this.player1.user.room).emit('modification', this.gameBoard.cases, this.playerTurn().name);
                this.sio.to(this.player1.user.room).emit('updatePoint', 'player2', this.player2.points);
                break;
            }
        }
    }

    playerTurn(): Player {
        if (this.player1.getHisTurn()) {
            return this.player1;
        }
        return this.player2;
    }

    async surrender(winner: string) {
        await this.databaseService.start();
        if (winner === this.player1.user.username) {
            await this.databaseService.updateBesScoreClassic({
                player: this.player1.user.username,
                score: this.player1.points,
            });
        } else if (winner === this.player2.user.username) {
            await this.databaseService.updateBesScoreClassic({
                player: this.player2.user.username,
                score: this.player2.points,
            });
        }
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
            this.reserveLetters.letters.push(letter.toUpperCase());
        }
        this.changeTurnTwoPlayers();
        this.gameState.passesCount = 0;
        this.timer.reset();
    }

    passTurn(): void {
        this.changeTurnTwoPlayers();
        this.gameState.passesCount++;
        this.gameStateUpdate();
        this.timer.reset();
        this.sio.to(this.player1.user.room).emit('modification', this.gameBoard.cases, this.playerTurn().name);
        this.sio.to(this.player1.user.id).emit('tileHolder', this.player1.letters);
        this.sio.to(this.player2.user.id).emit('tileHolder', this.player2.letters);
    }

    actionVirtualBeginnerPlayer(probability: number): string[] {
        if (probability <= PROBABILITY_PASS_COMMAND_BOT) {
            return CommandType.pass.split(' ');
        } else if (probability <= PROBABILITY_EXCHANGE_COMMAND_BOT) {
            return VirtualPlayer.exchangeLettersCommand(this);
        } else {
            return VirtualPlayer.placementLettersCommand(VirtualPlayer.getProbability(), this);
        }
    }

    actionVirtualExpertPlayer(): string[] {
        return VirtualPlayer.commandExpertPlayer(this);
    }

    private setWinner() {
        if (this.player1.points > this.player2.points) this.gameState.winner = this.player1.user.username;
        else if (this.player1.points < this.player2.points) this.gameState.winner = this.player2.user.username;
        else {
            this.gameState.winner = 'tie';
        }

        this.sio.to(this.roomName).emit('endGame', this.gameState.winner);
        this.sio.to(this.roomName).emit('updatePoint', 'player1', this.player1.points);
        this.sio.to(this.roomName).emit('updatePoint', 'player2', this.player2.points);
        this.sio.to(this.roomName).emit('roomMessage', {
            username: 'Server',
            message: 'lettre joueur 1 =>' + this.player1.lettersToStringArray() + ' \n lettre joueur 2 ' + this.player2.lettersToStringArray(),
            player: 'server',
        });
    }

    private async endGame() {
        this.gameState.gameFinished = true;
        this.timer.stop();
        if (this.player1.getNumberLetters() === 0) {
            for (const letter of this.player2.getLetters()) {
                if (letter.letter !== '') {
                    this.player1.points += letter.value;
                }
            }
        } else if (this.player2.getNumberLetters() === 0) {
            for (const letter of this.player1.getLetters()) {
                if (letter.letter !== '') {
                    this.player2.points += letter.value;
                }
            }
        }
        for (const letter of this.player1.getLetters()) {
            if (letter.letter !== '') {
                if (this.player1.points - letter.value >= 0) this.player1.points -= letter.value;
            }
        }
        for (const letter of this.player2.getLetters()) {
            if (letter.letter !== '') {
                if (this.player2.points - letter.value >= 0) this.player2.points -= letter.value;
            }
        }
        await this.databaseService.start();
        await this.databaseService.updateBesScoreClassic({
            player: this.player1.user.username,
            score: this.player1.points,
        });

        if (!this.player2.hisBot) {
            await this.databaseService.updateBesScoreClassic({
                player: this.player2.user.username,
                score: this.player2.points,
            });
        }
        await this.databaseService.closeConnection();
    }
}
