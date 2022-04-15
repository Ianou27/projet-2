import { BotType } from '@common/botType';
import { GoalInformations } from '@common/constants/goal-information';
import { GoalType } from '@common/constants/goal-type';
import { Tile } from '@common/tile/Tile';
import { Room } from '@common/types';
import * as io from 'socket.io';
import { BEGINNER_BOT } from './../../../assets/bot-name';
import { Game } from './../../classes/game/game';
import { Player } from './../../classes/player/player';
import { DatabaseService } from './../database/database.services';
import { IdManager } from './../id-manager/id-manager.service';
export class RoomManager {
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
            if ((element.type === GoalType.PrivatePlayer1 || element.type === GoalType.PrivatePlayer2) && element.isDone) {
                copyGoalsPlayer.unshift(element);
            } else {
                copyGoalsPlayer.push(element);
            }
        });

        return copyGoalsPlayer;
    }

    createRoom(
        username: string,
        room: string,
        socketId: string,
        identification: IdManager,
        timer: string,
        databaseService: DatabaseService,
        modeLog: boolean,
    ) {
        const user = {
            username,
            id: socketId,
            room,
        };
        identification.users.push(user);
        identification.roomMessages[room] = [];
        const game = new Game();
        game.player1Join(user, timer, databaseService, modeLog);
        identification.games.push(game);
        const roomObj = {
            player1: username,
            player2: '',
            time: timer,
            mode2990: modeLog,
        };
        identification.rooms.push(roomObj);
    }
    convertMultiToSolo(socketId: string, identification: IdManager, sio: io.Server, databaseService: DatabaseService, modeLog: boolean) {
        const game = identification.getGame(socketId);
        const botName = this.getRandomBotName(game.player1.user.username);
        this.cancelCreation(socketId, identification);
        this.createSoloGame(
            game.player1.user.username,
            socketId,
            identification,
            sio,
            game.timer.timerMax.toString(),
            databaseService,
            botName,
            BotType.Beginner,
            modeLog,
        );
    }
    createSoloGame(
        username: string,
        socketId: string,
        identification: IdManager,
        sio: io.Server,
        timer: string,
        databaseService: DatabaseService,
        botName: string,
        botType: BotType,
        modeLog: boolean,
    ) {
        const user = {
            username,
            id: socketId,
            room: username,
        };
        const roomObj = {
            player1: username,
            player2: botName,
            time: timer,
            mode2990: modeLog,
        };
        identification.rooms.push(roomObj);
        identification.users.push(user);
        identification.roomMessages[username] = [];
        const game = new Game();
        game.startSoloGame(user, sio, timer, databaseService, botName, botType, modeLog);
        identification.games.push(game);
    }

    joinRoom(username: string, roomObj: Room, socketId: string, identification: IdManager, sio: io.Server): Tile[][] {
        let tiles: Tile[][] = [];
        identification.rooms.forEach((element: Room) => {
            if (roomObj.player1 === element.player1) {
                const room = roomObj.player1;
                if (element.player2.length === 0) {
                    const user = {
                        username,
                        id: socketId,
                        room,
                    };
                    identification.users.push(user);
                    element.player2 = username;
                    const game: Game = identification.getGame(identification.getId(roomObj.player1));
                    game.player2Join(user, sio);

                    tiles = [game.player1.getLetters(), game.player2.getLetters()];
                }
            }
        });

        return tiles;
    }
    cancelCreation(socketId: string, identification: IdManager) {
        const username = identification.getUsername(socketId);
        identification.rooms.forEach((element) => {
            if (username === element.player1) {
                element.player2 = '-2';

                this.deleteRoom(socketId, identification);
                identification.deleteUser(socketId);
            }
        });

        identification.deleteGame(socketId);
    }
    deleteRoom(socketId: string, identification: IdManager) {
        const username = identification.getUsername(socketId);

        identification.rooms.forEach((element) => {
            if (username === element.player1) {
                if (element.player2 === '') {
                    const index = identification.rooms.indexOf(element);
                    identification.rooms.splice(index, 1);
                } else if (element.player2 === '-2') {
                    const index = identification.rooms.indexOf(element);
                    identification.rooms.splice(index, 1);
                } else {
                    element.player1 = '-2';
                }
            } else if (username === element.player2) {
                if (element.player1 === '-2') {
                    const index = identification.rooms.indexOf(element);
                    identification.rooms.splice(index, 1);
                } else {
                    element.player2 = '-2';
                }
            }
        });
    }

    getRandomBotName(username: string): string {
        let randomName = username;
        while (randomName === username) {
            randomName = BEGINNER_BOT[Math.floor(Math.random() * BEGINNER_BOT.length)];
        }
        return randomName.concat(' (Joueur virtuel)');
    }
}
