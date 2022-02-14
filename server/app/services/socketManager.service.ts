import * as http from 'http';
import * as io from 'socket.io';
import { GameManager } from './gameManager.service';
import { IdManager } from './idManager.service';
import { RoomManager } from './roomManager.service';

export class SocketManager {
    private sio: io.Server;
    private gameManager: GameManager = new GameManager();
    private identification: IdManager = new IdManager();
    private roomManager: RoomManager = new RoomManager();

    // commandsList et exclamationIndex à mettre dans un fichier de constantes
    // private commandsList: string[] = ['!placer', '!echanger', '!passer', '!indice'];

    constructor(server: http.Server) {
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
    }

    handleSockets(): void {
        this.sio.on('connection', (socket) => {
            console.log(`Connexion par l'utilisateur avec id : ${socket.id}`);
            // message initial

            socket.on('createRoom', (username: string, room: string) => {
                this.roomManager.createRoom(username, room, socket.id, this.identification);
                // const user = {
                //     username,
                //     id: socket.id,
                //     room,
                // };
                // this.identification.users.push(user);
                // this.identification.roomMessages[room] = [];
                // let game = new Game();
                // const roomObj = {
                //     player1: username,
                //     player2: '',
                //     game: game,
                // };
                // this.identification.rooms.push(roomObj);
                // console.log('----------');
                // this.identification.users.forEach((element) => console.log(element));

                socket.join(room);
            });

            socket.on('joinRoom', (username: string, roomObj: any) => {
                let player1Id = this.identification.getId(roomObj.player1);

                // this.identification.rooms.forEach((element: any) => {
                //     if (roomObj.player1 === element.player1) {
                //         let room = roomObj.player1;
                //         if (element.player2.length === 0) {
                //             const user = {
                //                 username,
                //                 id: socket.id,
                //                 room,
                //             };
                //             this.identification.users.push(user);
                //             element.player2 = username;
                const letters = this.roomManager.joinRoom(username, roomObj, socket.id, this.identification);
                socket.join(roomObj.player1);

                this.sio.to(player1Id).emit('tileHolder', letters[0]);

                this.sio.to(socket.id).emit('tileHolder', letters[1]);
                //         }
                //     }
                // });
            });

            socket.on('askJoin', (username: string, roomObj: any) => {
                this.sio.to(roomObj.player1).emit('asked', username, socket.id, roomObj);
                this.identification.rooms.forEach((room) => {
                    if (room.player1 === roomObj.player1) {
                        room.player2 = '-1';
                    }
                });
               
                this.sio.sockets.emit('rooms', this.identification.rooms);
            });

            socket.on('accepted', (socketid: any, infoObj: any) => {
                this.sio.to(socketid).emit('joining', infoObj);
                let username = this.identification.getUsername(socket.id);
                // this.identification.users.forEach((user) => {

                //     if (socket.id === user.id) {
                //         username = user.username;
                //     }
                // });

                this.identification.rooms.forEach((room) => {
                    if (room.player1 === username) {
                        room.player2 = '';
                    }
                });
              
            });

            socket.on('refused', (socketid: any, infoObj: any) => {
                this.sio.to(socketid).emit('refusing', infoObj);

                //dup code
                let username = this.identification.getUsername(socket.id);
                // this.identification.users.forEach((user) => {

                //     if (socket.id === user.id) {
                //         username = user.username;
                //     }
                // });

                this.identification.rooms.forEach((room) => {
                    if (room.player1 === username) {
                        room.player2 = '';
                    }
                });
               
                this.sio.sockets.emit('rooms', this.identification.rooms);
            });

            socket.on('roomMessage', (message: string) => {
              
                let username = this.identification.getUsername(socket.id);;
                let currentRoom= this.identification.getRoom(socket.id);
                let game: any;
                let validCommand: boolean = true;
                let player;
                // this.identification.users.forEach((element) => {
                //     if (element.id === socket.id) {
                //         username = element.username;
                //         currentRoom = element.room;
                //     }
                // });

                this.identification.rooms.forEach((room: any) => {
                    if (room.player1 === username) {
                        game = room.game;
                        player = 'player1';
                    } else if (room.player2 === username) {
                        game = room.game;
                        player = 'player2';
                    }
                });

                if (message === undefined || message === null) return;
                if (message.charAt(0) === '!') {
                    const command = message.split(' ');

                    if (!game.playerTurnValid(this.identification.getPlayer(socket.id))) {
                        validCommand = false;
                        this.sio.to(socket.id).emit('commandValidated');
                    } else if (!this.gameManager.commandVerification(command[0])) {
                        validCommand = false;
                        console.log('commandVerification');
                        this.sio.to(socket.id).emit('commandValidated');
                    } else if (command[0] === '!placer') {
                        if (!this.gameManager.placeFormatValid(command)) {
                            validCommand = false;
                            this.sio.to(socket.id).emit('placeFormatValidated');
                        } else if (!this.gameManager.placeBoardValid(command, game)) {
                            validCommand = false;
                            this.sio.to(socket.id).emit('placeBoardValidated');
                        }

                        if (validCommand) {
                            this.gameManager.placeWord(command, game);
                            this.sio.to(currentRoom).emit('modification', game.gameBoard.cases);

                            if (player === 'player1') {
                                this.sio.to(socket.id).emit('tileHolder', game.player1.getLetters());
                                this.sio.to(currentRoom).emit('updatePoint', player, game.player1.points);
                            } else if (player === 'player2') {
                                this.sio.to(socket.id).emit('tileHolder', game.player2.getLetters());
                                this.sio.to(currentRoom).emit('updatePoint', player, game.player2.points);
                            }
                        }
                    } else if (command[0] === '!echanger') {
                        if (!this.gameManager.exchangeFormatValid(command)) {
                            validCommand = false;
                            this.sio.to(socket.id).emit('placeFormatValidated');
                        } else if (!this.gameManager.exchangeTileHolderValid(command, game)) {
                            validCommand = false;
                            this.sio.to(socket.id).emit('placeBoardValidated');
                        }

                        if (validCommand) {
                            this.gameManager.exchange(command, game);
                            this.sio.to(currentRoom).emit('modification', game.gameBoard.cases);
                            if (player === 'player1') {
                                this.sio.to(socket.id).emit('tileHolder', game.player1.getLetters());
                            } else if (player === 'player2') {
                                this.sio.to(socket.id).emit('tileHolder', game.player2.getLetters());
                            }
                        }
                    }
                } else {
                    const roomSockets = this.sio.sockets.adapter.rooms.get(currentRoom);
                    // Seulement un membre de la salle peut envoyer un message aux autres
                    if (roomSockets?.has(socket.id)) {
                        this.identification.roomMessages[currentRoom].push({ username, message });

                        this.sio.to(currentRoom).emit('roomMessage', { username, message, player });
                    }
                }
            });
            socket.on('updateRoom', (a) => {
                this.sio.sockets.emit('rooms', this.identification.rooms);
            });

            socket.on('deleteRoom', (a) => {
                let room = this.identification.getRoom(socket.id);

                socket.leave(room);
            });
            socket.on('disconnect', (reason) => {
                let room = this.identification.getRoom(socket.id);
                if (room !== '') {
                    socket.leave(room);
                    this.deleteRoom(socket.id);
                    this.sio.to(room).emit('playerDc');
                }

                this.identification.deleteUser(socket.id);
                console.log(`Deconnexion par l'utilisateur avec id : ${socket.id}`);
                console.log(`Raison de deconnexion : ${reason}`);
            });
        });
    }

