import { CaseProperty } from '@common/assets/case-property';
import { letterValue } from '@common/assets/reserve-letters';
import { Tile } from '@common/tile/Tile';
import { expect } from 'chai';
import { Game } from './../game/game';
import { Player } from './../player/player';
import { VirtualPlayer } from './virtual-player';
describe('Virtual Player', () => {
    let game: Game;
    const lettersPlayer1 = ['T', 'O', 'R'];
    let lettersTilePlayer1: Tile[] = [];

    beforeEach(() => {
        game = new Game();
        game.player1 = new Player(game.reserveLetters.randomLettersInitialization(), true, 'player1', { username: 'bot', id: '1', room: 'room1' });
        for (const letter of lettersPlayer1) {
            const tile1: Tile = new Tile(CaseProperty.Normal, 0, 0);
            tile1.letter = letter;
            tile1.value = letterValue[letter];
            lettersTilePlayer1.push(tile1);
        }
        game.player1.letters = lettersTilePlayer1;
    });

    afterEach(() => {
        lettersTilePlayer1 = [];
    });

    it('method getCombinations should return all of the different combination possible', () => {
        const expectedCombinations = ['TO', 'TOR', 'TR', 'TRO', 'OR', 'OT', 'ORT', 'OTR', 'RO', 'RT', 'ROT', 'RTO'];
        const allCombinations = VirtualPlayer.getCombinations(lettersPlayer1);
        allCombinations.forEach((element) => {
            expect(expectedCombinations.includes(element)).to.equal(true);
        });
    });
});
