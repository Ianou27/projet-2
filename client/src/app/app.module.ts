import { HttpClientModule /* , HTTP_INTERCEPTORS*/ } from '@angular/common/http';
// import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { AppRoutingModule } from '@app/modules/app-routing.module';
import { AppMaterialModule } from '@app/modules/material.module';
import { AppComponent } from '@app/pages/app/app.component';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { MaterialPageComponent } from '@app/pages/material-page/material-page.component';
// import { LoadingScreenInterceptor } from './classes/http-interceptor';
import { ButtonComponent } from './components/button/button.component';
import { MultiplayerPageComponent } from './pages/multiplayer-page/multiplayer-page.component';
import { ScrabbleClassicPageComponent } from './pages/scrabble-classic-page/scrabble-classic-page.component';
import { WaitingMultiplayerPageComponent } from './pages/waiting-multiplayer-page/waiting-multiplayer-page.component';

// import { LoadingScreenService } from './services/loading-screen/loading-screen.service';

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
        SidebarComponent,
        ButtonComponent,
        MultiplayerPageComponent,
        ScrabbleClassicPageComponent,
        WaitingMultiplayerPageComponent,
    ],
    imports: [AppMaterialModule, AppRoutingModule, BrowserAnimationsModule, BrowserModule, FormsModule, HttpClientModule, MatDialogModule],
    providers: [
        //     {
        //         provide: HTTP_INTERCEPTORS,
        //         useClass: LoadingScreenInterceptor,
        //         multi: true,
        //     },
    ],
    bootstrap: [AppComponent],
    entryComponents: [MultiplayerPageComponent],
})
export class AppModule {}
