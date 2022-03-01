import { Game } from '@app/classes/game/game';
import { Room } from './../../../common/types';

export class IdManager {
    // users: User[] = [];

    roomMessages = new Map<string, Room[]>();
    rooms: Room[] = [];
    games: Game[]=[];
    getId(username: string): string {
        let id = '';
        this.games.forEach((game) => {
            if (game.player1.user.username === username) {
                id = game.player1.user.id;
            }
            else if (game.player2.user.username === username) {
                id = game.player2.user.id;
            }
        });
        return id;
    }

    getUsername(socketId: string): string {
        let username = '';
        this.games.forEach((game) => {
            if (game.player1.user.id === socketId) {
                username = game.player1.user.username;
            }
            else if (game.player2.user.id === socketId) {
                username = game.player2.user.username;
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
        this.games.forEach((game) => {
            if (game.player1.user.id === socketId) {
                room = game.player1.user.room;
            }
            else if (game.player2.user.id === socketId) {
                room = game.player2.user.room;
            }
        });
        return room;
    }
    getGame(socketId: string):Game {
        let game:Game = new Game();
        for(let i=0; i< this.games.length;i++){
            if (this.games[i].player1.user.id === socketId) {
                game= this.games[i];
            }
            else if (this.games[i].player2.user.id === socketId) {
                game= this.games[i];
            }
        }
           
        return game;
    }

    // deleteUser(socketId: string) {
    //     this.users.forEach((element: User) => {
    //         if (element.id === socketId) {
    //             const index = this.users.indexOf(element);
    //             this.users.splice(index, 1);
    //         }
    //     });
    // }
}
