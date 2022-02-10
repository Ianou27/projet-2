import { TestBed } from '@angular/core/testing';
import { TileHolderService } from './tile-holder.service';


describe('TileHolderService', () => {
    let service: TileHolderService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TileHolderService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
