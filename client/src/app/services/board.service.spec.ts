import { TestBed } from '@angular/core/testing';
import { BoardService } from './board.service';

describe('BoardService', () => {
    let service: BoardService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(BoardService);
    });

    beforeEach(() => {
        service.build();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('method setLetter should set the letter on the board', () => {
        service.setLetter(0, 0, 'A', 1);
        expect(service.board[0][0].letter).toEqual('A');
        expect(service.board[0][0].value).toEqual(1);
    });

    it('method removeLetter should set the letter to "" and value to 0', () => {
        service.setLetter(0, 0, 'A', 1);
        expect(service.board[0][0].letter).toEqual('A');
        expect(service.board[0][0].value).toEqual(1);
        service.removeLetter(0, 0);
        expect(service.board[0][0].letter).toEqual('');
        expect(service.board[0][0].value).toEqual(0);
    });
});
