import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { CASE_SIZE, DEFAULT_HEIGHT, DEFAULT_WIDTH, NUMBER_OF_CASES } from '@app/constants/board';
import { LETTER_2X, LETTER_3X, WORD_2X, WORD_3X } from '@app/constants/tile-information';

// TODO : Avoir un fichier séparé pour les constantes et ne pas les répéter!
/* export const DEFAULT_WIDTH = 500;
export const DEFAULT_HEIGHT = 500;
export const NUMBER_OF_CASES = 15;
export const CASE_SIZE = DEFAULT_HEIGHT / NUMBER_OF_CASES; */

@Injectable({
    providedIn: 'root',
})
export class GridService {
    gridContext: CanvasRenderingContext2D;
    private canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };

    // TODO : pas de valeurs magiques!! Faudrait avoir une meilleure manière de le faire
    /* eslint-disable @typescript-eslint/no-magic-numbers */
    drawGrid() {
        this.gridContext.beginPath();
        this.gridContext.fillStyle = 'black';
        this.gridContext.lineWidth = 1;

        for (let i = 1; i < NUMBER_OF_CASES; i++) {
            this.gridContext.moveTo(0, (this.height * i) / NUMBER_OF_CASES);
            this.gridContext.lineTo(DEFAULT_WIDTH, (this.height * i) / NUMBER_OF_CASES);
        }
        for (let i = 1; i < NUMBER_OF_CASES; i++) {
            this.gridContext.moveTo((this.width * i) / NUMBER_OF_CASES, 0);
            this.gridContext.lineTo((this.width * i) / NUMBER_OF_CASES, DEFAULT_HEIGHT);
        }

        this.gridContext.stroke();
    }

    drawTilesColor(color: string, bonusType: Vec2[]) {
        this.gridContext.fillStyle = color;
        for (const tiles of bonusType) {
            this.gridContext.fillRect(tiles.x * CASE_SIZE, tiles.y * CASE_SIZE, CASE_SIZE, CASE_SIZE);
        }
    }

    writeBonusTypes(word: string, bonusType: Vec2[]) {
        const wordOffset = CASE_SIZE / 2;
        const xOffset = 2;
        this.gridContext.fillStyle = 'black';
        this.gridContext.font = '14px Arial';
        for (const tiles of bonusType) {
            if (!(tiles.x === 7 && tiles.y === 7)) {
                this.gridContext.fillText(word, tiles.x * CASE_SIZE + xOffset, tiles.y * CASE_SIZE + wordOffset, CASE_SIZE - 4);
            }
        }
    }

    drawTiles() {
        this.drawTilesColor('#F51919FA', WORD_3X);
        this.drawTilesColor('#B33754F0', WORD_2X);
        this.drawTilesColor('#0320FC96', LETTER_3X);
        this.drawTilesColor('#4A97EE5F', LETTER_2X);
        this.writeBonusTypes('MOT', WORD_3X);
        this.writeBonusTypes('MOT', WORD_2X);
        this.writeBonusTypes('LETTRE', LETTER_3X);
        this.writeBonusTypes('LETTRE', LETTER_2X);
    }

    drawWordTimesThreeTiles() {
        this.gridContext.fillStyle = 'black';
        this.gridContext.font = '14px system-ui';
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                this.gridContext.fillText('MOT', 1 + CASE_SIZE * i * 7, CASE_SIZE / 2 + CASE_SIZE * j * 7, CASE_SIZE);
                this.gridContext.fillText('X3', CASE_SIZE / 2 + CASE_SIZE * i * 7, CASE_SIZE - 1 + CASE_SIZE * j * 7);
            }
        }
    }

    drawWordTimesTwoTiles() {
        this.writeWordTimesTwo();
    }

    writeWordTimesTwo() {
        this.gridContext.fillStyle = 'black';
        this.gridContext.font = '14px system-ui';

        for (let i = 0; i < 13; i++) {
            for (let j = 0; j < 13; j++) {
                if (i === 4) {
                    i = 9;
                    j = 9;
                }
                if (i === j) {
                    this.gridContext.fillText('MOT', 1 + CASE_SIZE + CASE_SIZE * i, CASE_SIZE + CASE_SIZE / 2 + CASE_SIZE * j, CASE_SIZE);
                    this.gridContext.fillText('X2', CASE_SIZE + CASE_SIZE * i, CASE_SIZE * 2 - 1 + CASE_SIZE * j, CASE_SIZE);
                }
            }
        }
        for (let i = 13; i > 0; i--) {
            for (let j = 13; j > 0; j--) {
                if (i === 9) {
                    i = 4;
                    j = 4;
                }
                if (i === j) {
                    this.gridContext.fillText('MOT x2', 701 - 50 * i, 31 + 50 * j, 47);
                }
            }
        }
    }

    drawLetterTimesThreeTiles() {
        this.gridContext.fillStyle = 'black';
        this.gridContext.font = '13px system-ui';
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 2; j++) {
                this.gridContext.fillText('LETTRE x3', 52 + 200 * i, 281 + 200 * j, 46);
            }
        }
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                this.gridContext.fillText('LETTRE x3', 252 + 200 * i, 81 + 600 * j, 46);
            }
        }
    }

    drawLetterTimesTwoTiles() {
        this.gridContext.fillStyle = 'black';
        this.gridContext.font = '13px system-ui';
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 3; j++) {
                this.gridContext.fillText('LETTRE x2', 152 + 400 * i, 31 + 350 * j, 46);
            }
        }
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 2; j++) {
                this.gridContext.fillText('LETTRE x2', 2 + 350 * i, 181 + 400 * j, 46);
            }
        }
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                this.gridContext.fillText('LETTRE x2', 302 + 100 * i, 331 + 100 * j, 46);
            }
        }
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                this.gridContext.fillText('LETTRE x2', 302 + 100 * i, 131 + 500 * j, 46);
            }
        }
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                this.gridContext.fillText('LETTRE x2', 102 + 500 * i, 331 + 100 * j, 46);
            }
        }
    }

    drawStar(innerRadius: number, outerRadius: number, n: number) {
        this.gridContext.fillStyle = 'black';
        this.gridContext.beginPath();
        this.gridContext.translate(DEFAULT_HEIGHT / 2, DEFAULT_WIDTH / 2);
        this.gridContext.moveTo(0, 5 - outerRadius);
        for (let i = 0; i < n; i++) {
            this.gridContext.rotate(Math.PI / n);
            this.gridContext.lineTo(0, 5 - innerRadius * outerRadius);
            this.gridContext.rotate(Math.PI / n);
            this.gridContext.lineTo(0, 5 - outerRadius);
        }
        this.gridContext.closePath();
        this.gridContext.fill();
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }
}
