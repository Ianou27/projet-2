import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { TileHolderService } from '@app/services/tile-holder/tile-holder.service';
import { TileHolderComponent } from './tile-holder.component';
// import SpyObj = jasmine.SpyObj;

describe('TileHolderComponent', () => {
    let component: TileHolderComponent;
    let fixture: ComponentFixture<TileHolderComponent>;
    // let tileHolderServiceSpy: SpyObj<TileHolderService>;
    // let swapper: HTMLElement;

    // beforeEach(() => {
    // tileHolderServiceSpy = jasmine.createSpyObj('TileHolderService', {}, ['tileHolder']);
    // tileHolderServiceSpy.tileHolder = ['A']
    /* swapper = document.getElementById('tile-holder')?.children[0] as HTMLElement;
        swapper.id = 'swap-selected'; */
    // });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TileHolderComponent],
<<<<<<< HEAD
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
=======
            // providers: [{ provide: TileHolderService, useValue: tileHolderServiceSpy }],
>>>>>>> 1338a4b00418cfb727610855b3952815998adeb8
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TileHolderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    /* it('buttonDetect should modify the buttonPressed variable', () => {
        console.log(fixture.nativeElement);
        const expectedKey = 'a';
        const buttonEvent = {
            key: expectedKey,
        } as KeyboardEvent;
        component.buttonDetect(buttonEvent);
        expect(component.buttonPressed).toEqual(expectedKey);
    });

    it('Pressing the left arrow key should call handleSide method', () => {
        const expectedKey = 'ArrowLeft';
        const buttonEvent = {
            key: expectedKey,
        } as KeyboardEvent;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleSideSpy = spyOn<any>(component, 'handleSide');
        component.buttonDetect(buttonEvent);
        expect(component.buttonPressed).toEqual(expectedKey);
        expect(handleSideSpy).toHaveBeenCalled();
        expect(handleSideSpy).toHaveBeenCalledWith('Left', swapper);
    }); */
});
