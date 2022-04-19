import { DatabaseService } from '@app/services/database/database.services';
import { RoomManager } from '@app/services/room-manager/room-manager.service';
import { BotType } from '@common/botType';
import { GoalType } from '@common/constants/goal-type';
import { allGoals, Goals } from '@common/constants/goals';
import * as fs from 'fs';
import * as io from 'socket.io';
import { CommandType } from './../../../../common/command-type';
import {
    MAXIMUM_PASSES_COUNT,
    NUMBER_GOALS_GAME,
    PROBABILITY_EXCHANGE_COMMAND_BOT,
    PROBABILITY_PASS_COMMAND_BOT,
    THREE_SECONDS_MS,
    TOTAL_GOALS,
    TWENTY_SECONDS_MS,
} from './../../../../common/constants/general-constants';
import { GameState } from './../../../../common/gameState';
import { CreateSoloRoomInformations, GameHistory, User } from './../../../../common/types';
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
    gameStartingDate: string;
    dictionaryName: string;
    dictionaryArray: string[];

    constructor() {
        this.reserveLetters = new ReserveLetters();
        this.gameBoard = new GameBoardService();
        const gameState: GameState = {
            firstTurn: true,
            passesCount: 0,
            gameFinished: false,
            winner: '',
            modeLog: false,
        };
        this.gameState = gameState;
    }

    player1Join(user: User, timer: string, databaseService: DatabaseService, modeLog: boolean, dictionary: string) {
        this.player1 = new Player(this.reserveLetters.randomLettersInitialization(), true, 'player1', user);
        this.timer = new Timer(timer);
        this.roomName = user.room;
        this.timer = new Timer(timer);
        this.dictionaryName = dictionary;
        this.dictionaryArray = JSON.parse(fs.readFileSync('./assets/dictionaries/' + dictionary + '.json').toString()).words;
        this.databaseService = databaseService;
        if (modeLog) {
            this.setGoals();
        }
    }

    player2Join(user: User, sio: io.Server) {
        this.player2 = new Player(this.reserveLetters.randomLettersInitialization(), false, 'player2', user);
        this.sio = sio;
        this.startGame();
    }

    gameStateUpdate() {
        const endGameValidation =
            (this.gameState.passesCount === MAXIMUM_PASSES_COUNT ||
                (this.reserveLetters.letters.length === 0 && (this.player1.getNumberLetters() === 0 || this.player2.getNumberLetters() === 0))) &&
            !this.gameState.gameFinished;
        if (endGameValidation) {
            this.endGame();
            this.setWinner();
            this.timer.stop();
        }
    }

    startGame() {
        this.timer.start(this, this.sio);

        this.gameStartingDate = new Date().toLocaleString('en-CA', { timeZone: 'America/Montreal' });
        this.randomTurnGame();
        this.sio.to(this.player1.user.id).emit('turn', this.player1.hisTurn);
        this.sio.to(this.player2.user.id).emit('turn', this.player2.hisTurn);
        this.sio.to(this.player1.user.id).emit('modification', this.gameBoard.cases, this.playerTurn().name);
        this.sio.to(this.player2.user.id).emit('modification', this.gameBoard.cases, this.playerTurn().name);
    }

    startSoloGame(user: User, sio: io.Server, databaseService: DatabaseService, informations: CreateSoloRoomInformations) {
        this.databaseService = databaseService;
        this.timer = new Timer(informations.timer);
        this.player1 = new Player(this.reserveLetters.randomLettersInitialization(), true, 'player1', user);
        this.roomName = user.room;
        const userBot = {
            username: informations.botName,
            id: 'bot',
            room: user.room,
        };
        this.dictionaryName = informations.dictionary;
        this.dictionaryArray = JSON.parse(fs.readFileSync('./assets/dictionaries/' + informations.dictionary + '.json').toString()).words;
        this.player2 = new Player(this.reserveLetters.randomLettersInitialization(), false, 'player2', userBot);
        this.player2.changeHisBot(true);
        this.player2.typeBot = informations.botType;
        this.sio = sio;
        this.startGame();
        if (informations.modeLog) this.setGoals();
        this.sio.to(user.id).emit('tileHolder', this.player1.letters, RoomManager.getGoalsPlayer(this, this.player1));
        this.sio.to(this.roomName).emit('modification', this.gameBoard.cases, this.playerTurn().name);
        this.sio.to(user.id).emit('startGame', user.username, informations.botName);
    }

    randomTurnGame() {
        const player1Turn = Boolean(Math.round(Math.random()));
        if (!player1Turn) this.changeTurnTwoPlayers();
    }

    setGoals() {
        const goalsSelected: number[] = [];
        this.gameState.modeLog = true;
        this.goals = JSON.parse(JSON.stringify(allGoals));
        for (let i = 0; i < NUMBER_GOALS_GAME; i++) {
            let position = Math.floor(Math.random() * TOTAL_GOALS);
            while (this.verifyGoalsTaken(goalsSelected, position)) {
                position = Math.floor(Math.random() * TOTAL_GOALS);
            }
            if (i <= 1) {
                this.changeGoal(goalsSelected, position, GoalType.Public);
            } else if (i <= 2) {
                this.changeGoal(goalsSelected, position, GoalType.PrivatePlayer1);
            } else {
                this.changeGoal(goalsSelected, position, GoalType.PrivatePlayer2);
            }
        }
    }

    verifyGoalsTaken(goals: number[], newGoals: number): boolean {
        return goals.includes(newGoals);
    }

    changeGoal(goalsSelected: number[], position: number, goalType: GoalType): void {
        const goals = Object.keys(this.goals);
        goalsSelected.push(position);
        this.goals[goals[position]].isInGame = true;
        this.goals[goals[position]].type = goalType;
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
        const playerBot: Player = this.player1.hisBot ? this.player1 : this.player2;
        const playerBotString: string = this.player1.hisBot ? 'player1' : 'player2';
        switch (command[0]) {
            case CommandType.exchange: {
                this.exchangeLetters(command);
                this.sio.to(this.roomName).emit('modification', this.gameBoard.cases, this.playerTurn().name);
                this.sio.to(this.roomName).emit('roomMessage', {
                    username: 'Server',
                    message: 'Votre adversaire a échangé ' + command[1].length + ' lettres',
                    player: 'server',
                });
                break;
            }
            case CommandType.pass: {
                this.passTurn();
                this.sio.to(this.roomName).emit('roomMessage', {
                    username: 'Server',
                    message: playerBot.user.username + ' a passé son tour',
                    player: 'server',
                });
                break;
            }
            case CommandType.place: {
                PlacementCommand.placeWord(command, this);
                this.sio
                    .to(this.roomName)
                    .emit('updateReserve', this.reserveLetters.letters.length, this.player1.getNumberLetters(), this.player2.getNumberLetters());
                this.sio.to(this.roomName).emit('roomMessage', {
                    username: 'Server',
                    message: playerBot.user.username + ' a placé les lettres ' + command[2] + ' en ' + command[1],
                    player: 'server',
                });
                this.sio.to(this.roomName).emit('modification', this.gameBoard.cases, this.playerTurn().name);
                this.sio.to(this.roomName).emit('updatePoint', playerBotString, playerBot.points);
                break;
            }
        }
        this.sio.to(this.player1.user.id).emit('tileHolder', this.player1.getLetters(), RoomManager.getGoalsPlayer(this, this.player1));
        this.sio.to(this.player2.user.id).emit('tileHolder', this.player2.getLetters(), RoomManager.getGoalsPlayer(this, this.player2));
    }
    playerTurn(): Player {
        if (this.player1.getHisTurn()) {
            return this.player1;
        }
        return this.player2;
    }
    async surrender(human: string, botName: string) {
        if (this.player1.hisBot || this.player2.hisBot) {
            this.gameState.gameFinished = true;
            this.timer.stop();
            this.registerGame();
        } else {
            if (human === this.player1.user.username) {
                this.player2.hisBot = true;
                this.player2.user.username = botName;
                this.player2.typeBot = BotType.Beginner;
                if (this.player2.hisTurn) this.changeTurnTwoPlayers();
                this.sio.to(this.roomName).emit('startGame', human, botName);
            } else {
                this.player1.hisBot = true;
                this.player1.user.username = botName;
                this.player1.typeBot = BotType.Beginner;
                if (this.player1.hisTurn) this.changeTurnTwoPlayers();
                this.sio.to(this.roomName).emit('startGame', botName, human);
            }
            this.sio.to(this.roomName).emit('modification', this.gameBoard.cases, this.playerTurn().name);
        }
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
        this.timer.reset();
        this.sio.to(this.roomName).emit('modification', this.gameBoard.cases, this.playerTurn().name);
        this.sio.to(this.player1.user.id).emit('tileHolder', this.player1.letters);
        this.sio.to(this.player2.user.id).emit('tileHolder', this.player2.letters);
        this.gameStateUpdate();
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
    async registerGame() {
        const mode = this.gameState.modeLog ? 'LOG2990' : 'CLASSIC';
        const game: GameHistory = {
            date: this.gameStartingDate,
            duration: this.timer.gameTime,
            player1: this.player1.user.username,
            player1Points: this.player1.points,
            player2Points: this.player2.points,
            player2: this.player2.user.username,
            gameMode: mode,
        };
        await this.databaseService.start();
        await this.databaseService.insertGame(game);
        await this.databaseService.closeConnection();
    }
    async endGame() {
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
        await this.databaseService.updateScore(this);
        this.registerGame();
        await this.databaseService.closeConnection();
    }
    private setWinner() {
        if (this.player1.points > this.player2.points) this.gameState.winner = this.player1.user.username;
        else if (this.player1.points < this.player2.points) this.gameState.winner = this.player2.user.username;
        else {
            this.gameState.winner = 'tie';
        }
        this.sio.to(this.roomName).emit('updatePoint', 'player1', this.player1.points);
        this.sio.to(this.roomName).emit('updatePoint', 'player2', this.player2.points);
        if (this.player1.lettersToStringArray().length > 0) {
            this.sio.to(this.roomName).emit('roomMessage', {
                username: '',
                message: 'Lettres restantes joueur 1 : ' + this.player1.lettersToStringArray(),
                player: '',
            });
        }
        if (this.player2.lettersToStringArray().length > 0) {
            this.sio.to(this.roomName).emit('roomMessage', {
                username: '',
                message: 'Lettres restantes joueur 2 : ' + this.player2.lettersToStringArray(),
                player: '',
            });
        }
        this.sio.to(this.roomName).emit('endGame', this.gameState.winner);
    }
}
