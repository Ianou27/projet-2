import { Injectable } from '@angular/core';
import { Tile } from '@app/../../../common/tile/Tile';
import { SocketClientService } from './socket-client.service';

@Injectable({
    providedIn: 'root',
})
export class BoardService {
    board: Tile[][];

    constructor(public socketService: SocketClientService) {
        this.board = new Array(15);
        for (let i = 0; i < 15; i++) {
            this.board[i] = new Array(15);
        }
    }

    getBoard() {
        return this.board;
    }

    configureBaseSocketFeatures() {
        this.socketService.on('modification', (updatedBoard: Tile[][]) => {
            this.board = updatedBoard;
        });
    }
}
