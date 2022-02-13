import { ExchangeCommand } from '@app/classes/exchangeCommand/exchange-command';
import { Game } from '@app/classes/game/game';
import { PlacementCommand } from '@app/classes/placementCommand/placement-command';
import * as http from 'http';
import * as io from 'socket.io';

export class SocketManager {
    private sio: io.Server;
    users: any[] = [];

    roomMessages: any = {};

    rooms: any[] = [];
    
    // commandsList et exclamationIndex à mettre dans un fichier de constantes
    private commandsList: string[] = ['!placer', '!echanger', '!passer', '!indice'];

    constructor(server: http.Server) {
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
    }

    handleSockets(): void {
        this.sio.on('connection', (socket) => {
            console.log(`Connexion par l'utilisateur avec id : ${socket.id}`);
            // message initial

            socket.on('validate', (message: string) => {
                if (message === undefined || message === null) return;
                if (message.charAt(0) === '!') {
                    const command = this.commandVerification(message);
                    socket.emit('commandValidated', command);
                    /* if (isValid) {
                        this.handleCommand(message.split(' '));
                        socket.emit('modification', this.gameManager.gameList.gameBoard.cases);
                    }*/
                } else {
                    const isValid = this.lengthVerification(message) && this.characterVerification(message);
                    socket.emit('wordValidated', isValid);
                }
            });

            socket.on('placeFormatVerification', (command: string) => {
                
                const commandFormatValid = this.placeFormatValid(command.split(' '));
                this.sio.to(socket.id).emit('placeFormatValidated', commandFormatValid);
            });

            socket.on('boardVerification', (command: string) => {
                // const isValid = this.placeBoardValid(command.split(' '));
                // this.sio.to(socket.id).emit('placeBoardValidated', isValid);
            });

            socket.on('placeWord', (command: string) => {
                // this.placeWord(command.split(' '));
                // socket.emit('modification', this.gameManager.gameList.gameBoard.cases);
                // socket.emit('tileHolder', this.gameManager.gameList.player1.getLetters());
            });

            socket.on('broadcastAll', (message: string) => {
                this.sio.sockets.emit('massMessage', `${socket.id} : ${message}`);
            });

            socket.on('createRoom', (username: string, room: string) => {
                const user = {
                    username,
                    id: socket.id,
                    room,
                    
                };
                this.users.push(user);
                this.roomMessages[room] = [];
                let j =new Game();
                const roomObj = {
                    player1: username,
                    player2: '',
                    game: j
                };
                this.rooms.push(roomObj);
                console.log('----------');
                this.users.forEach((element) => console.log(element));

                socket.join(room);
            });

            socket.on('joinRoom', (username: string, roomObj: any) => {
                let player1Id =this.getId(roomObj.player1)

                this.rooms.forEach((element: any) => {
                    if (roomObj.player1 === element.player1) {
                        let room = roomObj.player1;
                        if (element.player2.length === 0) {
                            const user = {
                                username,
                                id: socket.id,
                                room,
                            };
                            this.users.push(user);
                            element.player2 = username;

                            socket.join(room);
                              
                                    this.sio.to(player1Id).emit('tileHolder', element.game.player1.getLetters());
                      
                                    this.sio.to(socket.id).emit('tileHolder', element.game.player2.getLetters());
                       
                            
                        }
                    }
                });



            });

            socket.on('askJoin', (username: string, roomObj: any) => {
                this.sio.to(roomObj.player1).emit('asked', username, socket.id, roomObj);
                this.rooms.forEach((room) => {
                    if (room.player1 === roomObj.player1) {
                        room.player2 = '-1';
                    }
                });

                this.sio.sockets.emit('rooms', this.rooms);
            });

            socket.on('accepted', (socketid: any, infoObj: any) => {
                this.sio.to(socketid).emit('joining', infoObj);
                let username = '';
                this.users.forEach((user) => {
                    console.log(socket.id, user.id);
                    if (socket.id === user.id) {
                        username = user.username;
                    }
                });

                this.rooms.forEach((room) => {
                    if (room.player1 === username) {
                        room.player2 = '';
                    }
                });
            });

            socket.on('refused', (socketid: any, infoObj: any) => {
                this.sio.to(socketid).emit('refusing', infoObj);

                //dup code
                let username = '';
                this.users.forEach((user) => {
                    console.log(socket.id, user.id);
                    if (socket.id === user.id) {
                        username = user.username;
                    }
                });

                this.rooms.forEach((room) => {
                    if (room.player1 === username) {
                        room.player2 = '';
                    }
                });
                this.sio.sockets.emit('rooms', this.rooms);
            });

            socket.on('roomMessage', (message: string) => {
                let username = '';
                let currentRoom: any ;
                let a:any;
                let validCommand:boolean =true;
                let player;
                this.users.forEach((element) => {
                    if (element.id === socket.id) {
                        username = element.username;
                        currentRoom = element.room;

                    }
                });

                   

                this.rooms.forEach((room: any) => {
                if (room.player1 === username)  {
                    
                    a=room.game;
                    player="player1";
                    
                }
                else if(room.player2 === username)
                {
                    a=room.game;
                    player="player2";
                    
                    

                }
                   

                });




                if (message === undefined || message === null) return;
                if (message.charAt(0) === '!') {
                    const command = message.split(' ');
                    if(!this.commandVerification(command[0])){
                        validCommand =false;
                        console.log("commandVerification");
                        this.sio.to(socket.id).emit('commandValidated');
                        
                    }
                    else if(command[0] === '!placer')
                    {
                     
                        
                        if(!this.placeFormatValid(command)){
                            validCommand =false;
                            this.sio.to(socket.id).emit('placeFormatValidated');
                        }
                        else if(!this.placeBoardValid(command,a)){
                            validCommand =false;
                            this.sio.to(socket.id).emit('placeBoardValidated');
                        }
                        
                        if(validCommand){
                            this.placeWord(command,a);
                            this.sio.to(currentRoom).emit('modification', a.gameBoard.cases);
                            this.sio.to(socket.id).emit('tileHolder', a.player1.getLetters());
                                       
                        }
                    }


                    else if(command[0] === '!echanger'){
                        if(!this.exchangeFormatValid(command)){
                            validCommand =false;
                            this.sio.to(socket.id).emit('placeFormatValidated');
                        }
                        else if(!this.exchangeTileHolderValid(command,a)){
                            validCommand =false;
                            this.sio.to(socket.id).emit('placeBoardValidated');
                        }
                        
                        if(validCommand){
                            this.exchange(command,a);
                            this.sio.to(currentRoom).emit('modification', a.gameBoard.cases);
                            this.sio.to(socket.id).emit('tileHolder', a.player1.getLetters());
                                       
                        }

                    }
                    
                    

                   
                } else{


                
               

                const roomSockets = this.sio.sockets.adapter.rooms.get(currentRoom);
                // Seulement un membre de la salle peut envoyer un message aux autres
                if (roomSockets?.has(socket.id)) {
                    this.roomMessages[currentRoom].push({ username, message });

                    this.sio.to(currentRoom).emit('roomMessage', { username, message,player });
                    
                }
            }
            });
            socket.on('updateRoom', (a) => {
                this.sio.sockets.emit('rooms', this.rooms);
            });

            socket.on('deleteRoom', (a) => {
                let room= this.getRoom(socket.id);
               
                socket.leave(room)
             
            });
            socket.on('disconnect', (reason) => {
                let room= this.getRoom(socket.id);
                if(room!==''){
                    socket.leave(room)
                    this.deleteRoom(socket.id);
                    this.sio.to(room).emit('playerDc');
                }
            
                this.deleteUser(socket.id);
                console.log(`Deconnexion par l'utilisateur avec id : ${socket.id}`);
                console.log(`Raison de deconnexion : ${reason}`);
                
                

            });
        });
    }

