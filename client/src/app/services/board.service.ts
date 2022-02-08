import { Injectable } from '@angular/core';
import { Tile } from '@app/../../../common/tile/Tile';
import { CaseProperty } from './../../../../common/assets/case-property';
import { COLUMN_ROWS_NUMBER } from './../../../../common/constants/general-constants';
import { LETTER_2X, LETTER_3X, WORD_2X, WORD_3X } from './../../../../common/constants/tile-information';
import { Vec2 } from './../../../../common/vec2';
import { SocketClientService } from './socket-client.service';

@Injectable({
    providedIn: 'root',
})
export class BoardService {
    board: Tile[][];

    constructor(public socketService: SocketClientService) {
        this.board = new Array(COLUMN_ROWS_NUMBER);
        for (let i = 0; i < COLUMN_ROWS_NUMBER; i++) {
            this.board[i] = new Array(COLUMN_ROWS_NUMBER);
            for (let j = 0; j < COLUMN_ROWS_NUMBER; j++) {
                if (this.verifyProperty(WORD_3X, i, j)) {
                    this.board[i][j] = new Tile(CaseProperty.WordTriple);
                } else if (this.verifyProperty(WORD_2X, i, j)) {
                    this.board[i][j] = new Tile(CaseProperty.WordDouble);
                } else if (this.verifyProperty(LETTER_3X, i, j)) {
                    this.board[i][j] = new Tile(CaseProperty.LetterTriple);
                } else if (this.verifyProperty(LETTER_2X, i, j)) {
                    this.board[i][j] = new Tile(CaseProperty.LetterDouble);
                } else {
                    this.board[i][j] = new Tile(CaseProperty.Normal);
                }
            }
        }
        this.connect();
    }

    connect() {
        this.socketService.connect();
        this.configureBaseSocketFeatures();
    }

    configureBaseSocketFeatures() {
        console.log('configuration');
        this.socketService.on('modification', (updatedBoard: Tile[][]) => {
            console.log('Received');
            this.board = updatedBoard;
        });
    }
    getBoard() {
        return this.board;
    }

    private verifyProperty(property: Vec2[], positionX: number, positionY: number): boolean {
        for (const position of property) {
            if (position.x === positionX && position.y === positionY) {
                return true;
            }
        }
        return false;
    }
}
