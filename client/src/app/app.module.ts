import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { AppRoutingModule } from '@app/modules/app-routing.module';
import { AppMaterialModule } from '@app/modules/material.module';
import { AppComponent } from '@app/pages/app/app.component';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { MaterialPageComponent } from '@app/pages/material-page/material-page.component';
import { BoardComponent } from './components/board/board.component';
import { CommunicationAreaComponent } from './components/communication-area/communication-area.component';
import { InformationBoardComponent } from './components/information-board/information-board.component';
import { QuitGameDialogComponent } from './components/quit-game-dialog/quit-game-dialog.component';
import { SizeSelectorComponent } from './components/size-selector/size-selector.component';
import { TileHolderComponent } from './components/tile-holder/tile-holder.component';
import { TileComponent } from './components/tile/tile.component';
import { WaitingPlayerDialogComponent } from './components/waiting-player-dialog/waiting-player-dialog.component';
import { WaitingPlayerTwoComponent } from './components/waiting-player-two/waiting-player-two.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { BestScoreComponent } from './pages/best-score/best-score.component';
import { JoinPageComponent } from './pages/join-page/join-page.component';
import { FormatTimePipe } from './pipes/format-time.pipe';
import { GoalsComponent } from './components/goals/goals.component';

/**
 * Main module that is used in main.ts.
 * All automatically generated components will appear in this module.
 * Please do not move this module in the module folder.
 * Otherwise Angular Cli will not know in which module to put new component
 */
@NgModule({
    declarations: [
        AppComponent,
        GamePageComponent,
        MainPageComponent,
        MaterialPageComponent,
        PlayAreaComponent,
        TileHolderComponent,
        TileComponent,
        InformationBoardComponent,
        SizeSelectorComponent,
        FormatTimePipe,
        CommunicationAreaComponent,
        QuitGameDialogComponent,
        CommunicationAreaComponent,
        JoinPageComponent,
        WaitingPlayerDialogComponent,
        WaitingPlayerTwoComponent,
        BoardComponent,
        BestScoreComponent,
        AdminPageComponent,
        GoalsComponent,
    ],
    imports: [AppMaterialModule, AppRoutingModule, BrowserAnimationsModule, BrowserModule, FormsModule, HttpClientModule, MatDialogModule],
    providers: [],
    bootstrap: [AppComponent],
    entryComponents: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