    getId(username: any): any {
        let id = '';
        this.users.forEach((element) => {
            if (element.username === username) {
                id =element.id;
            }
        });
        return id;
    }

    getUsername(socketId: any): any {
        let username = '';
        this.users.forEach((element) => {
            if (element.id === socketId) {
                username =element.username;
            }
        });
        return username;
    }

    getRoom(id: any): any {
        let room = '';
        this.users.forEach((element) => {
            if (element.id === id) {
                console.log(element.room);
                room =element.room;
            }
        });
        return room;
    }

    joined() {
        return true;
    }
    placeWord(command: string[], game:any) {
       
    
        PlacementCommand.placeWord(command, game);
    }

    exchange(command: string[],game:any) {
        ExchangeCommand.exchangeLetters(command, game);
    }

    placeBoardValid(command: string[], game:any): boolean {
        return PlacementCommand.validatedPlaceCommandBoard(command, game);
    }

    commandVerification(message: string): boolean {
    
        for (const command of this.commandsList) {
            if (command === message) {
                return true;
            }
        }
        return false;

    }

    placeFormatValid(command: string[]) {
        return PlacementCommand.validatedPlaceCommandFormat(command);
    }

    exchangeFormatValid(command: string[]) {
        return ExchangeCommand.validatedExchangeCommandFormat(command);
    }

    exchangeTileHolderValid(command: string[], game: any) {
        return ExchangeCommand.validatedExchangeCommandBoard(command, game);
    }


    lengthVerification(message: string) {
        return message.length > 512 ? false : true;
    }
    characterVerification(message: string): boolean {
        return message.trim().length === 0 ? false : true;
    }

    deleteUser(socketId: any) {
        this.users.forEach((element) => {
            if (element.id === socketId) {
                let index = this.users.indexOf(element);
                this.users.splice(index, 1);
            }
        });

        
    }

    deleteRoom(socketId: any){
        let username = this.getUsername(socketId);
        console.log(this.rooms);
        this.rooms.forEach((element) => {
            if (username === element.player1 || username === element.player2) {
                let index = this.rooms.indexOf(element);
                this.rooms.splice(index, 1);

                this.sio.sockets.emit('rooms', this.rooms);
            }
        });
    }
}
