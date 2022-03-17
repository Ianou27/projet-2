import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BestScoreComponent } from './best-score.component';

describe('BestScoreComponent', () => {
    let component: BestScoreComponent;
    let fixture: ComponentFixture<BestScoreComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BestScoreComponent],
            imports: [MatDialogModule],
            providers: [
                {
                    provide: MatDialog,
                    useValue: {
                        open: () => {
                            return;
                        },
                    },
                },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BestScoreComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // it('goHome() should close the dialog', () => {
    //     const closeSpy = spyOn(component.waitDialog, 'closeAll');
    //     component.goHome();
    //     expect(closeSpy).toHaveBeenCalled();
    // });

    // it('goHome() should disconnect from chatService', () => {
    //     const disconnectSpy = spyOn(component.chatService, 'disconnect');
    //     component.goHome();
    //     expect(disconnectSpy).toHaveBeenCalled();
    // });
});
