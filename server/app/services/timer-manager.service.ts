import { NO_TIME_LEFT, ONE_SECOND_MS, SECONDS_IN_MINUTE } from './../../../common/constants/general-constants';
import { Room } from './../../../common/types';
import { Game } from './../classes/game/game';
import { GameManager } from './game-manager.service';
import { IdManager } from './id-manager.service';
export class Timer {
    timeLeft: number = SECONDS_IN_MINUTE;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    start(socketId: string, identification: IdManager, sio: any, gameManager: GameManager) {
        const username = identification.getUsername(socketId);
        const currentRoom = identification.getRoom(socketId);
        let game: Game = new Game();
        identification.rooms.forEach((room: Room) => {
            if (room.player1 === username || room.player2 === username) {
                game = room.game;
            }
        });
        setInterval(() => {
            if (this.timeLeft === NO_TIME_LEFT) return;
            else if (this.timeLeft > 0) {
                this.timeLeft--;
                sio.to(currentRoom).emit('timer', this.timeLeft);
            } else {
                gameManager.pass(game);
                sio.to(currentRoom).emit('roomMessage', {
                    username: 'Server',
                    message: ' Tour  passé , trop de temps pour jouer son tour ',
                    player: 'server',
                });
                sio.to(currentRoom).emit('modification', game.gameBoard.cases, game.playerTurn().name);
                this.timeLeft = SECONDS_IN_MINUTE;
            }
        }, ONE_SECOND_MS);
    }

    reset() {
        this.timeLeft = SECONDS_IN_MINUTE;
    }

    stop() {
        this.timeLeft = NO_TIME_LEFT;
    }
}
