import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';

// TODO : Avoir un fichier séparé pour les constantes et ne pas les répéter!
export const DEFAULT_WIDTH = 750;
export const DEFAULT_HEIGHT = 750;
export const NUMBER_OF_CASES = 15;

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

    drawWordTimesThreeTiles() {
        this.gridContext.fillStyle = '#F51919FA';
        this.gridContext.fillRect(0, 0, 49, 49);
        this.gridContext.fillRect(351, 0, 48, 49);
        this.gridContext.fillRect(701, 0, 49, 49);
        this.gridContext.fillRect(0, 351, 49, 48);
        this.gridContext.fillRect(701, 351, 49, 48);
        this.gridContext.fillRect(0, 701, 49, 49);
        this.gridContext.fillRect(351, 701, 48, 49);
        this.gridContext.fillRect(701, 701, 49, 49);

        this.gridContext.fillStyle = 'black';
        this.gridContext.font = '14px system-ui';

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                this.gridContext.fillText('MOT x3', 1 + 351 * i, 30 + 351 * j, 46);
            }
        }
    }

    drawWordTimesTwoTiles() {
        this.gridContext.fillStyle = '#B33754F0';
        this.gridContext.fillRect(51, 51, 48, 48);
        this.gridContext.fillRect(101, 101, 48, 48);
        this.gridContext.fillRect(151, 151, 48, 48);
        this.gridContext.fillRect(201, 201, 48, 48);
        this.gridContext.fillRect(651, 651, 48, 48);
        this.gridContext.fillRect(601, 601, 48, 48);
        this.gridContext.fillRect(551, 551, 48, 48);
        this.gridContext.fillRect(501, 501, 48, 48);
        this.gridContext.fillRect(351, 351, 48, 48);
        this.gridContext.fillRect(651, 51, 48, 48);
        this.gridContext.fillRect(601, 101, 48, 48);
        this.gridContext.fillRect(551, 151, 48, 48);
        this.gridContext.fillRect(501, 201, 48, 48);
        this.gridContext.fillRect(51, 651, 48, 48);
        this.gridContext.fillRect(101, 601, 48, 48);
        this.gridContext.fillRect(151, 551, 48, 48);
        this.gridContext.fillRect(201, 501, 48, 48);

        this.gridContext.fillStyle = 'black';
        this.gridContext.font = '14px system-ui';

        for (let i = 0; i < 13; i++) {
            for (let j = 0; j < 13; j++) {
                if (i === 4) {
                    i = 9;
                    j = 9;
                }
                if (i === j) {
                    this.gridContext.fillText('MOT x2', 51 + 50 * i, 81 + 50 * j, 47);
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
        this.gridContext.fillStyle = '#0320FC96';
        this.gridContext.fillRect(251, 51, 48, 48);
        this.gridContext.fillRect(451, 51, 48, 48);
        this.gridContext.fillRect(51, 251, 48, 48);
        this.gridContext.fillRect(251, 251, 48, 48);
        this.gridContext.fillRect(451, 251, 48, 48);
        this.gridContext.fillRect(651, 251, 48, 48);
        this.gridContext.fillRect(51, 451, 48, 48);
        this.gridContext.fillRect(251, 451, 48, 48);
        this.gridContext.fillRect(451, 451, 48, 48);
        this.gridContext.fillRect(651, 451, 48, 48);
        this.gridContext.fillRect(251, 651, 48, 48);
        this.gridContext.fillRect(451, 651, 48, 48);

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
        this.gridContext.fillStyle = '#4A97EE5F';
        this.gridContext.fillRect(151, 0, 48, 49);
        this.gridContext.fillRect(551, 0, 48, 49);
        this.gridContext.fillRect(301, 101, 48, 48);
        this.gridContext.fillRect(351, 151, 48, 48);
        this.gridContext.fillRect(401, 101, 48, 48);

        this.gridContext.fillRect(0, 151, 49, 48);
        this.gridContext.fillRect(0, 551, 49, 48);
        this.gridContext.fillRect(101, 301, 48, 48);
        this.gridContext.fillRect(151, 351, 48, 48);
        this.gridContext.fillRect(101, 401, 48, 48);

        this.gridContext.fillRect(151, 701, 48, 49);
        this.gridContext.fillRect(551, 701, 48, 49);
        this.gridContext.fillRect(301, 601, 48, 48);
        this.gridContext.fillRect(351, 551, 48, 48);
        this.gridContext.fillRect(401, 601, 48, 48);

        this.gridContext.fillRect(701, 151, 49, 48);
        this.gridContext.fillRect(701, 551, 49, 48);
        this.gridContext.fillRect(601, 301, 48, 48);
        this.gridContext.fillRect(551, 351, 48, 48);
        this.gridContext.fillRect(601, 401, 48, 48);

        this.gridContext.fillRect(301, 301, 49, 48);
        this.gridContext.fillRect(301, 401, 49, 48);
        this.gridContext.fillRect(401, 301, 48, 48);
        this.gridContext.fillRect(401, 401, 48, 48);

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
