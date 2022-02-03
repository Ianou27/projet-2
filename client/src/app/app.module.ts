import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { InformationBoardComponent } from './components/information-board/information-board.component';
import { TileHolderComponent } from './components/tile-holder/tile-holder.component';
import { TileComponent } from './components/tile/tile.component';
import { SizeSelectorComponent } from './components/size-selector/size-selector.component';
import { FormatTimePipe } from './pipes/format-time.pipe';
import { ButtonComponent } from './components/button/button.component';
import { ScrabbleClassicPageComponent } from './pages/scrabble-classic-page/scrabble-classic-page.component';

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
        TileHolderComponent,
        TileComponent,
        InformationBoardComponent,
        SizeSelectorComponent,
        FormatTimePipe,
        ButtonComponent,
        ScrabbleClassicPageComponent
    ],
    imports: [AppMaterialModule, AppRoutingModule, BrowserAnimationsModule, BrowserModule, FormsModule, HttpClientModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
