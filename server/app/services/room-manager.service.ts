import { Game } from '@app/classes/game/game';
import { Tile } from '@common/tile/Tile';
import { Room } from '@common/types';
import * as io from 'socket.io';
import { GameManager } from './game-manager.service';
import { IdManager } from './id-manager.service';
export class RoomManager {
    createRoom(username: string, room: string, socketId: string, identification: IdManager) {
        const user = {
            username,
            id: socketId,
            room,
        };
        identification.users.push(user);
        identification.roomMessages[room] = [];
        const game = new Game();
        const roomObj = {
            player1: username,
            player2: '',
            game,
        };
        identification.rooms.push(roomObj);
    }

    joinRoom(username: string, roomObj: Room, socketId: string, identification: IdManager, sio: io.Server, gameManager: GameManager): Tile[][] {
        let tiles: Tile[][] = [];
        identification.rooms.forEach((element: Room) => {
            if (roomObj.player1 === element.player1) {
                const room = roomObj.player1;
                if (element.player2.length === 0) {
                    const user = {
                        username,
                        id: socketId,
                        room,
                    };
                    identification.users.push(user);
                    element.player2 = username;

                    tiles = [element.game.player1.getLetters(), element.game.player2.getLetters()];
                    // element.game.timer.start(socketId, identification, sio, gameManager);
                }
            }
        });

        return tiles;
    }
    cancelCreation(socketId: string, identification: IdManager) {
        const username = identification.getUsername(socketId);
        identification.rooms.forEach((element) => {
            if (username === element.player1) {
                element.player2 = '-2';
                this.deleteRoom(socketId, identification);
            }
        });
    }
    deleteRoom(socketId: string, identification: IdManager) {
        const username = identification.getUsername(socketId);

        identification.rooms.forEach((element) => {
            if (username === element.player1) {
                if (element.player2 === '') {
                    const index = identification.rooms.indexOf(element);
                    identification.rooms.splice(index, 1);
                } else if (element.player2 === '-2') {
                    const index = identification.rooms.indexOf(element);
                    identification.rooms.splice(index, 1);
                } else {
                    element.player1 = '-2';
                }
            } else if (username === element.player2) {
                if (element.player1 === '-2') {
                    const index = identification.rooms.indexOf(element);
                    identification.rooms.splice(index, 1);
                } else {
                    element.player2 = '-2';
                }
            }
        });
    }
}
