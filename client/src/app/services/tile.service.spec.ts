import { TestBed } from '@angular/core/testing';
import { TileService } from './tile.service';

describe('TileService', () => {
    let service: TileService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TileService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});

describe('Tile', () => {
    let tileService: TileService;

    beforeEach(() => {
        tileService = new TileService();
    });

    it('constructor should construct a tile with an empty string as letter', () => {
        const emptyString = '';
        const letterTileService = tileService.letter;
        expect(letterTileService).toEqual(emptyString);
    });

    it('constructor should construct a tile with a property', () => {
        const tileProperty = tileService.getSpecialProperty();
        expect(property).toEqual(tileProperty);
    });

    it('method tileContainsLetter should return false if the tile doesnt have a letter', () => {
        const containsLetter = tileService.tileContainsLetter();
        expect(false).toEqual(containsLetter);
    });

    it('method tileContainsLetter should return true if the tile have a letter', () => {
        const letter = 'a';
        tileService.addLetter(letter);
        const containsLetter = tileService.tileContainsLetter();
        expect(true).toEqual(containsLetter);
    });
});
