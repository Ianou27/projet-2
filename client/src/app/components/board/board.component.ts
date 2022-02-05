import { AfterViewInit, Component } from '@angular/core';
import { GameBoardService } from '@app/services/game-board/game-board.service';

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements AfterViewInit {
    constructor(public gameBoardService: GameBoardService) {}
    ngAfterViewInit(): void {}
}
