import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { CASE_SIZE, DEFAULT_HEIGHT, DEFAULT_WIDTH, NUMBER_OF_CASES } from '@app/constants/board';
import { LETTER_2X, LETTER_3X, NORMAL, WORD_2X, WORD_3X } from '@app/constants/tile-information';

@Injectable({
    providedIn: 'root',
})
export class GridService {
    gridContext: CanvasRenderingContext2D;
    private canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };

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

    drawTiles() {
        this.drawTilesColor('#8080805A', NORMAL);
        this.drawTilesColor('#F51919CA', WORD_3X);
        this.drawTilesColor('#B33754C0', WORD_2X);
        this.drawTilesColor('#0320FC96', LETTER_3X);
        this.drawTilesColor('#4A97EE5F', LETTER_2X);
        this.writeBonusTypes('MOT', 'X3', WORD_3X);
        this.writeBonusTypes('MOT', 'X2', WORD_2X);
        this.writeBonusTypes('LETTRE', 'X3', LETTER_3X);
        this.writeBonusTypes('LETTRE', 'X2', LETTER_2X);
    }

    drawStar(innerRadius: number, outerRadius: number) {
        const starPoints = 5;
        const offset = 5;
        this.gridContext.fillStyle = 'black';
        this.gridContext.beginPath();
        this.gridContext.translate(DEFAULT_HEIGHT / 2, DEFAULT_WIDTH / 2);
        this.gridContext.moveTo(0, offset - outerRadius);
        for (let i = 0; i < starPoints; i++) {
            this.gridContext.rotate(Math.PI / starPoints);
            this.gridContext.lineTo(0, offset - innerRadius * outerRadius);
            this.gridContext.rotate(Math.PI / starPoints);
            this.gridContext.lineTo(0, offset - outerRadius);
        }
        this.gridContext.closePath();
        this.gridContext.fill();
    }

    drawTilesColor(color: string, bonusType: Vec2[]) {
        const reg = /^#([0-9a-f]{6,8})$/i;
        this.gridContext.fillStyle = color;
        if (reg.test(color)) {
            for (const tiles of bonusType) {
                this.gridContext.fillRect(tiles.x * CASE_SIZE, tiles.y * CASE_SIZE, CASE_SIZE, CASE_SIZE);
            }
        }
    }

    writeBonusTypes(firstWord: string, secondWord: string, bonusType: Vec2[], xOffset: number = 2, yOffset: number = 2) {
        const wordHeightOffset = CASE_SIZE / 2;
        const secondWordOffset = 8;
        const letterWidthOffset = 4;
        const middleTile = 7;
        this.gridContext.fillStyle = 'black';
        this.gridContext.font = '14px Arial';
        if (firstWord && secondWord) {
            for (const tiles of bonusType) {
                if (!(tiles.x === middleTile && tiles.y === middleTile)) {
                    this.gridContext.fillText(
                        firstWord,
                        tiles.x * CASE_SIZE + xOffset,
                        tiles.y * CASE_SIZE + wordHeightOffset,
                        CASE_SIZE - letterWidthOffset,
                    );
                    this.gridContext.fillText(
                        secondWord,
                        tiles.x * CASE_SIZE + secondWordOffset,
                        tiles.y * CASE_SIZE + wordHeightOffset * 2 - yOffset,
                        CASE_SIZE - letterWidthOffset,
                    );
                }
            }
        }
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }
}
