import * as http from 'http';
import * as io from 'socket.io';
import { GameManager } from './gameManager.service';

export class SocketManager {
    private sio: io.Server;
    users: any[] = [];

    roomMessages: any = {};

    rooms: any[] = [];

    // commandsList et exclamationIndex à mettre dans un fichier de constantes
    private commandsList: string[] = ['!placer', '!echanger', '!passer', '!indice'];
    private commandIndex: number = 0;
    constructor(server: http.Server) {
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
    }
    gameManager: GameManager = new GameManager();

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
                socket.emit('placeFormatValidated', commandFormatValid);
            });

            socket.on('boardVerification', (command: string) => {
                const isValid = this.placeBoardValid(command.split(' '));
                socket.emit('placeBoardValidated', isValid);
            });

            socket.on('placeWord', (command: string) => {
                this.placeWord(command.split(' '));
                socket.emit('modification', this.gameManager.gameList.gameBoard.cases);
                socket.emit('tileHolder', this.gameManager.gameList.player1.getLetters());
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

                const roomObj = {
                    player1: username,
                    player2: '',
                };
                this.rooms.push(roomObj);
                console.log('----------');
                this.users.forEach((element) => console.log(element));

                socket.join(room);
            });

            socket.on('joinRoom', (username: string, roomObj: any) => {
                console.log(username, '--------------------------------------------------', roomObj);

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
                let currentRoom: any = '';
                this.users.forEach((element) => {
                    if (element.id === socket.id) {
                        username = element.username;
                        currentRoom = element.room;
                    }
                });

                const roomSockets = this.sio.sockets.adapter.rooms.get(currentRoom);
                // Seulement un membre de la salle peut envoyer un message aux autres
                if (roomSockets?.has(socket.id)) {
                    this.roomMessages[currentRoom].push({ username, message });

                    this.sio.to(currentRoom).emit('roomMessage', this.roomMessages[currentRoom]);
                }
            });
            socket.on('updateRoom', (a) => {
                this.sio.sockets.emit('rooms', this.rooms);
            });


            socket.on('disconnect', (reason) => {
                this.deleteUser(socket.id);
                console.log(`Deconnexion par l'utilisateur avec id : ${socket.id}`);
                console.log(`Raison de deconnexion : ${reason}`);
            });
        });
    }

    getUsername(id: any): any {
        let username = '';

        return username;
    }

    joined() {
        return true;
    }
    placeWord(command: string[]) {
        this.gameManager.gameList.placeWord(command);
    }

    placeBoardValid(command: string[]): boolean {
        return this.gameManager.gameList.validatedPlaceCommandBoard(command);
    }

    commandVerification(message: string): string {
        const messageArray = message.split(' ');
        for (const command of this.commandsList) {
            if (command === messageArray[this.commandIndex]) {
                return command;
            }
        }
        return 'notRecognized';
    }

    placeFormatValid(command: string[]) {
        return this.gameManager.validatedPlaceCommandFormat(command);
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
}
