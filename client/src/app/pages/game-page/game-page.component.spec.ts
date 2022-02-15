// import { MockLocationStrategy } from '@angular/common/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { QuitGameDialogComponent } from '@app/components/quit-game-dialog/quit-game-dialog.component';
import { GamePageComponent } from './game-page.component';

describe('GamePageComponent', () => {
    let component: GamePageComponent;
    let fixture: ComponentFixture<GamePageComponent>;
    let pushSpy: jasmine.Spy<(data: unknown, unused: string, url?: string | URL | null | undefined) => void>;
    // let popStateSpy: jasmine.Spy<(fn: LocationChangeListener) => void>;
    // let location: LocationStrategy;
    // let dialog: MatDialog;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GamePageComponent, PlayAreaComponent, QuitGameDialogComponent],
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
        }).compileComponents();
    });

    beforeEach(() => {
        pushSpy = spyOn(history, 'pushState').and.callThrough();
        fixture = TestBed.createComponent(GamePageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
        expect(pushSpy).toHaveBeenCalled();
    });

    it('should call pushState and openDialog', () => {
        const event = new PopStateEvent('popstate');
        const dialogSpy = spyOn(component, 'openDialog');
        window.dispatchEvent(event);
        fixture.detectChanges();
        expect(dialogSpy).toHaveBeenCalled();
    });

    it('clicking on the quit button should call openDialog', () => {
        const dialogMethodSpy = spyOn(component, 'openDialog');
        const quitButton = fixture.debugElement.query(By.css('#tooltip'));
        quitButton.triggerEventHandler('click', null);
        fixture.detectChanges();
        expect(dialogMethodSpy).toHaveBeenCalled();
    });

    it('openDialog should call open on the dialog', () => {
        const dialogSpy = spyOn(component.dialog, 'open');
        component.openDialog();
        expect(dialogSpy).toHaveBeenCalledWith(QuitGameDialogComponent);
    });
});
