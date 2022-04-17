/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable max-len */
import { DatabaseService } from '@app/services/database/database.services';
import { GameBoardService } from '@app/services/game-board/game-board.service';
import { Timer } from '@app/services/timer-manager/timer-manager.service';
import { CaseProperty } from '@common/assets/case-property';
import { letterValue } from '@common/assets/reserve-letters';
import { BotType } from '@common/botType';
import { allGoals } from '@common/constants/goals';
import { Tile } from '@common/tile/Tile';
import { CreateSoloRoomInformations } from '@common/types';
import { assert, expect } from 'chai';
import * as sinon from 'sinon';
import * as io from 'socket.io';
import { PlacementCommand } from './../placement-command/placement-command';
import { Player } from './../player/player';
import { VirtualPlayer } from './../virtual-player/virtual-player';
import { Game } from './game';

describe('Game', () => {
    let game: Game;
    const numberLetterReserveMinusPlayerLetters = 88;
    const letters = ['A', 'C', 'A', 'Z', 'B', 'R', '*'];
    const lettersTilePlayer1: Tile[] = [];
    const points = 100;
    const databaseService: DatabaseService = new DatabaseService();
    for (const letter of letters) {
        const tile1: Tile = new Tile(CaseProperty.Normal, 0, 0);
        tile1.letter = letter;
        tile1.value = letterValue[letter];
        lettersTilePlayer1.push(tile1);
    }
    let expectedPoints = 0;
    for (const letter of lettersTilePlayer1) {
        expectedPoints += letter.value;
    }

    beforeEach(() => {
        game = new Game();
        game.sio = new io.Server();
        game.player1Join({ username: 'player1', id: '1', room: 'room1' }, '60', databaseService, false, 'default-dictionary');
        game.player2 = new Player(game.reserveLetters.randomLettersInitialization(), false, 'player2', {
            username: 'player2',
            id: '2',
            room: 'room1',
        });
        game.timer = new Timer('60');
        game.goals = allGoals;
    });

    it('constructor should construct a game with two players named player1 and player2', () => {
        expect(game.player1.name).equal('player1');
        expect(game.player2.name).equal('player2');
    });

    it('constructor should construct a game with a gameBoard object', () => {
        expect(game.gameBoard).instanceOf(GameBoardService);
    });

    it('constructor should initialize the reserve', () => {
        const reserveInitialLength = game.reserveLetters.letters.length;
        expect(reserveInitialLength).equal(numberLetterReserveMinusPlayerLetters);
    });

    it('method player2Join should call startGame', () => {
        const spy = sinon.spy(game, 'startGame');
        game.player2Join({ username: 'player2', id: '2', room: 'room1' }, game.sio);
        assert(spy.called);
    });

    it('method changeTurnTwoPlayers should change the turn of the two player', () => {
        const turnPlayer1 = game.player1.hisTurn;
        const turnPlayer2 = game.player2.hisTurn;
        game.changeTurnTwoPlayers();
        expect(turnPlayer1).equal(!game.player1.hisTurn);
        expect(turnPlayer2).equal(!game.player2.hisTurn);
    });

    it('method startGame should call method start from timer', () => {
        const spy = sinon.spy(game.timer, 'start');
        game.startGame();
        assert(spy.called);
    });

    it('method player1Join should call method setGoals if mode2990 is true', () => {
        const spy = sinon.spy(game, 'setGoals');
        game.player1Join({ username: 'player1', id: '1', room: 'room1' }, '60', databaseService, true, 'default-dictionary');
        assert(spy.called);
    });

    it('method startSoloGame should call method setGoals if mode2990 is true', () => {
        const spy = sinon.spy(game, 'setGoals');
        const informations: CreateSoloRoomInformations = {
            username: '',
            socketId: '',
            room: '',
            timer: '60',
            modeLog: true,
            botType: BotType.Beginner,
            botName: 'botname',
            dictionary: 'default-dictionary',
        };
        game.startSoloGame(game.player1.user, game.sio, databaseService, informations);
        assert(spy.called);
    });

    it('method startSoloGame should set the value true to hisBot of the player2', () => {
        expect(game.player2.hisBot).equal(false);
        const informations: CreateSoloRoomInformations = {
            username: '',
            socketId: '',
            room: '',
            timer: '60',
            modeLog: true,
            botType: BotType.Beginner,
            botName: 'botname',
            dictionary: 'default-dictionary',
        };
        game.startSoloGame(game.player1.user, game.sio, databaseService, informations);
        expect(game.player2.hisBot).equal(true);
    });

    it('method startSoloGame should initialize the attributes of game', () => {
        const informations: CreateSoloRoomInformations = {
            username: '',
            socketId: '',
            room: '',
            timer: '60',
            modeLog: true,
            botType: BotType.Beginner,
            botName: 'botname',
            dictionary: 'default-dictionary',
        };
        game.startSoloGame(game.player1.user, game.sio, databaseService, informations);
        expect(game.roomName).equal(game.player1.user.room);
        expect(game.timer.timerMax).equal(60);
    });

    it('method playerTurn should return the player whose turn it is', () => {
        const playerTurn1 = game.playerTurn();
        expect(playerTurn1).equal(game.player1);
        game.changeTurnTwoPlayers();
        const playerTurn2 = game.playerTurn();
        expect(playerTurn2).equal(game.player2);
    });

    it('method playerTurnValid should return true if its the turn of the player enter in parameter', () => {
        const playerTurnValid = game.playerTurnValid('player1');
        expect(playerTurnValid).equal(true);
    });

    it('method playerTurnValid should return false if its not the turn of the player enter in parameter', () => {
        const playerTurnValid = game.playerTurnValid('player2');
        expect(playerTurnValid).equal(false);
    });

    it('method playerTurnValid should call playerTurn', () => {
        const spy = sinon.spy(game, 'playerTurn');
        game.playerTurnValid('player2');
        assert(spy.called);
    });

    it('method getRandomLetterReserve should return a random letter of the reserve', () => {
        const letter = game.reserveLetters.getRandomLetterReserve();
        const letterValidationVerification = /^([A-Z]|[*])$/;
        expect(letterValidationVerification.test(letter)).equal(true);
    });

    it('method getRandomLetterReserve should maintain the reserve up to date', () => {
        const reserveInitialLength = game.reserveLetters.letters.length;
        game.reserveLetters.getRandomLetterReserve();
        const reserveFinalLength = game.reserveLetters.letters.length;
        expect(reserveInitialLength - 1).equal(reserveFinalLength);
    });

    it('method getRandomLetterReserve should return an empty string if the reserve is empty', () => {
        game.reserveLetters.letters = [];
        const letter = game.reserveLetters.getRandomLetterReserve();
        expect(letter).equal('');
    });

    it('method tileHolderContains should return true if the letters are include in the tileHolder of the player whose turn it is', () => {
        game.player1.letters = lettersTilePlayer1;
        const result = game.playerTurn().tileHolderContains('aca');
        expect(result).equal(true);
    });

    it('method tileHolderContains should return true if a capital letter is enter as a parameter and a * is include in the tileHolder', () => {
        game.player1.letters = lettersTilePlayer1;
        const result = game.playerTurn().tileHolderContains('A');
        expect(result).equal(true);
    });

    it('method tileHolderContains should return false if the letters are not include in the tileHolder of the player whose turn it is', () => {
        game.player1.letters = lettersTilePlayer1;
        const result = game.playerTurn().tileHolderContains('awz');
        expect(result).equal(false);
    });

    it('method gameStateUpdate should set gameFinished to true if the passes count is 6', () => {
        game.gameState.passesCount = 5;
        expect(game.gameState.gameFinished).to.equal(false);
        game.passTurn();
        game.gameStateUpdate();
        expect(game.gameState.gameFinished).to.equal(true);
    });

    it('method gameStateUpdate should set gameFinished to true if reserve length and letters of one player equal zero and calculate points without going into negative', () => {
        game.reserveLetters.letters = [];
        game.player1.letters = [];
        game.player2.letters = lettersTilePlayer1.slice(0, lettersTilePlayer1.length - 1);
        expect(game.gameState.gameFinished).to.equal(false);

        game.gameStateUpdate();
        expect(game.gameState.gameFinished).to.equal(true);
        expect(game.player1.points).to.equal(expectedPoints);
        expect(game.player2.points).to.equal(0);
    });

    it('method gameStateUpdate should set gameFinished to true if reserve length and letters of player 2 equal zero and calculate points', () => {
        game.reserveLetters.letters = [];
        game.player2.letters = [];
        game.player1.letters = lettersTilePlayer1.slice(0, lettersTilePlayer1.length - 1);
        game.player1.points = points;
        game.player2.points = points;
        expect(game.gameState.gameFinished).to.equal(false);
        game.gameStateUpdate();
        expect(game.gameState.gameFinished).to.equal(true);
        expect(game.player2.points).to.equal(points + expectedPoints);
        expect(game.player1.points).to.equal(points - expectedPoints);
    });

    it('method gameStateUpdate should set gameFinished to true if reserve length and letters of player 1 equal zero and calculate points', () => {
        game.reserveLetters.letters = [];
        game.player2.letters = lettersTilePlayer1;
        game.player1.letters = [];
        game.player1.points = points;
        game.player2.points = points;
        expect(game.gameState.gameFinished).to.equal(false);
        game.gameStateUpdate();
        expect(game.gameState.gameFinished).to.equal(true);
        expect(game.player2.points).to.equal(points - expectedPoints);
        expect(game.player1.points).to.equal(points + expectedPoints);
    });

    it('method gameStateUpdate should set the winner player1 if player1 has more points', () => {
        game.player1.points = 100;
        game.player2.points = 0;
        game.reserveLetters.letters = [];
        game.player1.letters = [];
        game.gameStateUpdate();
        expect(game.gameState.winner).to.equal('player1');
    });

    it('method getCommandBot should call actionVirtualBeginnerPlayer if typeBot is equal to beginner', () => {
        const spy = sinon.spy(game, 'actionVirtualBeginnerPlayer');
        game.getCommandBot(BotType.Beginner, 100);
        assert(spy.called);
    });

    it('method getCommandBot should call actionVirtualExpertPlayer if typeBot is equal to expert', () => {
        const spy = sinon.spy(game, 'actionVirtualExpertPlayer');
        game.getCommandBot(BotType.Expert, 100);
        assert(spy.called);
    });

    it('method actionVirtualExpertPlayer should call commandExpertPlayer from VirtualPlayer', () => {
        const spy = sinon.spy(VirtualPlayer, 'commandExpertPlayer');
        game.actionVirtualExpertPlayer();
        assert(spy.called);
    });

    it('method passTurn should change turn and call gameStateUpdate', () => {
        const spy = sinon.spy(game, 'gameStateUpdate');
        expect(game.player1.getHisTurn()).to.equal(true);
        expect(game.player2.getHisTurn()).to.equal(false);
        game.passTurn();
        expect(game.player1.getHisTurn()).to.equal(false);
        expect(game.player2.getHisTurn()).to.equal(true);
        assert(spy.called);
    });

    it('method surrender should update dataBase and end game', async () => {
        const spy = sinon.stub(game.databaseService, 'updateScore');
        sinon.replace(game.databaseService, 'start', async () => {
            return null;
        });
        await game.endGame();
        assert(spy.called);
        expect(game.gameState.gameFinished).to.equal(true);
    });

    /* it('method surrender should change player1 in bot if player1 surrender first', async () => {
        sinon.replace(game, 'endGame', async () => {
            return;
        });
        await game.surrender('player1');
        expect(game.player2.hisBot).to.equal(true);
    });*/

    /* it('method surrender should change player2 in bot if player2 surrender first', async () => {
        sinon.replace(game, 'endGame', async () => {
            return;
        });
        await game.surrender('player2');
        expect(game.player1.hisBot).to.equal(true);
    });*/

    it('method actionVirtualBeginnerPlayer with probability 10 or less should return command pass', () => {
        const command = game.actionVirtualBeginnerPlayer(10);
        expect(command[0]).equal('!passer');
    });

    it('method actionVirtualBeginnerPlayer with probability between 10 and 20 should return command exchange', () => {
        const spy = sinon.spy(VirtualPlayer, 'exchangeLettersCommand');
        game.reserveLetters.letters = ['A'];
        const command = game.actionVirtualBeginnerPlayer(15);
        expect(command[0]).equal('!échanger');
        assert(spy.called);
    });

    it('method actionVirtualBeginnerPlayer with probability 20 or more should return command place', () => {
        const spy = sinon.spy(VirtualPlayer, 'placementLettersCommand');
        const command = game.actionVirtualBeginnerPlayer(55);
        expect(command[0]).equal('!placer');
        assert(spy.called);
    });

    it('method placementBot with command !echanger should exchange the letters of the player', () => {
        const spy = sinon.spy(game, 'exchangeLetters');
        const command = '!échanger abc';
        game.placementBot(command.split(' '));
        assert(spy.called);
    });

    it('method placementBot with command !passer should pass the turn of the player', () => {
        const spy = sinon.spy(game, 'passTurn');
        const command = '!passer';
        game.placementBot(command.split(' '));
        assert(spy.called);
    });

    it('method placementBot with command !placer should place letters on board for the player', () => {
        const spy = sinon.spy(PlacementCommand, 'placeWord');
        const command = '!placer h8v car';
        game.placementBot(command.split(' '));
        assert(spy.called);
    });

    it('method setGoals should initialize goals', () => {
        game.setGoals();
        expect(game.goals).not.equal(allGoals);
    });

    it('method setGoals should call changeGoal 4 times and change 4 goals', () => {
        const spy = sinon.spy(game, 'changeGoal');
        game.setGoals();
        expect(spy.callCount).equal(4);
    });

    it('method setGoals should call verifyGoalsTaken', () => {
        const spy = sinon.spy(game, 'verifyGoalsTaken');
        game.setGoals();
        assert(spy.called);
    });

    it('method verifyGoalsTaken should return false if goals is not present in array', () => {
        const goalsTaken = [1, 2, 3];
        const result = game.verifyGoalsTaken(goalsTaken, 4);
        expect(result).equal(false);
    });

    it('method verifyGoalsTaken should return true if goals is present in array', () => {
        const goalsTaken = [1, 2, 3];
        const result = game.verifyGoalsTaken(goalsTaken, 3);
        expect(result).equal(true);
    });
});