    // getId(username: any): any {
    //     let id = '';
    //     this.users.forEach((element) => {
    //         if (element.username === username) {
    //             id = element.id;
    //         }
    //     });
    //     return id;
    // }

    // getUsername(socketId: any): any {
    //     let username = '';
    //     this.users.forEach((element) => {
    //         if (element.id === socketId) {
    //             username = element.username;
    //         }
    //     });
    //     return username;
    // }

    // getPlayer(socketId: any): string {
    //     let player = '';
    //     let username = this.getUsername(socketId);
    //     this.rooms.forEach((room) => {
    //         if (username === room.player1) {
    //             player = 'player1';
    //         } else if (username === room.player2) {
    //             player = 'player2';
    //         }
    //     });
    //     return player;
    // }

    // getRoom(id: any): any {
    //     let room = '';
    //     this.users.forEach((element) => {
    //         if (element.id === id) {
    //             console.log(element.room);
    //             room = element.room;
    //         }
    //     });
    //     return room;
    // }

    // deleteUser(socketId: any) {
    //     this.users.forEach((element) => {
    //         if (element.id === socketId) {
    //             let index = this.users.indexOf(element);
    //             this.users.splice(index, 1);
    //         }
    //     });
    // }

    deleteRoom(socketId: any) {
        let username = this.identification.getUsername(socketId);
        console.log(this.identification.rooms);
        this.identification.rooms.forEach((element) => {
            if (username === element.player1 || username === element.player2) {
                let index = this.identification.rooms.indexOf(element);
                this.identification.rooms.splice(index, 1);

                this.sio.sockets.emit('rooms', this.identification.rooms);
            }
        });
    }
}
