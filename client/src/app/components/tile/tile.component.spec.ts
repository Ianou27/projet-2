import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResizerService } from '@app/services/resizer.service';
import { BehaviorSubject } from 'rxjs';
import { TileComponent } from './tile.component';
import SpyObj = jasmine.SpyObj;

describe('TileComponent', () => {
    let resizerServiceSpy: SpyObj<ResizerService>;
    let component: TileComponent;
    let fixture: ComponentFixture<TileComponent>;

    beforeEach(async () => {
        resizerServiceSpy = jasmine.createSpyObj('ResizerService', ['changeFont'], {
            letterFontSize: new BehaviorSubject<number>(20),
            valueFontSize: new BehaviorSubject<number>(12),
        });
        await TestBed.configureTestingModule({
            declarations: [TileComponent],
            providers: [{ provide: ResizerService, useValue: resizerServiceSpy }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TileComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('tile with no letter should not be visible and assign with class tileEmpty', () => {
        component.letter = '';
        fixture.detectChanges();
    });

    it('disable not set to a value should not disabled the button ', () => {
        component.letter = 'A';
        fixture.detectChanges();
    });

    /*  it('should unsubscribe on init', () => {
        const spy = spyOn(resizerServiceSpy.letterFontSize, 'subscribe');
        component.ngOnInit();
        expect(spy).toHaveBeenCalled();
    });

    it('should unsubscribe on destroy', () => {
        const spy = spyOn(resizerServiceSpy.letterFontSize, 'unsubscribe');
        component.ngOnDestroy();
        expect(spy).toHaveBeenCalled();
    }); */
});
