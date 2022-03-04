import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TileComponent } from './tile.component';

describe('TileComponent', () => {
    let component: TileComponent;
    let fixture: ComponentFixture<TileComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TileComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
});
