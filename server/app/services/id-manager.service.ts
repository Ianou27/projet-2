import { Room, User } from './../../../common/types';
import { Game } from './../classes/game/game';

export class IdManager {
    users: User[] = [];

    roomMessages = new Map<string, Room[]>();
    rooms: Room[] = [];
    games: Game[] = [];
    getId(username: string): string {
        let id = '';
        this.games.forEach((game) => {
            if (game.player1.user.username === username) {
                id = game.player1.user.id;
            } else if (game.player2.user.username === username) {
                id = game.player2.user.id;
            }
        });
        return id;
    }

    getUsername(socketId: string): string {
        let username = '';
        this.users.forEach((user) => {
            if (user.id === socketId) {
                username = user.username;
            }
        });
        return username;
    }

    surrender(socketId: string): string {
        let winner = '';
        const username = this.getUsername(socketId);
        this.rooms.forEach((room: Room) => {
            if (username === room.player1) {
                winner = room.player2;
            } else if (username === room.player2) {
                winner = room.player1;
            }
        });
        return winner;
    }
    getPlayer(socketId: string): string {
        let player = '';
        const username = this.getUsername(socketId);
        this.games.forEach((game) => {
            if (username === game.player1.user.username) {
                player = 'player1';
            } else if (username === game.player2.user.username) {
                player = 'player2';
            }
        });
        return player;
    }
    getRoom(socketId: string): string {
        let room = '';
        this.users.forEach((user) => {
            if (user.id === socketId) {
                room = user.room;
            }
        });
        return room;
    }
    getGame(socketId: string): Game {
        let gameToFind: Game = new Game ;

        for (const game of this.games) {
            if (game.player1.user.id === socketId) {
                gameToFind = game;
            } else if (game.player2 !== undefined) {
                if (game.player2.user.id === socketId) {
                    gameToFind = game;
                }
            }
        }
    

        return gameToFind;
    }
    deleteGame(socketId:string){

        for (const game of this.games) {
            if (game.player1.user.id === socketId) {
                const index = this.games.indexOf(game);
                this.games.splice(index, 1);
            } else if (game.player2 !== undefined) {
                if (game.player2.user.id === socketId) {
                    const index = this.games.indexOf(game);
                    this.games.splice(index, 1);
                }
            }
        }
    }
    deleteUser(socketId: string) {
        this.users.forEach((element: User) => {
            if (element.id === socketId) {
                const index = this.users.indexOf(element);
                this.users.splice(index, 1);
            }
        });
    }
}
