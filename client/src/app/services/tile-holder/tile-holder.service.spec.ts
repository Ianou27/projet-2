import { TestBed } from '@angular/core/testing';
import { CaseProperty } from './../../../../../common/assets/case-property';
import { letterValue } from './../../../../../common/assets/reserve-letters';
import { Tile } from './../../../../../common/tile/Tile';
import { TileHolderService } from './tile-holder.service';

describe('TileHolderService', () => {
    let service: TileHolderService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TileHolderService);
        const tileHolder = [];
        for (let i = 0; i < 7; i++) {
            const tile: Tile = new Tile(CaseProperty.Normal, 0, 0);
            tile.letter = 'A';
            tile.value = letterValue[tile.letter];
            tileHolder.push(tile);
        }
        service.tileHolder = tileHolder;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('removeLetter should remove a letter once when there is multiple same letter', () => {
        expect(service.tileHolder.length).toBe(7);
        service.removeLetter('a');
        expect(service.tileHolder.length).toBe(6);
    });

    it('removeLetter should add the removed letter to the array', () => {
        expect(service.removedLetters.length).toBe(0);
        service.removeLetter('a');
        expect(service.removedLetters.length).toBe(1);
    });

    it('removeLetter should not remove a letter if it is not in the tile holder', () => {
        expect(service.tileHolder.length).toBe(7);
        service.removeLetter('b');
        expect(service.tileHolder.length).toBe(7);
    });

    it('addLetter should add a new Tile', () => {
        service.removedLetters = ['A', 'B'];
        expect(service.tileHolder.length).toBe(7);
        service.addLetter('b');
        expect(service.tileHolder.length).toBe(8);
        expect(service.tileHolder[7].letter).toBe('B');
    });

    it('addLetter should remove the letter from the removed letter array', () => {
        service.removedLetters = ['A', 'B'];
        expect(service.removedLetters.length).toBe(2);
        service.addLetter('A');
        expect(service.removedLetters.length).toBe(1);
    });

    it('addLetter should not add the letter if it is not in the removedLetters array', () => {
        service.removedLetters = ['A', 'B'];
        expect(service.tileHolder.length).toBe(7);
        service.addLetter('C');
        expect(service.tileHolder.length).toBe(7);
    });

    it('letterInTileHolder should return the right value', () => {
        const answer = service.letterInTileHolder('a');
        expect(answer[0]).toBeTrue();
        expect(answer[1]).toEqual(0);
    });
});
