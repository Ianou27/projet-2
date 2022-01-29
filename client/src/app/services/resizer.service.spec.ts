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

    it('changeFont should call changeValue', () => {
        const changeValueSpy = spyOn(service, 'changeValue').and.callThrough();
        service.changeFont('+');
        expect(changeValueSpy).toHaveBeenCalled();
    });

    it('changeFont should call changeValue', () => {
        const changeValueSpy = spyOn(service, 'changeValue').and.callThrough();
        service.changeFont('-');
        expect(changeValueSpy).toHaveBeenCalled();
    });

    it('changeFont should not call changeValue it param is empty', () => {
        const changeValueSpy = spyOn(service, 'changeValue').and.callThrough();
        service.changeFont('');
        expect(changeValueSpy).toHaveBeenCalledTimes(0);
    });
});
