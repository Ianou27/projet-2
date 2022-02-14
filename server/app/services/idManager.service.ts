
export class IdManager {
    users: any[] = [];

    roomMessages: any = {};

    rooms: any[] = [];
    getId(username: any): any {
        let id = '';
        this.users.forEach((element) => {
            if (element.username === username) {
                id = element.id;
            }
        });
        return id;
    }

    getUsername(socketId: any): any {
        let username = '';
        this.users.forEach((element) => {
            if (element.id === socketId) {
                username = element.username;
            }
        });
        return username;
    }

    getPlayer(socketId: any): string {
        let player = '';
        let username = this.getUsername(socketId);
        this.rooms.forEach((room) => {
            if (username === room.player1) {
                player = 'player1';
            } else if (username === room.player2) {
                player = 'player2';
            }
        });
        return player;
    }

    getRoom(id: any): any {
        let room = '';
        this.users.forEach((element) => {
            if (element.id === id) {
                console.log(element.room);
                room = element.room;
            }
        });
        return room;
    }

  


    deleteUser(socketId: any) {
        this.users.forEach((element) => {
            if (element.id === socketId) {
                let index = this.users.indexOf(element);
                this.users.splice(index, 1);
            }
        });
    }
}
