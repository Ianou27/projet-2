import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MultiplayerPageComponent } from './multiplayer-page.component';

const mockMatDialogRef = {
    close: () => {
        return;
    },
};

describe('MultiplayerPageComponent', () => {
    let component: MultiplayerPageComponent;
    let fixture: ComponentFixture<MultiplayerPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MultiplayerPageComponent],
            providers: [
                {
                    provide: MatDialogRef,
                    useValue: mockMatDialogRef,
                },
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: {},
                },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MultiplayerPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
