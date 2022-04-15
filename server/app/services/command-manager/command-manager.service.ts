import * as io from 'socket.io';
import { helpInformation } from './../../../assets/help-informations';
import { GameManager } from './../game-manager/game-manager.service';
import { IdManager } from './../id-manager/id-manager.service';
import { RoomManager } from './../room-manager/room-manager.service';

export class CommandManager {
    commandPlace(sio: io.Server, identification: IdManager, gameManager: GameManager, socketId: string, command: string[]) {
        const username = identification.getUsername(socketId);
        const currentRoom = identification.getRoom(socketId);
        const game = identification.getGame(socketId);
        if (!game.playerTurnValid(identification.getPlayer(socketId))) {
            if (game.player1.user.id === socketId) {
                sio.to(socketId).emit('commandValidated', " Ce n'est pas ton tour", game.gameBoard.cases, game.player1.letters);
            } else {
                sio.to(socketId).emit('commandValidated', " Ce n'est pas ton tour", game.gameBoard.cases, game.player2.letters);
            }
        } else {
            const verification: string = gameManager.placeVerification(command, game);
            if (verification === 'valide') {
                const message = gameManager.placeWord(command, game);
                if (message !== 'placer') {
                    if (game.player1.user.id === socketId) {
                        sio.to(socketId).emit('commandValidated', message, game.gameBoard.cases, game.player1.letters);
                    } else {
                        sio.to(socketId).emit('commandValidated', message, game.gameBoard.cases, game.player2.letters);
                    }
                } else {
                    sio.to(currentRoom).emit(
                        'updateReserve',
                        game.reserveLetters.letters.length,
                        game.player1.getNumberLetters(),
                        game.player2.getNumberLetters(),
                    );
                    sio.to(currentRoom).emit('roomMessage', {
                        username: 'Server',
                        message: username + ' a placé le mot ' + command[2] + ' en ' + command[1],
                        player: 'server',
                    });
                    sio.to(currentRoom).emit('modification', game.gameBoard.cases, game.playerTurn().name);

                    if (game.player1.user.id === socketId) {
                        sio.to(socketId).emit('tileHolder', game.player1.getLetters(), RoomManager.getGoalsPlayer(game, game.player1));
                        sio.to(currentRoom).emit('updatePoint', 'player1', game.player1.points);
                    } else if (game.player2.user.id === socketId) {
                        sio.to(socketId).emit('tileHolder', game.player2.getLetters(), RoomManager.getGoalsPlayer(game, game.player2));
                        sio.to(currentRoom).emit('updatePoint', 'player2', game.player2.points);
                    }
                }
            } else if (verification !== 'valide') {
                if (game.player1.user.id === socketId) {
                    sio.to(socketId).emit('commandValidated', verification, game.gameBoard.cases, game.player1.letters);
                } else {
                    sio.to(socketId).emit('commandValidated', verification, game.gameBoard.cases, game.player2.letters);
                }
            }
        }
    }

    commandPass(sio: io.Server, identification: IdManager, gameManager: GameManager, socketId: string) {
        const username = identification.getUsername(socketId);
        const currentRoom = identification.getRoom(socketId);
        const game = identification.getGame(socketId);
        if (!game.gameState.gameFinished) {
            if (!game.playerTurnValid(identification.getPlayer(socketId))) {
                sio.to(socketId).emit('commandValidated', " Ce n'est pas ton tour");
            } else {
                sio.to(currentRoom).emit('roomMessage', {
                    username: 'Server',
                    message: username + ' a passé son tour ',
                    player: 'server',
                });
                gameManager.pass(game);
                sio.to(currentRoom).emit('modification', game.gameBoard.cases, game.playerTurn().name);
            }
            sio.to(game.player1.user.id).emit('tileHolder', game.player1.getLetters(), RoomManager.getGoalsPlayer(game, game.player1));
            sio.to(game.player2.user.id).emit('tileHolder', game.player2.getLetters(), RoomManager.getGoalsPlayer(game, game.player2));
        }
    }

    commandReserve(sio: io.Server, identification: IdManager, gameManager: GameManager, socketId: string, command: string[]) {
        const game = identification.getGame(socketId);
        if (gameManager.reserveCommandValid(command)) {
            sio.to(socketId).emit('reserveLetters', gameManager.reserve(game));
        } else {
            sio.to(socketId).emit('commandValidated', 'Format invalide');
        }
    }

    commandHelp(sio: io.Server, identification: IdManager, gameManager: GameManager, socketId: string, command: string[]) {
        if (gameManager.helpCommandValid(command)) {
            sio.to(socketId).emit('commandValidated', command);
            sio.to(socketId).emit('helpInformation', helpInformation);
        } else {
            sio.to(socketId).emit('commandValidated', 'Format invalide');
        }
    }

    commandExchange(sio: io.Server, identification: IdManager, gameManager: GameManager, socketId: string, command: string[]) {
        const game = identification.getGame(socketId);
        if (!game.playerTurnValid(identification.getPlayer(socketId))) {
            sio.to(socketId).emit('commandValidated', " Ce n'est pas ton tour");
        } else {
            const verification: string = gameManager.exchangeVerification(command, game);
            let player2: string;

            if (socketId === game.player1.user.id) {
                player2 = game.player2.user.id;
            } else {
                player2 = game.player1.user.id;
            }

            if (verification === 'valide') {
                sio.to(socketId).emit('roomMessage', {
                    username: 'Server',
                    message: 'Vous avez échangé les lettres ' + command[1],
                    player: 'server',
                });
                sio.to(player2).emit('roomMessage', {
                    username: 'Server',
                    message: 'Votre adversaire a échangé ' + command[1].length + ' lettres',
                    player: 'server',
                });
                gameManager.exchange(command, game);

                sio.to(game.player1.user.room).emit('modification', game.gameBoard.cases, game.playerTurn().name);
                sio.to(game.player1.user.id).emit('tileHolder', game.player1.getLetters(), RoomManager.getGoalsPlayer(game, game.player1));
                sio.to(game.player2.user.id).emit('tileHolder', game.player2.getLetters(), RoomManager.getGoalsPlayer(game, game.player2));
            } else {
                sio.to(socketId).emit('commandValidated', verification);
            }
        }
    }

    commandClue(sio: io.Server, identification: IdManager, gameManager: GameManager, socketId: string, command: string[]) {
        const game = identification.getGame(socketId);
        if (!game.playerTurnValid(identification.getPlayer(socketId))) {
            sio.to(socketId).emit('commandValidated', " Ce n'est pas ton tour");
        } else {
            if (gameManager.clueCommandValid(command)) {
                const validation = gameManager.formatClueCommand(game);
                sio.to(socketId).emit('cluesMessage', validation);
            } else {
                sio.to(socketId).emit('commandValidated', 'Format invalide');
            }
        }
    }
}
