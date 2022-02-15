import {Room} from '@common/types'
import {User} from '@common/types'

export class IdManager {
    users: User[] = [];

    public roomMessages = new Map<string, Room[]>();
    public rooms: Room[] = [];
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

    getPlayer(socketId: string): string {
        let player = '';
        let username = this.getUsername(socketId);
        this.rooms.forEach((room:Room) => {
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
        this.users.forEach((element:User) => {
            if (element.id === id) {
                
                room = element.room;
            }
        });
        return room;
    }

  


    deleteUser(socketId: string) {
        this.users.forEach((element:User) => {
            if (element.id === socketId) {
                let index = this.users.indexOf(element);
                this.users.splice(index, 1);
            }
        });
    }
}
