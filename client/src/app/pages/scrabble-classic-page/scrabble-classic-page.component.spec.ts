import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ScrabbleClassicPageComponent } from './scrabble-classic-page.component';

describe('ScrabbleClassicPageComponent', () => {
    let component: ScrabbleClassicPageComponent;
    let fixture: ComponentFixture<ScrabbleClassicPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ScrabbleClassicPageComponent],
            providers: [{ provide: MatDialog, useValue: { open: () => ({ afterClosed: () => new Observable() }) } }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ScrabbleClassicPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
