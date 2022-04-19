/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Timer } from '@app/services/timer-manager/timer-manager.service';
import { CaseProperty } from '@common/assets/case-property';
import { letterValue } from '@common/assets/reserve-letters';
import { Tile } from '@common/tile/Tile';
import { assert, expect } from 'chai';
import * as sinon from 'sinon';
import { Game } from './../game/game';
import { Player } from './../player/player';
import { VirtualPlayer } from './../virtual-player/virtual-player';
import { ClueCommand } from './clue-command';

describe('ClueCommand', () => {
    let game: Game = new Game();
    let lettersTilePlayer: Tile[] = [];
    const lettersPlayer = ['A', 'R', 'A', 'B', 'R', 'E', '*'];

    beforeEach(() => {
        game = new Game();

        for (const letterPlayer of lettersPlayer) {
            const tile1: Tile = new Tile(CaseProperty.Normal, 0, 0);
            tile1.letter = letterPlayer;
            tile1.value = letterValue[letterPlayer];
            lettersTilePlayer.push(tile1);
        }

        game.player1 = new Player(lettersTilePlayer, true, 'player1', { username: 'rt', id: '1', room: 'room1' });
        game.player2 = new Player(lettersTilePlayer, false, 'player2', { username: 'aa', id: '2', room: 'room1' });
        game.timer = new Timer('60');
    });

    afterEach(() => {
        lettersTilePlayer = [];
    });

    it('method verifyFormat should return true if the format is valid', () => {
        const validClueCommand = '!indice';
        const result = ClueCommand.verifyFormat(validClueCommand.split(' '));
        expect(result).to.equal(true);
    });

    it('method verifyFormat should return false if the format is not valid', () => {
        const validClueCommand = '!indicee';
        const result = ClueCommand.verifyFormat(validClueCommand.split(' '));
        expect(result).to.equal(false);
    });

    it('method verifyFormat should return false if the command has a length greater than 1', () => {
        const validClueCommand = '!indice bon';
        const result = ClueCommand.verifyFormat(validClueCommand.split(' '));
        expect(result).to.equal(false);
    });

    it('method findClues should call findAllPlacementCommands from VirtualPlayer', () => {
        const spy = sinon.spy(VirtualPlayer, 'findAllPlacementCommands');
        ClueCommand.findClues(game);
        assert(spy.call);
    });
});
