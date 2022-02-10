import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WaitingPlayerDialogComponent } from './waiting-player-dialog.component';

describe('WaitingPlayerDialogComponent', () => {
    let component: WaitingPlayerDialogComponent;
    let fixture: ComponentFixture<WaitingPlayerDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [WaitingPlayerDialogComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(WaitingPlayerDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
