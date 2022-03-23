import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from '@app/../../../common/constants/board';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { GridService } from '@app/services/grid/grid.service';

describe('PlayAreaComponent', () => {
    let component: PlayAreaComponent;
    let fixture: ComponentFixture<PlayAreaComponent>;
    let gridServiceSpy: jasmine.SpyObj<GridService>;

    beforeEach(async () => {
        gridServiceSpy = jasmine.createSpyObj('GridService', ['draw']);
        await TestBed.configureTestingModule({
            declarations: [PlayAreaComponent],
            providers: [{ provide: GridService, useValue: gridServiceSpy }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PlayAreaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('ngAfterViewInit should call draw', () => {
        component.ngAfterViewInit();
        expect(gridServiceSpy.draw).toHaveBeenCalled();
    });

    it('ngOnInit should call draw', () => {
        expect(gridServiceSpy.draw).toHaveBeenCalled();
    });

    it('get Width should return the right value', () => {
        expect(component.width).toBe(DEFAULT_WIDTH);
    });

    it('get Height should return the right value', () => {
        expect(component.height).toBe(DEFAULT_HEIGHT);
    });
});
