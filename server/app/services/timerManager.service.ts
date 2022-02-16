import { Game } from '@app/classes/game/game';
import { Room } from '@common/types';
import * as io from 'socket.io';
import { GameManager } from './gameManager.service';
import { IdManager } from './idManager.service';
export class Timer {
    timeLeft: number = 60;
    start(socketId: string, identification: IdManager, sio: io.Server, gameManager: GameManager) {
        const username = identification.getUsername(socketId);
        const currentRoom = identification.getRoom(socketId);
        let game: Game = new Game();
        identification.rooms.forEach((room: Room) => {
            if (room.player1 === username || room.player2 === username) {
                game = room.game;
            }
        });
        setInterval(() => {
            if (this.timeLeft === -1) return;
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
                this.timeLeft = 60;
            }
        }, 1000);
    }

    reset() {
        this.timeLeft = 60;
    }

    stop() {
        this.timeLeft = -1;
    }
}
