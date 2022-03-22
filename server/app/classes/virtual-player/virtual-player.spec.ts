/* eslint-disable @typescript-eslint/no-magic-numbers */
import { PlacementInformations } from '@app/placement-informations';
import { DatabaseService } from '@app/services/best-score.services';
import { Timer } from '@app/services/timer-manager.service';
import { CaseProperty } from '@common/assets/case-property';
import { letterValue } from '@common/assets/reserve-letters';
import { Orientation } from '@common/orientation';
import { Tile } from '@common/tile/Tile';
import { assert, expect } from 'chai';
import * as sinon from 'sinon';
import * as io from 'socket.io';
import { Game } from './../game/game';
import { PlacementCommand } from './../placementCommand/placement-command';
import { Player } from './../player/player';
import { ReserveLetters } from './../reserveLetters/reserve-letters';
import { VirtualPlayer } from './virtual-player';

interface PlacementScore {
    score: number;
    command: string;
}

interface TilePlacementPossible {
    tile: Tile;
    orientation: Orientation;
}

describe('Virtual Player', () => {
    let game: Game;
    const letters = ['A', 'C', 'A', 'Z', 'B', 'R', 'A'];
    let lettersTilePlayer1: Tile[] = [];
    const databaseService: DatabaseService = new DatabaseService();

    beforeEach(() => {
        for (const letter of letters) {
            const tile1: Tile = new Tile(CaseProperty.Normal, 0, 0);
            tile1.letter = letter;
            tile1.value = letterValue[letter];
            lettersTilePlayer1.push(tile1);
        }
        game = new Game();
        game.sio = new io.Server();
        game.player1Join({ username: 'player1', id: '1', room: 'room1' }, '60', databaseService);
        game.player1.letters = lettersTilePlayer1;
        game.player2 = new Player(game.reserveLetters.randomLettersInitialization(), false, 'player2', {
            username: 'player2',
            id: '2',
            room: 'room1',
        });
        game.player2.letters = lettersTilePlayer1;
        game.timer = new Timer('60');
        game.reserveLetters = new ReserveLetters();
    });

    afterEach(() => {
        lettersTilePlayer1 = [];
        sinon.restore();
    });

    it('method getProbability should return a number between 1 and 100', () => {
        const probability = VirtualPlayer.getProbability();
        expect(probability).lessThanOrEqual(100);
        expect(probability).greaterThanOrEqual(0);
    });

    it('method exchangeLettersCommand should return command passer if the reserveLetters is empty', () => {
        game.reserveLetters.letters = [];
        const result = VirtualPlayer.exchangeLettersCommand(game);
        expect(result[0]).equal('!passer');
    });

    it('method exchangeLettersCommand should return a command exchange with the letters of the player', () => {
        const result = VirtualPlayer.exchangeLettersCommand(game);
        result[1].split('').forEach((element) => {
            expect(game.playerTurn().lettersToStringArray().includes(element.toUpperCase())).to.equal(true);
        });
        expect(result[0]).equal('!échanger');
    });

    it('method getCombinations should call getRandomLetterForBlank if the parameter contains a *', () => {
        const char = 'abc*';
        const spy = sinon.spy(VirtualPlayer, 'getRandomLetterForBlank');
        VirtualPlayer.getCombinations(char.split(''));
        assert(spy.called);
    });

    it('method getCombinations should return all the combinations of letters', () => {
        const char = 'abc';
        const expectedResult = ['a', 'ab', 'abc', 'ac', 'b', 'bc', 'c'];
        const result = VirtualPlayer.getCombinations(char.split(''));
        result.forEach((element) => {
            expect(expectedResult.includes(element)).to.equal(true);
        });
    });

    it('method shuffleArray should only shuffle elements and not modify them', () => {
        const arrayLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
        const result = VirtualPlayer.shuffleArray(arrayLetters);
        result.forEach((element) => {
            expect(arrayLetters.includes(element)).to.equal(true);
        });
    });

    it('method findAllPositionGameBoard should return the central tile in interface findAllPositionGameBoard if theres no letter on board', () => {
        const result = VirtualPlayer.findAllPositionGameBoard(game);
        expect(result[0].orientation).equal('h');
        expect(result[0].tile).equal(game.gameBoard.cases[7][7]);
        expect(result.length).equal(1);
    });

    it('method findAllPositionGameBoard should return TilePlacementPossible with horizontal orientation if theres a vertical word on board', () => {
        const tile = new Tile(CaseProperty.Normal, 7, 7);
        tile.letter = 'a';
        game.gameBoard.cases[7][7] = tile;
        game.gameBoard.cases[7][8] = tile;
        const result = VirtualPlayer.findAllPositionGameBoard(game);
        expect(result[0].orientation).equal('h');
        expect(result[0].tile).equal(game.gameBoard.cases[7][7]);
        expect(result[1].orientation).equal('h');
        expect(result[1].tile).equal(game.gameBoard.cases[7][8]);
        expect(result.length).equal(2);
    });

    it('method findAllPositionGameBoard should return TilePlacementPossible with vertical orientation if theres a horizontal word on board', () => {
        const tile = new Tile(CaseProperty.Normal, 7, 7);
        tile.letter = 'a';
        game.gameBoard.cases[7][7] = tile;
        game.gameBoard.cases[8][7] = tile;
        const result = VirtualPlayer.findAllPositionGameBoard(game);
        expect(result[0].orientation).equal('v');
        expect(result[0].tile).equal(game.gameBoard.cases[7][7]);
        expect(result[1].orientation).equal('v');
        expect(result[1].tile).equal(game.gameBoard.cases[8][7]);
        expect(result.length).equal(2);
    });

    it('method findPlacementScoreRange should return a command in the good score range', () => {
        const placementScore1: PlacementScore = {
            score: 100,
            command: '!placer h8h zoo',
        };
        const placementScore2: PlacementScore = {
            score: 50,
            command: '!placer o8h zoo',
        };
        const placementScore3: PlacementScore = {
            score: 75,
            command: '!placer l10h zoo',
        };
        const commandPlacements = [];
        commandPlacements.push(placementScore1);
        commandPlacements.push(placementScore2);
        commandPlacements.push(placementScore3);
        const result = VirtualPlayer.findPlacementScoreRange(60, 80, commandPlacements);
        expect(result).equal(placementScore3.command);
    });

    it('method findPlacementScoreRange should return the first command if theres no command in the range', () => {
        const placementScore1: PlacementScore = {
            score: 100,
            command: '!placer h8h zoo',
        };
        const placementScore2: PlacementScore = {
            score: 50,
            command: '!placer o8h zoo',
        };
        const placementScore3: PlacementScore = {
            score: 75,
            command: '!placer l10h zoo',
        };
        const commandPlacements = [];
        commandPlacements.push(placementScore1);
        commandPlacements.push(placementScore2);
        commandPlacements.push(placementScore3);
        const result = VirtualPlayer.findPlacementScoreRange(0, 49, commandPlacements);
        expect(result).equal(placementScore1.command);
    });

    it('method placementLettersCommand should call findAllPlacementCommands', () => {
        const spy = sinon.spy(VirtualPlayer, 'findAllPlacementCommands');
        VirtualPlayer.placementLettersCommand(5, game);
        assert(spy.called);
    });

    it('method placementLettersCommand should call findPlacementScoreRange with range 1 and 6 if probability is lower than 40', () => {
        const spy = sinon.spy(VirtualPlayer, 'findPlacementScoreRange');
        VirtualPlayer.placementLettersCommand(25, game);
        assert(spy.calledWith(1, 6));
    });

    it('method placementLettersCommand should call findPlacementScoreRange with range 7 and 12 if probability is between 40 and 70', () => {
        const spy = sinon.spy(VirtualPlayer, 'findPlacementScoreRange');
        VirtualPlayer.placementLettersCommand(57, game);
        assert(spy.calledWith(7, 12));
    });

    it('method placementLettersCommand should call findPlacementScoreRange with range 13 and 18 if probability is between 70 and 100', () => {
        const spy = sinon.spy(VirtualPlayer, 'findPlacementScoreRange');
        VirtualPlayer.placementLettersCommand(80, game);
        assert(spy.calledWith(13, 18));
    });

    it('method findAllPlacementCommands should call findAllPositionGameBoard', () => {
        const spy = sinon.spy(VirtualPlayer, 'findAllPositionGameBoard');
        VirtualPlayer.findAllPlacementCommands(game);
        assert(spy.called);
    });

    it('method findLettersPosition should return the new tile place by the command place', () => {
        const placementInformations: PlacementInformations = {
            row: 7,
            column: 7,
            letters: ['A', 'R', 'B', 'R', 'E'],
            orientation: Orientation.h,
            numberLetters: 5,
        };
        const result = VirtualPlayer.findLettersPosition(placementInformations, game);
        expect(result.length).equal(placementInformations.numberLetters);
        expect(result[0].letter).equal(placementInformations.letters[0]);
        expect(result[0].positionX).equal(placementInformations.row);
        expect(result[0].positionY).equal(placementInformations.column);

        expect(result[1].letter).equal(placementInformations.letters[1]);
        expect(result[1].positionX).equal(placementInformations.row + 1);
        expect(result[1].positionY).equal(placementInformations.column);

        expect(result[2].letter).equal(placementInformations.letters[2]);
        expect(result[2].positionX).equal(placementInformations.row + 2);
        expect(result[2].positionY).equal(placementInformations.column);

        expect(result[3].letter).equal(placementInformations.letters[3]);
        expect(result[3].positionX).equal(placementInformations.row + 3);
        expect(result[3].positionY).equal(placementInformations.column);

        expect(result[4].letter).equal(placementInformations.letters[4]);
        expect(result[4].positionX).equal(placementInformations.row + 4);
        expect(result[4].positionY).equal(placementInformations.column);
    });

    it('method findPlacementCommand should call findLettersPosition', () => {
        const spy = sinon.spy(VirtualPlayer, 'findLettersPosition');
        const tilePlacementPossible: TilePlacementPossible = {
            tile: game.gameBoard.cases[7][7],
            orientation: Orientation.h,
        };
        VirtualPlayer.findPlacementCommand(['bac'], tilePlacementPossible, game);
        assert(spy.called);
    });

    it('method findPlacementCommand should return valid command place', () => {
        const tilePlacementPossible: TilePlacementPossible = {
            tile: game.gameBoard.cases[7][7],
            orientation: Orientation.h,
        };
        const commands = VirtualPlayer.findPlacementCommand(['bac'], tilePlacementPossible, game);
        commands.forEach((element) => {
            expect(element.score).not.equal(0);
            expect(PlacementCommand.validatedPlaceCommandFormat(element.command.split(' '))).equal(true);
            expect(PlacementCommand.validatedPlaceCommandBoard(element.command.split(' '), game)).equal(true);
        });
    });

    it('method heapsPermute should return all the permutation possible of an array', () => {
        const arrayToPermute = ['a', 'b', 'c'];
        const words: string[] = [];
        const results = VirtualPlayer.heapsPermute(arrayToPermute, 0, words);
        const expectedElement = ['abc', 'bac', 'cab', 'acb', 'bca', 'cba'];

        results.forEach((element) => {
            expect(expectedElement).includes(element);
        });
    });
});
