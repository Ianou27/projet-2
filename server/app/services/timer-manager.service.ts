import * as io from 'socket.io';
import { NO_TIME_LEFT, ONE_SECOND_MS } from './../../../common/constants/general-constants';
import { Game } from './../classes/game/game';

export class Timer {
    timeLeft: number;
    timerMax: number;
    constructor(maxTime: string) {
        this.timerMax = +maxTime;
        this.timeLeft = +maxTime;
    }
    start(game: Game, sio: io.Server) {
        setInterval(() => {
            if (this.timeLeft === NO_TIME_LEFT) return;
            else if (this.timeLeft > 0) {
                this.timeLeft--;
                sio.to(game.player1.user.room).emit('timer', this.timeLeft);
            } else {
                sio.to(game.player1.user.room).emit('roomMessage', {
                    username: 'Server',
                    message: ' Tour  passé , trop de temps pour jouer son tour ',
                    player: 'server',
                });
                game.passTurn();
                sio.to(game.player1.user.room).emit('modification', game.gameBoard.cases, game.playerTurn().name);
                sio.to(game.player1.user.id).emit('tileHolder', game.player1.letters);
                sio.to(game.player2.user.id).emit('tileHolder', game.player2.letters);
                if (!game.gameState.gameFinished) this.timeLeft = this.timerMax;
            }
        }, ONE_SECOND_MS);
    }

    reset() {
        if (this.timeLeft !== NO_TIME_LEFT) {
            this.timeLeft = this.timerMax;
        }
    }

    stop() {
        this.timeLeft = NO_TIME_LEFT;
    }
}
