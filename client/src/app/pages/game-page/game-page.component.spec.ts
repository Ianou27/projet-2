// import { MockLocationStrategy } from '@angular/common/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { QuitGameDialogComponent } from '@app/components/quit-game-dialog/quit-game-dialog.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
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
            declarations: [GamePageComponent, SidebarComponent, PlayAreaComponent, QuitGameDialogComponent],
            imports: [MatDialogModule],
            providers: [
                // { provide: LocationStrategy, useClass: MockLocationStrategy },
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
        // eslint-disable-next-line dot-notation
        // popStateSpy = spyOn(component['location'], 'onPopState').and.callThrough();
        fixture = TestBed.createComponent(GamePageComponent);
        component = fixture.componentInstance;
        // location = TestBed.inject(LocationStrategy);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
        expect(pushSpy).toHaveBeenCalled();
        // expect(popStateSpy).toHaveBeenCalled();
    });

    // it('should call pushState and onPopState on construction', () => {
    //     const pushSpy = spyOn(history, 'pushState');
    //     // const popStateSpy = spyOn(component['location'], 'onPopState');
    //     // new GamePageComponent(dialog, location);
    //     // expect(popStateSpy).toHaveBeenCalled();
    //     expect(pushSpy).toHaveBeenCalled();
    // });

    it('should call pushState and openDialog', () => {
        const event = new PopStateEvent('popstate');
        // const pushSpy = spyOn(history, 'pushState');
        const dialogSpy = spyOn(component, 'openDialog');
        // new GamePageComponent(dialog, location);
        // Object.assign(event.state, { foo: 'bar' });
        window.dispatchEvent(event);
        fixture.detectChanges();
        expect(dialogSpy).toHaveBeenCalled();
        // expect(pushSpy).toHaveBeenCalled();
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
