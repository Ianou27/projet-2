import { Tile } from '@common/tile/Tile';
import { Room } from '@common/types';
import * as io from 'socket.io';
import { Game } from './../classes/game/game';
import { IdManager } from './id-manager.service';
export class RoomManager {
    createRoom(username: string, room: string, socketId: string, identification: IdManager, timer: string) {
        const user = {
            username,
            id: socketId,
            room,
        };
        identification.users.push(user);
        identification.roomMessages[room] = [];
        const game = new Game();
        game.player1Join(user, timer);
        identification.games.push(game);
        const roomObj = {
            player1: username,
            player2: '',
            time: timer,
        };
        identification.rooms.push(roomObj);
        console.log(identification.users);
    }
    createSoloGame(username: string, socketId: string, identification: IdManager, sio: io.Server, timer: string) {
        const user = {
            username,
            id: socketId,
            room: username,
        };
        const roomObj = {
            player1: username,
            player2: 'bot',
            time: timer,
        };
        identification.rooms.push(roomObj);
        identification.users.push(user);
        identification.roomMessages[username] = [];
        const game = new Game();

        game.startSoloGame(user, sio, timer);
        identification.games.push(game);
    }

    joinRoom(username: string, roomObj: Room, socketId: string, identification: IdManager, sio: io.Server): Tile[][] {
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
                    const game: Game = identification.getGame(identification.getId(roomObj.player1));
                    game.player2Join(user, sio);

                    tiles = [game.player1.getLetters(), game.player2.getLetters()];
                }
            }
        });
        console.log(identification.users);

        return tiles;
    }
    cancelCreation(socketId: string, identification: IdManager) {
        const username = identification.getUsername(socketId);
        identification.rooms.forEach((element) => {
            if (username === element.player1) {
                element.player2 = '-2';

                this.deleteRoom(socketId, identification);
                identification.deleteUser(socketId);
                console.log(identification.users);
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
