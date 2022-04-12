import { BotType } from '@common/botType';
import { InfoToJoin, Room } from '@common/types';
import * as http from 'http';
import * as io from 'socket.io';
import { helpInformation } from './../../../assets/help-informations';
import { DatabaseService } from './../best-score/best-score.services';
import { DictionaryManager } from './../dictionary-manager/dictionary-manager.service';
import { GameManager } from './../game-manager/game-manager.service';
import { IdManager } from './../id-manager/id-manager.service';
import { RoomManager } from './../room-manager/room-manager.service';

export class SocketManager {
    gameManager: GameManager;
    identification: IdManager;
    roomManager: RoomManager;
    dictionaryManager: DictionaryManager;
    sio: io.Server;
    timeLeft: number;
    constructor(server: http.Server, readonly databaseService: DatabaseService) {
        this.sio = new io.Server(server, { maxHttpBufferSize: 15e6, cors: { origin: '*', methods: ['GET', 'POST'] } });
        this.gameManager = new GameManager();
        this.identification = new IdManager();
        this.roomManager = new RoomManager();
        this.dictionaryManager = new DictionaryManager();
    }

    async handleSockets(): Promise<void> {
        this.sio.on('connection', (socket) => {
            socket.on('createRoom', (username: string, room: string, timer: string, modeLog: boolean) => {
                this.roomManager.createRoom(username, room, socket.id, this.identification, timer, this.databaseService, modeLog);
                socket.join(room);
            });

            socket.on('createSoloGame', (username: string, timer: string, botType: BotType, modeLog: boolean) => {
                const botName = this.roomManager.getRandomBotName(username);
                this.roomManager.createSoloGame(
                    username,
                    socket.id,
                    this.identification,
                    this.sio,
                    timer,
                    this.databaseService,
                    botName,
                    botType,
                    modeLog,
                );
                socket.join(username);
            });

            socket.on('joinRoom', (username: string, roomObj: Room) => {
                const player1Id = this.identification.getId(roomObj.player1);
                const letters = this.roomManager.joinRoom(username, roomObj, socket.id, this.identification, this.sio);
                const game = this.identification.getGame(player1Id);
                socket.join(roomObj.player1);
                this.sio.to(game.player1.user.id).emit('tileHolder', letters[0], RoomManager.getGoalsPlayer(game, game.player1));
                this.sio.to(game.player2.user.id).emit('tileHolder', letters[1], RoomManager.getGoalsPlayer(game, game.player2));
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
                                this.sio.to(socket.id).emit('tileHolder', game.player1.getLetters(), RoomManager.getGoalsPlayer(game, game.player1));
                                this.sio.to(currentRoom).emit('updatePoint', 'player1', game.player1.points);
                            } else if (game.player2.user.id === socket.id) {
                                this.sio.to(socket.id).emit('tileHolder', game.player2.getLetters(), RoomManager.getGoalsPlayer(game, game.player2));
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
                    this.sio.to(game.player1.user.id).emit('tileHolder', game.player1.getLetters(), RoomManager.getGoalsPlayer(game, game.player1));
                    this.sio.to(game.player2.user.id).emit('tileHolder', game.player2.getLetters(), RoomManager.getGoalsPlayer(game, game.player2));
                }
            });

            socket.on('réserve', (command: string[]) => {
                const game = this.identification.getGame(socket.id);
                if (this.gameManager.reserveCommandValid(command)) {
                    this.sio.to(socket.id).emit('reserveLetters', this.gameManager.reserve(game));
                } else {
                    this.sio.to(socket.id).emit('commandValidated', 'Format invalide');
                }
            });

            socket.on('aide', (command: string[]) => {
                if (this.gameManager.helpCommandValid(command)) {
                    this.sio.to(socket.id).emit('commandValidated', command);
                    this.sio.to(socket.id).emit('helpInformation', helpInformation);
                } else {
                    this.sio.to(socket.id).emit('commandValidated', 'Format invalide');
                }
            });

            socket.on('forceDisconnect', async () => {
                await this.databaseService.closeConnection();
                socket.disconnect();
            });

            socket.on('getBestScore', async () => {
                try {
                    await this.databaseService.start();
                    this.sio
                        .to(socket.id)
                        .emit('getBestScore', await this.databaseService.bestScoreClassic(), await this.databaseService.bestScoreLog());
                } catch {
                    this.sio.to(socket.id).emit(
                        'getBestScore',
                        [
                            {
                                player: 'Accès à la BD impossible',
                                score: 'ERREUR',
                            },
                        ],
                        [
                            {
                                player: 'Accès à la BD impossible',
                                score: 'ERREUR',
                            },
                        ],
                    );
                }
            });

            socket.on('getAdminInfo', async () => {
                try {
                    await this.databaseService.start();
                    this.sio
                        .to(socket.id)
                        .emit(
                            'getAdminInfo',
                            await this.databaseService.getDictionaryInfo(),
                            await this.databaseService.getGameHistory(),
                            await this.databaseService.getVirtualPlayers(),
                        );

                    await this.databaseService.closeConnection();
                } catch {
                    // this.sio.to(socket.id).emit(
                    //     'getDictionaries',
                    //     [
                    //         {
                    //             player: 'Accès à la BD impossible',
                    //             score: 'ERREUR',
                    //         },
                    //     ],
                    //     [
                    //         {
                    //             player: 'Accès à la BD impossible',
                    //             score: 'ERREUR',
                    //         },
                    //     ],
                    // );
                }
            });
            socket.on('addVirtualPlayerNames', async (name: string, type: string) => {
                await this.databaseService.start();
                await this.databaseService.addVirtualPlayer(name, type);
                this.sio
                    .to(socket.id)
                    .emit(
                        'getAdminInfo',
                        await this.databaseService.getDictionaryInfo(),
                        await this.databaseService.getGameHistory(),
                        await this.databaseService.getVirtualPlayers(),
                    );
                await this.databaseService.closeConnection();
            });

            socket.on('deleteVirtualPlayerName', async (name: string) => {
                await this.databaseService.start();
                await this.databaseService.deleteVirtualPlayer(name);
                this.sio
                    .to(socket.id)
                    .emit(
                        'getAdminInfo',
                        await this.databaseService.getDictionaryInfo(),
                        await this.databaseService.getGameHistory(),
                        await this.databaseService.getVirtualPlayers(),
                    );
                await this.databaseService.closeConnection();
            });

            socket.on('modifyVirtualPlayerNames', async (oldName: string, newName: string) => {
                await this.databaseService.start();
                await this.databaseService.modifyVirtualPlayer(oldName, newName);
                this.sio
                    .to(socket.id)
                    .emit(
                        'getAdminInfo',
                        await this.databaseService.getDictionaryInfo(),
                        await this.databaseService.getGameHistory(),
                        await this.databaseService.getVirtualPlayers(),
                    );
                await this.databaseService.closeConnection();
            });

            socket.on('resetAll', async () => {
                await this.databaseService.start();
                await this.databaseService.resetAll();
                this.sio
                    .to(socket.id)
                    .emit(
                        'getAdminInfo',
                        await this.databaseService.getDictionaryInfo(),
                        await this.databaseService.getGameHistory(),
                        await this.databaseService.getVirtualPlayers(),
                    );
                await this.databaseService.closeConnection();
            });

            socket.on('resetVirtualPlayers', async () => {
                await this.databaseService.start();
                await this.databaseService.resetVirtualPlayers();
                this.sio
                    .to(socket.id)
                    .emit(
                        'getAdminInfo',
                        await this.databaseService.getDictionaryInfo(),
                        await this.databaseService.getGameHistory(),
                        await this.databaseService.getVirtualPlayers(),
                    );
                await this.databaseService.closeConnection();
            });

            socket.on('resetDictionary', async () => {
                await this.databaseService.start();
                await this.databaseService.resetDictionary();
                this.sio
                    .to(socket.id)
                    .emit(
                        'getAdminInfo',
                        await this.databaseService.getDictionaryInfo(),
                        await this.databaseService.getGameHistory(),
                        await this.databaseService.getVirtualPlayers(),
                    );
                await this.databaseService.closeConnection();
            });

            socket.on('uploadDictionary', async (file: JSON) => {
                this.dictionaryManager.uploadDictionary(file);
                await this.databaseService.start();
                this.sio
                    .to(socket.id)
                    .emit(
                        'getAdminInfo',
                        await this.databaseService.getDictionaryInfo(),
                        await this.databaseService.getGameHistory(),
                        await this.databaseService.getVirtualPlayers(),
                    );
                await this.databaseService.closeConnection();
            });

            socket.on('downloadDic', async (title: string) => {
                const dic = this.dictionaryManager.downloadDictionary(title);

                this.sio.to(socket.id).emit('downloadDic', dic);
            });
            socket.on('deleteDic', async (title: string) => {
                this.dictionaryManager.deleteDictionary(title);
                await this.databaseService.start();
                this.sio
                    .to(socket.id)
                    .emit(
                        'getAdminInfo',
                        await this.databaseService.getDictionaryInfo(),
                        await this.databaseService.getGameHistory(),
                        await this.databaseService.getVirtualPlayers(),
                    );
                await this.databaseService.closeConnection();
            });
            socket.on('modifyDictionary', async (oldTitle: string, newTitle: string, description: string) => {
                this.dictionaryManager.modifyDictionary(oldTitle, newTitle, description);
                await this.databaseService.start();

                this.sio
                    .to(socket.id)
                    .emit(
                        'getAdminInfo',
                        await this.databaseService.getDictionaryInfo(),
                        await this.databaseService.getGameHistory(),
                        await this.databaseService.getVirtualPlayers(),
                    );
                await this.databaseService.closeConnection();
            });

            socket.on('resetGameHistory', async () => {
                await this.databaseService.start();
                await this.databaseService.resetGameHistory();
                this.sio
                    .to(socket.id)
                    .emit(
                        'getAdminInfo',
                        await this.databaseService.getDictionaryInfo(),
                        await this.databaseService.getGameHistory(),
                        await this.databaseService.getVirtualPlayers(),
                    );
                await this.databaseService.closeConnection();
            });

            socket.on('resetBestScore', async () => {
                await this.databaseService.start();
                await this.databaseService.resetBestScores();
                await this.databaseService.closeConnection();
            });

            socket.on('indice', (command: string[]) => {
                const game = this.identification.getGame(socket.id);
                if (!game.playerTurnValid(this.identification.getPlayer(socket.id))) {
                    this.sio.to(socket.id).emit('commandValidated', " Ce n'est pas ton tour");
                } else {
                    if (this.gameManager.clueCommandValid(command)) {
                        const yes = this.gameManager.formatClueCommand(game);
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
                            message: 'Vous avez échangé les lettres ' + command[1],
                            player: 'server',
                        });
                        this.sio.to(player2).emit('roomMessage', {
                            username: 'Server',
                            message: 'Votre adversaire a échangé ' + command[1].length + ' lettres',
                            player: 'server',
                        });
                        this.gameManager.exchange(command, game);

                        this.sio.to(game.player1.user.room).emit('modification', game.gameBoard.cases, game.playerTurn().name);
                        this.sio
                            .to(game.player1.user.id)
                            .emit('tileHolder', game.player1.getLetters(), RoomManager.getGoalsPlayer(game, game.player1));
                        this.sio
                            .to(game.player2.user.id)
                            .emit('tileHolder', game.player2.getLetters(), RoomManager.getGoalsPlayer(game, game.player2));
                    } else {
                        this.sio.to(socket.id).emit('commandValidated', verification);
                    }
                }
            });
            socket.on('cancelCreation', () => {
                this.roomManager.cancelCreation(socket.id, this.identification);
            });

            socket.on('convertToSoloGame', (modeLog: boolean) => {
                this.roomManager.convertMultiToSolo(socket.id, this.identification, this.sio, this.databaseService, modeLog);
            });
            socket.on('disconnect', (reason) => {
                const room = this.identification.getRoom(socket.id);
                if (room !== '') {
                    const game = this.identification.getGame(socket.id);
                    if (game.player2 !== undefined && !game.gameState.gameFinished) game.surrender(this.identification.surrender(socket.id));

                    socket.leave(room);
                    this.roomManager.deleteRoom(socket.id, this.identification);
                    this.sio.sockets.emit('rooms', this.identification.rooms);

                    // mettre popup jv ici à changer
                    this.sio.to(room).emit('playerDc');
                }

                this.identification.deleteUser(socket.id);
            });
        });
    }
}
