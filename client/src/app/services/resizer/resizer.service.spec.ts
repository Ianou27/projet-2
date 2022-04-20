/* eslint-disable @typescript-eslint/no-magic-numbers */
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
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
        service.letterFontSize = new BehaviorSubject<number>(16);
        const changeLetterSizeValueSpy = spyOn(service, 'changeLetterSizeValue');
        service.changeFont('+');
        expect(changeLetterSizeValueSpy).toHaveBeenCalled();
    });

    it('changeFont should call changeLetterSizeValue if param is valid', () => {
        service.letterFontSize = new BehaviorSubject<number>(16);
        const changeLetterSizeValueSpy = spyOn(service, 'changeLetterSizeValue');
        service.changeFont('-');
        expect(changeLetterSizeValueSpy).toHaveBeenCalled();
    });

    it('changeFont should not call changeLetterSizeValue if param not valid', () => {
        const changeLetterSizeValueSpy = spyOn(service, 'changeLetterSizeValue');
        service.changeFont('a');
        expect(changeLetterSizeValueSpy).toHaveBeenCalledTimes(0);
    });

    it('changeFont should not call changeLetterSizeValue if param is empty', () => {
        const changeLetterSizeValueSpy = spyOn(service, 'changeLetterSizeValue');
        service.changeFont('');
        expect(changeLetterSizeValueSpy).toHaveBeenCalledTimes(0);
    });

    it('changeFont should call changeLetterSizeValue if param is valid', () => {
        service.letterFontSize = new BehaviorSubject<number>(16);
        const nextSpy = spyOn(service.letterFontSize, 'next');
        service.changeLetterSizeValue(17);
        expect(nextSpy).toHaveBeenCalled();
        expect(nextSpy).toHaveBeenCalledWith(17);
    });
});
