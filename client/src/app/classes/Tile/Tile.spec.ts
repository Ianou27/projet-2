import { caseProperty } from '@app/../assets/caseProperty';
import { Tile } from './Tile';

describe('Tile', () => {
    const position = [0, 0];
    const property = caseProperty.wordDouble;
    let tile: Tile;

    beforeEach(() => {
        tile = new Tile(position, property);
    });

    it('constructor should construct a tile with a position ', () => {
        const tilePosition = tile.getPosition();
        expect(position).toEqual(tilePosition);
    });

    it('constructor should construct a tile with a property', () => {
        const tileProperty = tile.getSpecialProperty();
        expect(property).toEqual(tileProperty);
    });

    it('method tileContainsLetter should return false if the tile doesnt have a letter', () => {
        const containsLetter = tile.tileContainsLetter();
        expect(false).toEqual(containsLetter);
    });

    it('method tileContainsLetter should return true if the tile have a letter', () => {
        const letter = 'a';
        tile.addLetter(letter);
        const containsLetter = tile.tileContainsLetter();
        expect(true).toEqual(containsLetter);
    });

    it('method getLetter should return the letter of the tile', () => {
        const letter = 'b';
        tile.addLetter(letter);
        const letterTile = tile.getLetter();
        expect(letter).toEqual(letterTile);
    });
});
