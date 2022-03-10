import { CaseProperty } from '@common/assets/case-property';
import { letterValue } from '@common/assets/reserve-letters';
import { Tile } from '@common/tile/Tile';
import { expect } from 'chai';
import { Player } from './player';

describe('Player Class', () => {
    const hisTurn = true;
    let player: Player;
    const letters = ['A', 'A', 'B', 'C', 'D', 'E', '*'];
    let lettersTile: Tile[];

    beforeEach(() => {
        lettersTile = [];
        for (const letter of letters) {
            const tile: Tile = new Tile(CaseProperty.Normal, 0, 0);
            tile.letter = letter;
            tile.value = letterValue[letter];
            lettersTile.push(tile);
        }
        player = new Player(lettersTile, hisTurn, 'player1', { username: 'rt', id: '1', room: 'room1' });
    });

    it('constructor should construct a player with object tile as letters', () => {
        const playerLetters = player.getLetters();
        expect(lettersTile).to.equal(playerLetters);
    });

    it('constructor should construct a player with an attribute turn', () => {
        const playerHisTurn = player.getHisTurn();
        expect(hisTurn).to.equal(playerHisTurn);
    });

    it('method changeTurn should change the turn of the player', () => {
        player.changeTurn();
        const playerHisTurn = player.getHisTurn();
        expect(!hisTurn).to.equal(playerHisTurn);
    });

    it('method lettersToStringArray should return all the letters of the player in an array of string', () => {
        const playerLetters = player.lettersToStringArray();
        expect(playerLetters).to.eql(letters);
    });

    it("method changeLetters should change only the first occurence in the player's letters", () => {
        const lettersWithChange = ['Z', 'A', 'B', 'C', 'D', 'E', '*'];
        player.changeLetter('a', 'z');
        const playerLetters = player.lettersToStringArray();
        expect(playerLetters).to.eql(lettersWithChange);
    });

    it('method changeLetters should be able to change a blank letter * ', () => {
        const lettersWithChange = ['A', 'A', 'B', 'C', 'D', 'E', 'R'];
        player.changeLetter('A', 'r');
        const playerLetters = player.lettersToStringArray();
        expect(playerLetters).to.eql(lettersWithChange);
    });
});
