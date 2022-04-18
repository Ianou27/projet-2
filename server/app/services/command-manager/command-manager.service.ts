import * as io from 'socket.io';
import { helpInformation } from './../../../../common/assets/help-informations';
import { GameManager } from './../game-manager/game-manager.service';
import { IdManager } from './../id-manager/id-manager.service';
import { RoomManager } from './../room-manager/room-manager.service';

export class CommandManager {
    sio: io.Server;
    identification: IdManager;
    gameManager: GameManager;

    constructor(sio: io.Server, identification: IdManager, gameManager: GameManager) {
        this.sio = sio;
        this.identification = identification;
        this.gameManager = gameManager;
    }

    commandPlace(socketId: string, command: string[]) {
        const username = this.identification.getUsername(socketId);
        const currentRoom = this.identification.getRoom(socketId);
        const game = this.identification.getGame(socketId);
        if (!game.playerTurnValid(this.identification.getPlayer(socketId))) {
            if (game.player1.user.id === socketId) {
                this.sio.to(socketId).emit('commandValidated', " Ce n'est pas ton tour", game.gameBoard.cases, game.player1.letters);
            } else {
                this.sio.to(socketId).emit('commandValidated', " Ce n'est pas ton tour", game.gameBoard.cases, game.player2.letters);
            }
        } else {
            const verification: string = this.gameManager.placeVerification(command, game);
            if (verification === 'valide') {
                const message = this.gameManager.placeWord(command, game);
                if (message !== 'placer') {
                    if (game.player1.user.id === socketId) {
                        this.sio.to(socketId).emit('commandValidated', message, game.gameBoard.cases, game.player1.letters);
                    } else {
                        this.sio.to(socketId).emit('commandValidated', message, game.gameBoard.cases, game.player2.letters);
                    }
                } else {
                    this.sio
                        .to(currentRoom)
                        .emit('updateReserve', game.reserveLetters.letters.length, game.player1.getNumberLetters(), game.player2.getNumberLetters());
                    this.sio.to(currentRoom).emit('roomMessage', {
                        username: 'Server',
                        message: username + ' a placé les lettres ' + command[2] + ' en ' + command[1],
                        player: 'server',
                    });
                    this.sio.to(currentRoom).emit('modification', game.gameBoard.cases, game.playerTurn().name);

                    if (game.player1.user.id === socketId) {
                        this.sio.to(socketId).emit('tileHolder', game.player1.getLetters(), RoomManager.getGoalsPlayer(game, game.player1));
                        this.sio.to(currentRoom).emit('updatePoint', 'player1', game.player1.points);
                    } else if (game.player2.user.id === socketId) {
                        this.sio.to(socketId).emit('tileHolder', game.player2.getLetters(), RoomManager.getGoalsPlayer(game, game.player2));
                        this.sio.to(currentRoom).emit('updatePoint', 'player2', game.player2.points);
                    }
                }
            } else if (verification !== 'valide') {
                if (game.player1.user.id === socketId) {
                    this.sio.to(socketId).emit('commandValidated', verification, game.gameBoard.cases, game.player1.letters);
                } else {
                    this.sio.to(socketId).emit('commandValidated', verification, game.gameBoard.cases, game.player2.letters);
                }
            }
        }
    }

    commandPass(socketId: string) {
        const username = this.identification.getUsername(socketId);
        const currentRoom = this.identification.getRoom(socketId);
        const game = this.identification.getGame(socketId);
        if (!game.gameState.gameFinished) {
            if (!game.playerTurnValid(this.identification.getPlayer(socketId))) {
                this.sio.to(socketId).emit('commandValidated', " Ce n'est pas ton tour");
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
    }

    commandReserve(socketId: string, command: string[]) {
        const game = this.identification.getGame(socketId);
        if (this.gameManager.reserveCommandValid(command)) {
            this.sio.to(socketId).emit('reserveLetters', this.gameManager.reserve(game));
        } else {
            this.sio.to(socketId).emit('commandValidated', 'Format invalide');
        }
    }

    commandHelp(socketId: string, command: string[]) {
        if (this.gameManager.helpCommandValid(command)) {
            this.sio.to(socketId).emit('commandValidated', command);
            this.sio.to(socketId).emit('helpInformation', helpInformation);
        } else {
            this.sio.to(socketId).emit('commandValidated', 'Format invalide');
        }
    }

    commandExchange(socketId: string, command: string[]) {
        const game = this.identification.getGame(socketId);
        if (!game.playerTurnValid(this.identification.getPlayer(socketId))) {
            this.sio.to(socketId).emit('commandValidated', " Ce n'est pas ton tour");
        } else {
            const verification: string = this.gameManager.exchangeVerification(command, game);
            let player2: string;

            if (socketId === game.player1.user.id) {
                player2 = game.player2.user.id;
            } else {
                player2 = game.player1.user.id;
            }

            if (verification === 'valide') {
                this.sio.to(socketId).emit('roomMessage', {
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
                this.sio.to(game.player1.user.id).emit('tileHolder', game.player1.getLetters(), RoomManager.getGoalsPlayer(game, game.player1));
                this.sio.to(game.player2.user.id).emit('tileHolder', game.player2.getLetters(), RoomManager.getGoalsPlayer(game, game.player2));
            } else {
                this.sio.to(socketId).emit('commandValidated', verification);
            }
        }
    }

    commandClue(socketId: string, command: string[]) {
        const game = this.identification.getGame(socketId);
        if (!game.playerTurnValid(this.identification.getPlayer(socketId))) {
            this.sio.to(socketId).emit('commandValidated', " Ce n'est pas ton tour");
        } else {
            if (this.gameManager.clueCommandValid(command)) {
                const validation = this.gameManager.formatClueCommand(game);
                this.sio.to(socketId).emit('cluesMessage', validation);
            } else {
                this.sio.to(socketId).emit('commandValidated', 'Format invalide');
            }
        }
    }
}
