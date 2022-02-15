import { Game } from '@app/classes/game/game';
import { InfoToJoin, Room } from '@common/types';
import * as http from 'http';
import * as io from 'socket.io';
import { GameManager } from './gameManager.service';
import { IdManager } from './idManager.service';
import { RoomManager } from './roomManager.service';
import { Timer } from './timerManager.service';
export class SocketManager {
    gameManager: GameManager = new GameManager();
    identification: IdManager = new IdManager();
    roomManager: RoomManager = new RoomManager();
    timerManager: Timer = new Timer();
    sio: io.Server;
    timeLeft: number = 10;
    constructor(server: http.Server) {
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
    }

    handleSockets(): void {
        this.sio.on('connection', (socket) => {
            console.log(`Connexion par l'utilisateur avec id : ${socket.id}`);
            socket.on('createRoom', (username: string, room: string) => {
                this.roomManager.createRoom(username, room, socket.id, this.identification);
                socket.join(room);
            });

            socket.on('joinRoom', (username: string, roomObj: Room) => {
                const player1Id = this.identification.getId(roomObj.player1);
                const letters = this.roomManager.joinRoom(username, roomObj, socket.id, this.identification);
                socket.join(roomObj.player1);

                this.sio.to(player1Id).emit('tileHolder', letters[0]);

                this.sio.to(socket.id).emit('tileHolder', letters[1]);
                this.sio.to(roomObj.player1).emit('startGame', roomObj.player1, username);
                this.timerManager.start(socket.id, this.identification, this.sio, this.gameManager);
            });

            socket.on('askJoin', (username: string, roomObj: Room) => {
                this.sio.to(roomObj.player1).emit('asked', username, socket.id, roomObj);
                this.identification.rooms.forEach((room) => {
                    if (room.player1 === roomObj.player1) {
                        room.player2 = '-1';
                    }
                });

                this.sio.sockets.emit('rooms', this.identification.rooms);
            });

            socket.on('accepted', (socketId: string, infoObj: InfoToJoin) => {
                this.sio.to(socketId).emit('joining', infoObj);
                const username = this.identification.getUsername(socket.id);

                this.identification.rooms.forEach((room) => {
                    if (room.player1 === username) {
                        room.player2 = '';
                    }
                });
            });

            socket.on('refused', (socketId: string, infoObj: InfoToJoin) => {
                this.sio.to(socketId).emit('refusing', infoObj);

                const username = this.identification.getUsername(socket.id);

                this.identification.rooms.forEach((room) => {
                    if (room.player1 === username) {
                        room.player2 = '';
                    }
                });

                this.sio.sockets.emit('rooms', this.identification.rooms);
            });

            socket.on('roomMessage', (message: string) => {
                const username = this.identification.getUsername(socket.id);
                const currentRoom = this.identification.getRoom(socket.id);
                let player2Id = '';
                let game: Game = new Game();
                let player;
                

                this.identification.rooms.forEach((room: Room) => {
                    if (room.player1 === username) {
                        game = room.game;
                        player = 'player1';
                        player2Id = this.identification.getId(room.player2);
                    } else if (room.player2 === username) {
                        game = room.game;
                        player = 'player2';
                        player2Id = this.identification.getId(room.player1);
                    }
                });
                if (message === undefined || message === null) return;
                if (message.charAt(0) === '!') {
                    const command = message.split(' ');
                    if (!game.playerTurnValid(this.identification.getPlayer(socket.id))) {
                        this.sio.to(socket.id).emit('commandValidated', " Ce n'est pas ton tour");
                    } else if (!this.gameManager.commandVerification(command[0])) {
                        this.sio.to(socket.id).emit('commandValidated', 'Erreur de syntaxe');
                    } else
                    if(!game.gameFinished){
                        switch (command[0]) {
                            case '!passer': {
                                const verification: string = this.gameManager.passVerification(command);
                                if (verification === 'valide') {
                                    this.gameManager.pass(game);
                                    this.sio.to(currentRoom).emit('roomMessage', {
                                        username: 'Server',
                                        message: username + ' a passé son tour ',
                                        player: 'server',
                                    });
                                    this.sio.to(currentRoom).emit('modification', game.gameBoard.cases, game.playerTurn().name);
                                } else {
                                    this.sio.to(socket.id).emit('commandValidated', verification);
                                }

                                break;
                            }
                            case '!placer': {
                                const verification: string = this.gameManager.placeVerification(command, game);

                                if (verification === 'valide') {
                                    const message = this.gameManager.placeWord(command, game);
                                    if (message !== 'placer') {
                                        this.sio.to(socket.id).emit('commandValidated', message);
                                    } else {
                                        this.timerManager.reset();
                                        this.sio
                                            .to(currentRoom)
                                            .emit(
                                                'updateReserve',
                                                game.reserveLetters.length,
                                                game.player1.getNumberLetters(),
                                                game.player2.getNumberLetters(),
                                            );
                                        this.sio.to(currentRoom).emit('roomMessage', {
                                            username: 'Server',
                                            message: username + ' a placé le mot ' + command[2] + ' en ' + command[1],
                                            player: 'server',
                                        });
                                        this.sio.to(currentRoom).emit('modification', game.gameBoard.cases, game.playerTurn().name);

                                        if (player === 'player1') {
                                            this.sio.to(socket.id).emit('tileHolder', game.player1.getLetters());
                                            this.sio.to(currentRoom).emit('updatePoint', player, game.player1.points);
                                        } else if (player === 'player2') {
                                            this.sio.to(socket.id).emit('tileHolder', game.player2.getLetters());
                                            this.sio.to(currentRoom).emit('updatePoint', player, game.player2.points);
                                        }
                                    }
                                } else {
                                    this.sio.to(socket.id).emit('commandValidated', verification);
                                }

                                break;
                            }
                            case '!echanger': {
                                const verification: string = this.gameManager.exchangeVerification(command, game);

                                if (verification === 'valide') {
                                    this.gameManager.exchange(command, game);
                                    this.timerManager.reset();
                                    this.sio.to(currentRoom).emit('modification', game.gameBoard.cases, game.playerTurn().name);
                                    this.sio.to(socket.id).emit('roomMessage', {
                                        username: 'Server',
                                        message: 'vous avez echangé les lettres ' + command[1],
                                        player: 'server',
                                    });
                                    this.sio.to(player2Id).emit('roomMessage', {
                                        username: 'Server',
                                        message: 'votre adversaire a echangé ' + command[1].length + ' lettres',
                                        player: 'server',
                                    });

                                    if (player === 'player1') {
                                        this.sio.to(socket.id).emit('tileHolder', game.player1.getLetters());
                                    } else if (player === 'player2') {
                                        this.sio.to(socket.id).emit('tileHolder', game.player2.getLetters());
                                    }
                                } else {
                                    this.sio.to(socket.id).emit('commandValidated', verification);
                                }

                                break;
                            }
                            // No default
                        }
                    }
                    else{
                        this.sio.to(socket.id).emit('roomMessage', {
                            username: 'Server',
                            message: 'partie finito',
                            player: 'server',
                        });

                        console.log(game.winner);
                        this.sio.to(currentRoom).emit('endGame', this.identification.getWinner(username,game.winner));
                        
                    }
                } else if (this.gameManager.messageVerification(message) === 'valide') {
                    this.identification.roomMessages[currentRoom].push({ username, message });

                    this.sio.to(currentRoom).emit('roomMessage', { username, message, player });
                }
            });
            socket.on('updateRoom', () => {
                this.sio.sockets.emit('rooms', this.identification.rooms);
            });

            socket.on('passer', () => {
                
                const username = this.identification.getUsername(socket.id);
                const currentRoom = this.identification.getRoom(socket.id);
                let game: Game = new Game();
               
                this.identification.rooms.forEach((room: Room) => {
                    if (room.player1 === username || room.player2 === username) {
                        game = room.game;
                    }
                });
                if(!game.gameFinished){
                if (!game.playerTurnValid(this.identification.getPlayer(socket.id))) {
                    this.sio.to(socket.id).emit('commandValidated', " Ce n'est pas ton tour");
                } else {
                    this.gameManager.pass(game);
                    this.timerManager.reset();
                    this.sio.to(currentRoom).emit('roomMessage', {
                        username: 'Server',
                        message: username + ' a passé son tour ',
                        player: 'server',
                    });
                    this.sio.to(currentRoom).emit('modification', game.gameBoard.cases, game.playerTurn().name);
                }
                }
                else{
                    this.sio.to(currentRoom).emit('endGame', this.identification.getWinner(username,game.winner));
                }
            });

            socket.on('timer', () => {});
            socket.on('finPartie', () => {});

            socket.on('cancelCreation', () => {
                this.roomManager.cancelCreation(socket.id, this.identification);
                this.identification.deleteUser(socket.id);
            });
            socket.on('disconnect', (reason) => {
                this.timerManager.stop();
                const room = this.identification.getRoom(socket.id);
                this.sio.to(room).emit('endGame', this.identification.surrender(socket.id));
                if (room !== '') {
                    socket.leave(room);
                    this.roomManager.deleteRoom(socket.id, this.identification);
                    this.sio.sockets.emit('rooms', this.identification.rooms);

                    this.sio.to(room).emit('playerDc');
               
                }

                this.identification.deleteUser(socket.id);
                console.log(`Deconnexion par l'utilisateur avec id : ${socket.id}`);
                console.log(`Raison de deconnexion : ${reason}`);
            });
        });
    }
}
