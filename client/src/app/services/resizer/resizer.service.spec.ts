import { TestBed } from '@angular/core/testing';
import { ResizerService } from './resizer.service';

describe('ResizerService', () => {
    let service: ResizerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ResizerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('changeFont should call changeLetterSizeValue if param is valid', () => {
        const changeLetterSizeValueSpy = spyOn(service, 'changeLetterSizeValue').and.callThrough();
        service.changeFont('+');
        expect(changeLetterSizeValueSpy).toHaveBeenCalled();
    });

    it('changeFont should call changeLetterSizeValue if param is valid', () => {
        const changeLetterSizeValueSpy = spyOn(service, 'changeLetterSizeValue').and.callThrough();
        service.changeFont('-');
        expect(changeLetterSizeValueSpy).toHaveBeenCalled();
    });

    it('changeFont should not call changeLetterSizeValue if param not valid', () => {
        const changeLetterSizeValueSpy = spyOn(service, 'changeLetterSizeValue').and.callThrough();
        service.changeFont('a');
        expect(changeLetterSizeValueSpy).toHaveBeenCalledTimes(0);
    });

    it('changeFont should not call changeLetterSizeValue if param is empty', () => {
        const changeLetterSizeValueSpy = spyOn(service, 'changeLetterSizeValue').and.callThrough();
        service.changeFont('');
        expect(changeLetterSizeValueSpy).toHaveBeenCalledTimes(0);
    });
});
