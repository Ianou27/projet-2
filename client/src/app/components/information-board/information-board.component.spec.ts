import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormatTimePipe } from '@app/pipes/format-time.pipe';
import { InformationBoardComponent } from './information-board.component';

describe('InformationBoardComponent', () => {
    let component: InformationBoardComponent;
    let fixture: ComponentFixture<InformationBoardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [InformationBoardComponent, FormatTimePipe],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(InformationBoardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
