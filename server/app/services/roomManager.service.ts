import { Game } from '@app/classes/game/game';
import { Tile } from '@common/tile/Tile';
import { IdManager } from './idManager.service';

export class RoomManager {
   
    createRoom(username: string, room: string, socketId:string, identification :IdManager){
        const user = {
            username,
            id: socketId,
            room,
        };
        identification.users.push(user);
        identification.roomMessages[room] = [];
        let game = new Game();
        const roomObj = {
            player1: username,
            player2: '',
            game: game,
        };
        identification.rooms.push(roomObj);
        
    }

    joinRoom(username: string, roomObj: any, socketId:string, identification :IdManager):Tile[]{

        let tiles: Tile[] =[];
        identification.rooms.forEach((element: any) => {
            if (roomObj.player1 === element.player1) {
                let room = roomObj.player1;
                if (element.player2.length === 0) {
                    const user = {
                        username,
                        id: socketId,
                        room,
                    };
                    identification.users.push(user);
                    element.player2 = username;

                    
                    tiles = [element.game.player1.getLetters(),element.game.player2.getLetters()];
                }
            }
           
        });

        return tiles;
    }

    deleteRoom(socketId: any, identification :IdManager) {
        let username = identification.getUsername(socketId);
        console.log(identification.rooms);
        identification.rooms.forEach((element) => {
            if (username === element.player1 || username === element.player2) {
                let index = identification.rooms.indexOf(element);
                identification.rooms.splice(index, 1);

                
            }
        });
    }
    
}
