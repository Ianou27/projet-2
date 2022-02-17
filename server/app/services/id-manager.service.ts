import { Room, User } from './../../../common/types';

export class IdManager {
    users: User[] = [];

    roomMessages = new Map<string, Room[]>();
    rooms: Room[] = [];
    getId(username: string): string {
        let id = '';
        this.users.forEach((element) => {
            if (element.username === username) {
                id = element.id;
            }
        });
        return id;
    }

    getUsername(socketId: string): string {
        let username = '';
        this.users.forEach((element) => {
            if (element.id === socketId) {
                username = element.username;
            }
        });
        return username;
    }
    getWinner(username: string, playerWinner: string): string {
        let winner = '';
        this.rooms.forEach((room: Room) => {
            if (playerWinner !== 'tie') {
                if (username === room.player1 || username === room.player2) {
                    if ('player1' === playerWinner) {
                        winner = room.player1;
                    } else if ('player2' === playerWinner) {
                        winner = room.player2;
                    }
                }
            } else {
                winner = 'tie';
            }
        });
        return winner;
    }

    surrender(socketId: string): string {
        let winner = '';
        const username = this.getUsername(socketId);
        this.rooms.forEach((room: Room) => {
            if (username === room.player1) {
                winner = room.player2;
                // room.game.timer.stop();
            } else if (username === room.player2) {
                winner = room.player1;
                // room.game.timer.stop();
            }
        });
        return winner;
    }
    getPlayer(socketId: string): string {
        let player = '';
        const username = this.getUsername(socketId);
        this.rooms.forEach((room: Room) => {
            if (username === room.player1) {
                player = 'player1';
            } else if (username === room.player2) {
                player = 'player2';
            }
        });
        return player;
    }
    getRoom(id: string): string {
        let room = '';
        this.users.forEach((element: User) => {
            if (element.id === id) {
                room = element.room;
            }
        });
        return room;
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
