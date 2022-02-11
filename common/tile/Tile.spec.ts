/*import { CaseProperty } from './../assets/case-property';
import { Tile } from './Tile';
import { expect } from 'chai';

describe('Tile', () => {
    let tile = new Tile(CaseProperty.Normal);
    const letterP = 'P';
    const valueP = 3;
    const emptyString = '';
    const emptyValue = 0;

    beforeEach(() => {
        tile = new Tile(CaseProperty.Normal);
    });

    it('should create an instance', () => {
        expect(new Tile(CaseProperty.Normal)).toBeTruthy();
    });

    it('should be initialize with no letter', () => {
        expect(tile.getLetter()).toEqual(emptyString);
        expect(tile.getValue()).toEqual(emptyValue);
    });

    it('method addLetter should change the attribute letter and assign value of the letter', () => {
        tile.addLetter(letterP);

        expect(tile.getLetter()).toEqual(letterP);
        expect(tile.getValue()).toEqual(valueP);
    });

    it('method removeLetter should reinitialise the attribute letter and value', () => {
        tile.addLetter(letterP);
        tile.removeLetter();

        expect(tile.getLetter()).toEqual(emptyString);
        expect(tile.getValue()).toEqual(emptyValue);
    });
});*/
