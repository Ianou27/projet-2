import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResizerService } from '@app/services/resizer.service';
import { SizeSelectorComponent } from './size-selector.component';
import SpyObj = jasmine.SpyObj;

describe('SizeSelectorComponent', () => {
    let resizerServiceSpy: SpyObj<ResizerService>;
    let component: SizeSelectorComponent;
    let fixture: ComponentFixture<SizeSelectorComponent>;

    beforeEach(() => {
        resizerServiceSpy = jasmine.createSpyObj('ResizerService', ['changeFont']);
    });

    beforeEach(async () => {
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
});
