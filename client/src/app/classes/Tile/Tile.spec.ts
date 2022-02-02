import { caseProperty } from '@app/../assets/caseProperty';
import { Tile } from './Tile';

describe('Tile', () => {
    let position = [0,0];
    let property = caseProperty.wordDouble;
    let tile:Tile;
    
    beforeEach(() => {
        tile = new Tile(position, property);
    });

    it('constructor should construct a tile with a position ', () => {
        let tilePosition = tile.getPosition();
        expect(position).toEqual(tilePosition);
    });

    it('constructor should construct a tile with a property', () => {
        let tileProperty = tile.getSpecialProperty();
        expect(property).toEqual(tileProperty);
    });

    it('method tileContainsLetter should return false if the tile doesnt have a letter', () => {
        let containsLetter = tile.tileContainsLetter();
        expect(false).toEqual(containsLetter);
    });

    it('method tileContainsLetter should return true if the tile have a letter', () => {
        let letter = 'a';
        tile.addLetter(letter);
        let containsLetter = tile.tileContainsLetter();
        expect(true).toEqual(containsLetter);
    });

    it('method getLetter should return the letter of the tile', () => {
        let letter = 'b';
        tile.addLetter(letter);
        let letterTile = tile.getLetter();
        expect(letter).toEqual(letterTile);
    });

});