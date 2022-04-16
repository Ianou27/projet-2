import { BotType } from '@common/botType';
import { CreateRoomInformations, CreateSoloRoomInformations, Dic, InfoToJoin, Room } from '@common/types';
import * as http from 'http';
import * as io from 'socket.io';
import { AdminManager } from './../admin-manager/admin-manager.service';
import { CommandManager } from './../command-manager/command-manager.service';
import { DatabaseService } from './../database/database.services';
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
    commandManager: CommandManager;
    adminManager: AdminManager;
    constructor(server: http.Server, readonly databaseService: DatabaseService) {
        this.sio = new io.Server(server, { maxHttpBufferSize: 15e6, cors: { origin: '*', methods: ['GET', 'POST'] } });
        this.gameManager = new GameManager();
        this.identification = new IdManager();
        this.roomManager = new RoomManager();
        this.dictionaryManager = new DictionaryManager();
        this.commandManager = new CommandManager();
        this.adminManager = new AdminManager();
    }

    async handleSockets(): Promise<void> {
        this.sio.on('connection', (socket) => {
            socket.on('createRoom', (informations: CreateRoomInformations) => {
                informations.socketId = socket.id;
                this.roomManager.createRoom(informations, this.identification, this.databaseService);
                socket.join(informations.room);
            });

            socket.on('createSoloGame', async (informations: CreateSoloRoomInformations) => {
                informations.botName = await this.roomManager.getRandomBotName(informations.username, this.databaseService, informations.botType);;
                informations.socketId = socket.id;
                this.roomManager.createSoloGame(informations, this.identification, this.sio, this.databaseService);
                socket.join(informations.username);
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
                this.commandManager.commandPlace(this.sio, this.identification, this.gameManager, socket.id, command);
            });
            socket.on('passer', () => {
                this.commandManager.commandPass(this.sio, this.identification, this.gameManager, socket.id);
            });

            socket.on('réserve', (command: string[]) => {
                this.commandManager.commandReserve(this.sio, this.identification, this.gameManager, socket.id, command);
            });

            socket.on('aide', (command: string[]) => {
                this.commandManager.commandHelp(this.sio, this.identification, this.gameManager, socket.id, command);
            });

            socket.on('forceDisconnect', async () => {
                await this.databaseService.closeConnection();
                socket.disconnect();
            });

            socket.on('getBestScore', async () => {
                await this.databaseService.getBestScore(this.sio, socket.id);
            });

            socket.on('getAdminInfo', async () => {
                await this.adminManager.getAdminInformations(this.sio, this.databaseService, socket.id);
            });
            socket.on('addVirtualPlayerNames', async (name: string, type: string) => {
                await this.adminManager.addVirtualPlayerNames(this.sio, this.databaseService, socket.id, name, type);
            });

            socket.on('deleteVirtualPlayerName', async (name: string) => {
                await this.adminManager.deleteVirtualPlayerName(this.sio, this.databaseService, socket.id, name);
            });

            socket.on('modifyVirtualPlayerNames', async (oldName: string, newName: string) => {
                await this.adminManager.modifyVirtualPlayerNames(this.sio, this.databaseService, socket.id, oldName, newName);
            });

            socket.on('resetAll', async () => {
                await this.adminManager.resetAll(this.sio, this.databaseService, socket.id, this.dictionaryManager);
            });

            socket.on('resetVirtualPlayers', async () => {
                await this.adminManager.resetVirtualPlayers(this.sio, this.databaseService, socket.id);
            });

            socket.on('resetDictionary', async () => {
                await this.dictionaryManager.resetDictionary(this.sio, socket.id);
            });

            socket.on('uploadDictionary', async (file: Dic) => {
                await this.dictionaryManager.uploadDictionary(this.sio, socket.id, file);
            });

            socket.on('downloadDic', async (title: string) => {
                const dic = this.dictionaryManager.downloadDictionary(title);
                this.sio.to(socket.id).emit('downloadDic', dic);
            });
            socket.on('deleteDic', async (title: string) => {
                await this.dictionaryManager.deleteDictionary(title, this.sio, socket.id);
            });
            socket.on('modifyDictionary', async (oldTitle: string, newTitle: string, description: string) => {
                await this.dictionaryManager.modifyDictionary(oldTitle, newTitle, description, this.sio, socket.id);
            });

            socket.on('resetGameHistory', async () => {
                await this.adminManager.resetGameHistory(this.sio, this.databaseService, socket.id);
            });

            socket.on('resetBestScore', async () => {
                await this.databaseService.start();
                await this.databaseService.resetBestScores();
                await this.databaseService.closeConnection();
            });

            socket.on('indice', (command: string[]) => {
                this.commandManager.commandClue(this.sio, this.identification, this.gameManager, socket.id, command);
            });

            socket.on('echanger', (command: string[]) => {
                this.commandManager.commandExchange(this.sio, this.identification, this.gameManager, socket.id, command);
            });
            socket.on('cancelCreation', () => {
                this.roomManager.cancelCreation(socket.id, this.identification);
            });

            socket.on('convertToSoloGame', (modeLog: boolean) => {
  
                this.roomManager.convertMultiToSolo(modeLog, this.identification, this.sio, this.databaseService, socket.id);
            });
            socket.on('disconnect', async (reason) => {
                const room = this.identification.getRoom(socket.id);
                if (room !== '') {
                    const game = this.identification.getGame(socket.id);

                    if (game.player2 !== undefined && !game.gameState.gameFinished) {
                        let winner: string = this.identification.surrender(socket.id);
                        let botName:string = await this.roomManager.getRandomBotName(winner, this.databaseService, BotType.Beginner);
                        game.surrender(winner,botName);
                        this.sio.to(room).emit('playerDc');
                        this.sio.to(room).emit('startGame', winner, botName);
                    };

                    socket.leave(room);
                    this.roomManager.deleteRoom(socket.id, this.identification);
                    this.sio.sockets.emit('rooms', this.identification.rooms);
                }
                this.identification.deleteUser(socket.id);
            });
        });
    }
}
