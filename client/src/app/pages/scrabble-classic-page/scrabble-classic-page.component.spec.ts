import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScrabbleClassicPageComponent } from './scrabble-classic-page.component';

describe('ScrabbleClassicPageComponent', () => {
    let component: ScrabbleClassicPageComponent;
    let fixture: ComponentFixture<ScrabbleClassicPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ScrabbleClassicPageComponent],
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
