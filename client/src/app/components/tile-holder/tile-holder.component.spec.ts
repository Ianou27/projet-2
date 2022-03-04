import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TileHolderComponent } from './tile-holder.component';

describe('TileHolderComponent', () => {
    let component: TileHolderComponent;
    let fixture: ComponentFixture<TileHolderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TileHolderComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
});
