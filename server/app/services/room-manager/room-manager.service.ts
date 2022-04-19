import { BotType } from '@common/bot-type';
import { GoalInformations } from '@common/constants/goal-information';
import { GoalType } from '@common/constants/goal-type';
import { Tile } from '@common/tile/Tile';
import { CreateRoomInformations, CreateSoloRoomInformations, Room } from '@common/types';
import { Bot } from 'assets/type';
import * as io from 'socket.io';
import { Game } from './../../classes/game/game';
import { Player } from './../../classes/player/player';
import { DatabaseService } from './../database/database.services';
import { IdManager } from './../id-manager/id-manager.service';
export class RoomManager {
    sio: io.Server;
    identification: IdManager;
    databaseService: DatabaseService;

    constructor(sio: io.Server, identification: IdManager, databaseService: DatabaseService) {
        this.sio = sio;
        this.identification = identification;
        this.databaseService = databaseService;
    }

    static getGoalsPlayer(game: Game, player: Player): GoalInformations[] {
        const goals = game.goals;
        const goalsPlayer: GoalInformations[] = [];
        for (const goal in goals) {
            if (!goals[goal].isInGame) {
                continue;
            }
            if (goals[goal].type === GoalType.Public) {
                goalsPlayer.push(goals[goal]);
            } else if (game.player1 === player && goals[goal].type === GoalType.PrivatePlayer1) {
                goalsPlayer.push(goals[goal]);
            } else if (game.player2 === player && goals[goal].type === GoalType.PrivatePlayer2) {
                goalsPlayer.push(goals[goal]);
            } else if ((goals[goal].type === GoalType.PrivatePlayer2 || goals[goal].type === GoalType.PrivatePlayer1) && goals[goal].isDone) {
                goalsPlayer.push(goals[goal]);
            }
        }
        const copyGoalsPlayer: GoalInformations[] = [];
        goalsPlayer.forEach((element) => {
            if (element.type === GoalType.PrivatePlayer1 || element.type === GoalType.PrivatePlayer2) {
                copyGoalsPlayer.unshift(element);
            } else {
                copyGoalsPlayer.push(element);
            }
        });

        return copyGoalsPlayer;
    }

    createRoom(informations: CreateRoomInformations) {
        const user = {
            username: informations.username,
            id: informations.socketId,
            room: informations.room,
        };
        this.identification.users.push(user);
        this.identification.roomMessages[informations.room] = [];
        const game = new Game();
        game.player1Join(user, informations.timer, this.databaseService, informations.modeLog, informations.dictionary);
        this.identification.games.push(game);
        const roomObj = {
            player1: informations.username,
            player2: '',
            time: informations.timer,
            mode2990: informations.modeLog,
            dictionary: informations.dictionary,
        };
        this.identification.rooms.push(roomObj);
    }
    async convertMultiToSolo(modeLog: boolean, socketId: string) {
        const game = this.identification.getGame(socketId);
        const botName = await this.getRandomBotName(game.player1.user.username, BotType.Beginner);
        this.cancelCreation(socketId);
        const informations: CreateSoloRoomInformations = {
            username: game.player1.user.username,
            socketId,
            room: game.player1.user.room,
            timer: game.timer.timerMax.toString(),
            modeLog,
            botType: BotType.Beginner,
            botName,
            dictionary: game.dictionaryName,
        };
        this.createSoloGame(informations);
    }
    createSoloGame(informations: CreateSoloRoomInformations) {
        const user = {
            username: informations.username,
            id: informations.socketId,
            room: informations.username,
        };
        const roomObj = {
            player1: informations.username,
            player2: informations.botName,
            time: informations.timer,
            mode2990: informations.modeLog,
            dictionary: informations.dictionary,
        };
        this.identification.rooms.push(roomObj);
        this.identification.users.push(user);
        this.identification.roomMessages[informations.username] = [];
        const game = new Game();
        game.startSoloGame(user, this.sio, this.databaseService, informations);
        this.identification.games.push(game);
    }

    joinRoom(username: string, roomObj: Room, socketId: string): Tile[][] {
        let tiles: Tile[][] = [];
        this.identification.rooms.forEach((element: Room) => {
            if (roomObj.player1 === element.player1) {
                const room = roomObj.player1;
                if (element.player2.length === 0) {
                    const user = {
                        username,
                        id: socketId,
                        room,
                    };
                    this.identification.users.push(user);
                    element.player2 = username;
                    const game: Game = this.identification.getGame(this.identification.getId(roomObj.player1));
                    game.player2Join(user, this.sio);

                    tiles = [game.player1.getLetters(), game.player2.getLetters()];
                }
            }
        });

        return tiles;
    }
    cancelCreation(socketId: string) {
        const username = this.identification.getUsername(socketId);
        this.identification.rooms.forEach((element) => {
            if (username === element.player1) {
                element.player2 = '-2';

                this.deleteRoom(socketId);
                this.identification.deleteUser(socketId);
            }
        });

        this.identification.deleteGame(socketId);
    }
    deleteRoom(socketId: string) {
        const username = this.identification.getUsername(socketId);

        this.identification.rooms.forEach((element) => {
            if (username === element.player1) {
                if (element.player2 === '') {
                    const index = this.identification.rooms.indexOf(element);
                    this.identification.rooms.splice(index, 1);
                } else if (element.player2 === '-2') {
                    const index = this.identification.rooms.indexOf(element);
                    this.identification.rooms.splice(index, 1);
                } else {
                    element.player1 = '-2';
                }
            } else if (username === element.player2) {
                if (element.player1 === '-2') {
                    const index = this.identification.rooms.indexOf(element);
                    this.identification.rooms.splice(index, 1);
                } else {
                    element.player2 = '-2';
                }
            }
        });
    }

    async getRandomBotName(username: string, botType: string): Promise<string> {
        await this.databaseService.start();
        let type: string;
        if (botType === BotType.Beginner) {
            type = 'beginner';
        } else {
            type = 'expert';
        }

        const botsNames: Bot[] = await this.databaseService.getVirtualPlayers();
        const botsNamesArray: string[] = [];
        botsNames.forEach((bot: Bot) => {
            if (bot.type === type) {
                botsNamesArray.push(bot.name);
            }
        });
        let randomName = username;
        while (randomName === username) {
            randomName = botsNamesArray[Math.floor(Math.random() * botsNamesArray.length)];
        }
        this.databaseService.closeConnection();
        return randomName.concat(' ' + botType);
    }
}
