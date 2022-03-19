/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-console */
import { InfoToJoin, Room } from '@common/types';
import * as http from 'http';
import * as io from 'socket.io';
import { DatabaseService } from './best-score.services';
import { GameManager } from './game-manager.service';
import { IdManager } from './id-manager.service';
import { RoomManager } from './room-manager.service';

export class SocketManager {
    gameManager: GameManager = new GameManager();
    identification: IdManager = new IdManager();
    roomManager: RoomManager = new RoomManager();
    sio: io.Server;
    timeLeft: number;
    constructor(server: http.Server, private readonly databaseService: DatabaseService) {
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
    }

    async handleSockets(): Promise<void> {
        this.sio.on('connection', (socket) => {
            console.log(`Connexion par l'utilisateur avec id : ${socket.id}`);
            socket.on('createRoom', (username: string, room: string, timer: string) => {
                this.roomManager.createRoom(username, room, socket.id, this.identification, timer, this.databaseService);
                socket.join(room);
            });

            socket.on('createSoloGame', (username: string, timer: string) => {
                const botName = this.roomManager.getRandomBotName(username);
                this.roomManager.createSoloGame(username, socket.id, this.identification, this.sio, timer, this.databaseService, botName);
                socket.join(username);
                this.sio.to(socket.id).emit('startGame', username, botName);
            });

            socket.on('joinRoom', (username: string, roomObj: Room) => {
                const player1Id = this.identification.getId(roomObj.player1);
                const letters = this.roomManager.joinRoom(username, roomObj, socket.id, this.identification, this.sio);
                socket.join(roomObj.player1);

                this.sio.to(player1Id).emit('tileHolder', letters[0]);

                this.sio.to(socket.id).emit('tileHolder', letters[1]);
                this.sio.to(roomObj.player1).emit('startGame', roomObj.player1, username);
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
                let player;

                this.identification.rooms.forEach((room: Room) => {
                    if (room.player1 === username) {
                        player = 'player1';
                    } else if (room.player2 === username) {
                        player = 'player2';
                    }
                });

                if (this.gameManager.messageVerification(message) === 'valide') {
                    this.identification.roomMessages[currentRoom].push({ username, message });

                    this.sio.to(currentRoom).emit('roomMessage', { username, message, player });
                }
            });
            socket.on('updateRoom', () => {
                this.sio.sockets.emit('rooms', this.identification.rooms);
            });
            socket.on('placer', (command: string[]) => {
                const username = this.identification.getUsername(socket.id);
                const currentRoom = this.identification.getRoom(socket.id);
                const game = this.identification.getGame(socket.id);
                if (!game.playerTurnValid(this.identification.getPlayer(socket.id))) {
                    if (game.player1.user.id === socket.id) {
                        this.sio.to(socket.id).emit('commandValidated', " Ce n'est pas ton tour", game.gameBoard.cases, game.player1.letters);
                    } else {
                        this.sio.to(socket.id).emit('commandValidated', " Ce n'est pas ton tour", game.gameBoard.cases, game.player2.letters);
                    }
                } else {
                    const verification: string = this.gameManager.placeVerification(command, game);
                    console.log(verification);
                    if (verification === 'valide') {
                        const message = this.gameManager.placeWord(command, game);
                        if (message !== 'placer') {
                            if (game.player1.user.id === socket.id) {
                                this.sio.to(socket.id).emit('commandValidated', message, game.gameBoard.cases, game.player1.letters);
                            } else {
                                this.sio.to(socket.id).emit('commandValidated', message, game.gameBoard.cases, game.player2.letters);
                            }
                        } else {
                            this.sio
                                .to(currentRoom)
                                .emit(
                                    'updateReserve',
                                    game.reserveLetters.letters.length,
                                    game.player1.getNumberLetters(),
                                    game.player2.getNumberLetters(),
                                );
                            this.sio.to(currentRoom).emit('roomMessage', {
                                username: 'Server',
                                message: username + ' a placé le mot ' + command[2] + ' en ' + command[1],
                                player: 'server',
                            });
                            this.sio.to(currentRoom).emit('modification', game.gameBoard.cases, game.playerTurn().name);

                            if (game.player1.user.id === socket.id) {
                                this.sio.to(socket.id).emit('tileHolder', game.player1.getLetters());
                                this.sio.to(currentRoom).emit('updatePoint', 'player1', game.player1.points);
                            } else if (game.player2.user.id === socket.id) {
                                this.sio.to(socket.id).emit('tileHolder', game.player2.getLetters());
                                this.sio.to(currentRoom).emit('updatePoint', 'player2', game.player2.points);
                            }
                        }
                    } else if (verification !== 'valide') {
                        if (game.player1.user.id === socket.id) {
                            this.sio.to(socket.id).emit('commandValidated', verification, game.gameBoard.cases, game.player1.letters);
                        } else {
                            this.sio.to(socket.id).emit('commandValidated', verification, game.gameBoard.cases, game.player2.letters);
                        }
                    }
                }
            });
            socket.on('passer', () => {
                const username = this.identification.getUsername(socket.id);
                const currentRoom = this.identification.getRoom(socket.id);
                const game = this.identification.getGame(socket.id);
                if (!game.gameState.gameFinished) {
                    if (!game.playerTurnValid(this.identification.getPlayer(socket.id))) {
                        this.sio.to(socket.id).emit('commandValidated', " Ce n'est pas ton tour");
                    } else {
                        this.sio.to(currentRoom).emit('roomMessage', {
                            username: 'Server',
                            message: username + ' a passé son tour ',
                            player: 'server',
                        });
                        this.gameManager.pass(game);
                        this.sio.to(currentRoom).emit('modification', game.gameBoard.cases, game.playerTurn().name);
                    }
                }
            });

            socket.on('reserve', (command: string[]) => {
                const game = this.identification.getGame(socket.id);
                if (this.gameManager.reserveCommandValid(command)) {
                    this.sio.to(socket.id).emit('reserveLetters', this.gameManager.reserve(game));
                } else {
                    this.sio.to(socket.id).emit('reserveValidated', 'Format invalide');
                }
            });
            socket.on('forceDisconnect', async() => {
                await this.databaseService.closeConnection();
                socket.disconnect();
            });

            socket.on('getBestScore', async () => {
                try {
                    await this.databaseService.start();
                    console.log('Database connection successful !');
                    this.sio.to(socket.id).emit('getBestScore', await this.databaseService.bestScoreClassic(),await this.databaseService.bestScoreLog());
                } catch {
                    console.error('Database connection failed !');
                    this.sio.to(socket.id).emit('getBestScore', [{
                        player: 'Can not access to DB',
                        score: 'ERROR',
                    }],[{
                        player: 'Can not access to DB',
                        score: 'ERROR',
                    }]);
                }
                
            });

            socket.on('indice', (command: string[]) => {
                const game = this.identification.getGame(socket.id);
                if (!game.playerTurnValid(this.identification.getPlayer(socket.id))) {
                    this.sio.to(socket.id).emit('commandValidated', " Ce n'est pas ton tour");
                } else {
                    if (this.gameManager.clueCommandValid(command)) {
                        const yes = this.gameManager.formatClueCommand(game);
                        console.log(yes);
                        this.sio.to(socket.id).emit('cluesMessage', yes);
                    } else {
                        this.sio.to(socket.id).emit('commandValidated', 'Format invalide');
                    }
                }
            });

            socket.on('echanger', (command: string[]) => {
                const game = this.identification.getGame(socket.id);
                if (!game.playerTurnValid(this.identification.getPlayer(socket.id))) {
                    this.sio.to(socket.id).emit('commandValidated', " Ce n'est pas ton tour");
                } else {
                    const verification: string = this.gameManager.exchangeVerification(command, game);
                    let player2: string;

                    if (socket.id === game.player1.user.id) {
                        player2 = game.player2.user.id;
                    } else {
                        player2 = game.player1.user.id;
                    }

                    if (verification === 'valide') {
                        this.sio.to(socket.id).emit('roomMessage', {
                            username: 'Server',
                            message: 'vous avez echangé les lettres ' + command[1],
                            player: 'server',
                        });
                        this.sio.to(player2).emit('roomMessage', {
                            username: 'Server',
                            message: 'votre adversaire a echangé ' + command[1].length + ' lettres',
                            player: 'server',
                        });
                        this.gameManager.exchange(command, game);

                        this.sio.to(game.player1.user.room).emit('modification', game.gameBoard.cases, game.playerTurn().name);

                        if (socket.id === game.player1.user.id) {
                            this.sio.to(socket.id).emit('tileHolder', game.player1.getLetters());
                        } else if (socket.id === game.player2.user.id) {
                            this.sio.to(socket.id).emit('tileHolder', game.player2.getLetters());
                        }
                    } else {
                        this.sio.to(socket.id).emit('commandValidated', verification);
                    }
                }
            });
            socket.on('cancelCreation', () => {
                this.roomManager.cancelCreation(socket.id, this.identification);
            });
            socket.on('disconnect', (reason) => {
                const room = this.identification.getRoom(socket.id);

                if (room !== '') {
                    const game = this.identification.getGame(socket.id);
                    if (game.player2 !== undefined && !game.gameState.gameFinished) game.surrender(this.identification.surrender(socket.id));

                    socket.leave(room);
                    this.roomManager.deleteRoom(socket.id, this.identification);
                    this.sio.sockets.emit('rooms', this.identification.rooms);

                    this.sio.to(room).emit('playerDc');
                }

                this.identification.deleteUser(socket.id);
                console.log(`Deconnexion par l'utilisateur avec id : ${socket.id}`);
                console.log(`Raison de deconnexion : ${reason}`);
                console.log(this.identification.users);
            });
        });
    }
}
