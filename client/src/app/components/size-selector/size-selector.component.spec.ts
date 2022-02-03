import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResizerService } from '@app/services/resizer.service';
import { BehaviorSubject } from 'rxjs';
import { SizeSelectorComponent } from './size-selector.component';
import SpyObj = jasmine.SpyObj;

describe('SizeSelectorComponent', () => {
    let resizerServiceSpy: SpyObj<ResizerService>;
    let component: SizeSelectorComponent;
    let fixture: ComponentFixture<SizeSelectorComponent>;

    beforeEach(async () => {
        resizerServiceSpy = jasmine.createSpyObj('ResizerService', ['changeFont'], {
            letterFontSize: new BehaviorSubject<number>(20),
            valueFontSize: new BehaviorSubject<number>(12),
        });
        await TestBed.configureTestingModule({
            declarations: [SizeSelectorComponent],
            providers: [{ provide: ResizerService, useValue: resizerServiceSpy }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SizeSelectorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('changeFont should call changeFont in the service', () => {
        component.changeFont('-');
        expect(resizerServiceSpy.changeFont).toHaveBeenCalled();
    });

    it('should unsubscribe on init', () => {
        const spy = spyOn(resizerServiceSpy.letterFontSize, 'subscribe');
        component.ngOnInit();
        expect(spy).toHaveBeenCalled();
    });

    it('should unsubscribe on destroy', () => {
        const spy = spyOn(resizerServiceSpy.letterFontSize, 'unsubscribe');
        component.ngOnDestroy();
        expect(spy).toHaveBeenCalled();
    });
});
