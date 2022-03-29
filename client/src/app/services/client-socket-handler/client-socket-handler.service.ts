import { Injectable } from '@angular/core';
import { LetterScore } from './../../../../../common/assets/reserve-letters';
import { BotType } from './../../../../../common/botType';
import { CommandType } from './../../../../../common/command-type';
import { NUMBER_MAXIMUM_CLUE_COMMAND } from './../../../../../common/constants/general-constants';
import { Tile } from './../../../../../common/tile/Tile';
import { InfoToJoin, Message, Room } from './../../../../../common/types';
import { INITIAL_NUMBER_LETTERS_RESERVE, NUMBER_LETTER_TILEHOLDER } from './../../constants/general-constants';
import { BoardService } from './../board/board.service';
import { SocketClientService } from './../socket-client/socket-client.service';
import { TileHolderService } from './../tile-holder/tile-holder.service';

@Injectable({
    providedIn: 'root',
})
export class ClientSocketHandler {
    username: string = '';
    room: string = '';

    allRooms: Room[] = [];
    roomMessage: string = '';

    roomMessages: Message[] = [];
    playerJoined: boolean = false;

    socketWantToJoin: string;

    informationToJoin: InfoToJoin;
    gotAccepted: boolean = false;
    gotRefused: boolean = false;
    bestClassicScores: unknown[] = [];
    bestLog2990Scores: unknown[] = [];
    myTurn: boolean = true;
    player1Point: number = 0;
    player2Point: number = 0;
    player1Username: string = '';
    player2Username: string = '';
    player1Turn: string = 'tour';
    player2Turn: string = '';
    player1ChevaletLetters: number = NUMBER_LETTER_TILEHOLDER;
    player2ChevaletLetters: number = NUMBER_LETTER_TILEHOLDER;
    reserve: number = INITIAL_NUMBER_LETTERS_RESERVE;
    gameOver: boolean = false;
    winner: string = '';
    timer: number = 0;
    numberOfRooms: number = 0;

    constructor(public socketService: SocketClientService, public boardService: BoardService, public tileHolderService: TileHolderService) {}

    get socketId() {
        return this.socketService.socket.id ? this.socketService.socket.id : '';
    }

    init(): void {
        this.connect();
    }

    connect() {
        if (!this.socketService.isSocketAlive()) {
            this.socketService.connect();
            this.configureBaseSocketFeatures();
            this.updateRooms();
        }
    }

    configureBaseSocketFeatures() {
        this.socketService.socket.on('commandValidated', (message: string, board: Tile[][], tileHolder: Tile[]) => {
            this.roomMessages.push({ username: 'Server', message, player: 'server' });
            if (board) this.boardService.board = board;
            if (tileHolder) this.tileHolderService.tileHolder = tileHolder;
        });

        this.socketService.on('tileHolder', (letters: Tile[]) => {
            this.tileHolderService.tileHolder = letters;
        });

        this.socketService.socket.on('modification', (updatedBoard: Tile[][], playerTurn: string) => {
            this.boardService.board = updatedBoard;
            if (playerTurn === 'player1') {
                this.player1Turn = 'tour';
                this.player2Turn = '';
            } else {
                this.player1Turn = '';
                this.player2Turn = 'tour';
            }
        });

        this.socketService.on('reserveLetters', (reserve: LetterScore) => {
            for (const letter in reserve) {
                if (Object.prototype.hasOwnProperty.call(reserve, letter)) {
                    const value = reserve[letter];
                    this.roomMessages.push({ player: letter, username: letter, message: value.toString() });
                }
            }
        });

        this.socketService.on('cluesMessage', (clues: string[]) => {
            if (clues.length < NUMBER_MAXIMUM_CLUE_COMMAND)
                this.roomMessages.push({ player: 'Server', username: 'Server', message: 'Moins de 3 placements possibles' });
            clues.forEach((clue) => {
                this.roomMessages.push({ player: 'Server', username: 'Server', message: clue });
            });
        });

        this.socketService.on('helpInformation', (commands: string[]) => {
            commands.forEach((command) => {
                this.roomMessages.push({ player: '', username: '', message: command });
            });
        });

        this.socketService.socket.on('updateReserve', (reserve: number, player1: number, player2: number) => {
            this.player1ChevaletLetters = player1;
            this.player2ChevaletLetters = player2;
            this.reserve = reserve;
        });
        this.socketService.on('turn', (turn: boolean) => {
            this.myTurn = turn;
        });

        this.socketService.on('roomMessage', (roomMessage: Message) => {
            this.roomMessages.push(roomMessage);
        });

        this.socketService.on('rooms', (rooms: Room[]) => {
            this.allRooms = rooms;
            this.updateRoomView();
        });

        this.socketService.on('didJoin', (didJoin: boolean) => {
            this.playerJoined = didJoin;
        });

        this.socketService.socket.on('getBestScore', (scoresClassic: unknown[], scoresLog: unknown[]) => {
            this.bestClassicScores = scoresClassic;
            this.bestLog2990Scores = scoresLog;
        });

        this.socketService.on('joining', (obj: InfoToJoin) => {
            this.gotAccepted = true;
            this.informationToJoin = obj;
        });
        this.socketService.socket.on('startGame', (player1: string, player2: string) => {
            this.player1Username = player1;
            this.player2Username = player2;
        });
        this.socketService.socket.on('endGame', (winner: string) => {
            this.gameOver = true;
            this.winner = winner;
            this.player1Turn = '';
            this.player2Turn = '';
            this.myTurn = false;
        });
        this.socketService.on('refusing', (obj: InfoToJoin) => {
            this.informationToJoin = obj;
            this.gotRefused = true;
        });
        this.socketService.on('timer', (timer: number) => {
            this.timer = timer;
        });

        this.socketService.socket.on('asked', (username: string, socket: string, roomObj: Room) => {
            this.socketWantToJoin = socket;
            this.playerJoined = true;

            this.informationToJoin = {
                username,
                roomObj,
            };
        });

        this.socketService.on('playerDc', () => {
            this.roomMessages.push({ username: 'Server', message: '  Partie interrompue : joueur deconnecté', player: 'server' });
            this.socketService.send('finPartie');
            this.updateRooms();
        });

        this.socketService.socket.on('updatePoint', (player: string, point: number) => {
            if (player === 'player1') {
                this.player1Point = point;
            } else if (player === 'player2') {
                this.player2Point = point;
            }
        });
    }

    updateRooms() {
        this.socketService.send('updateRoom');
    }

    refused() {
        this.socketService.socket.emit('refused', this.socketWantToJoin, this.informationToJoin);
    }
    disconnect() {
        this.socketService.socket.emit('forceDisconnect');
    }
    async getScores() {
        this.socketService.socket.emit('getBestScore');
    }

    createRoom(username: string, room: string, time: string) {
        this.socketService.socket.emit('createRoom', username, room, time);
        this.updateRooms();
    }

    createSoloGame(username: string, time: string, botType: BotType) {
        this.socketService.socket.emit('createSoloGame', username, time, botType);
    }

    joinRoom() {
        this.socketService.socket.emit('joinRoom', this.informationToJoin.username, this.informationToJoin.roomObj);
        this.updateRooms();
    }
    passerTour() {
        this.socketService.send('passer');
    }
    sendToRoom() {
        const command = this.roomMessage.split(' ');
        if (command[0].charAt(0) === '!' && !this.gameOver) {
            switch (command[0]) {
                case CommandType.exchange: {
                    this.socketService.send('echanger', command);
                    break;
                }
                case CommandType.pass: {
                    this.socketService.send('passer');
                    break;
                }
                case CommandType.place: {
                    this.socketService.send('placer', command);
                    break;
                }
                case CommandType.reserve: {
                    this.socketService.send('réserve', command);
                    break;
                }
                case CommandType.clue: {
                    this.socketService.send('indice', command);
                    break;
                }
                case CommandType.help: {
                    this.socketService.send('aide', command);
                    break;
                }
                default: {
                    this.roomMessages.push({ username: 'Server', message: '  Erreur de Syntaxe', player: 'server' });
                }
            }
        } else if (this.roomMessage !== '' && this.roomMessage[0] !== '!') {
            this.socketService.send('roomMessage', this.roomMessage);
        }

        this.roomMessage = '';
    }

    askJoin(username: string, room: Room) {
        this.socketService.socket.emit('askJoin', username, room);
        this.gotRefused = false;
    }

    accepted() {
        this.socketService.socket.emit('accepted', this.socketWantToJoin, this.informationToJoin);
        this.updateRooms();
    }

    cancelCreation() {
        this.socketService.socket.emit('cancelCreation');
        this.updateRooms();
    }
    convertToSoloGame() {
        this.socketService.socket.emit('convertToSoloGame');
    }

    updateRoomView() {
        let counter = 0;
        this.allRooms.forEach((room) => {
            if (room.player2 === '') {
                counter++;
            }
        });
        this.numberOfRooms = counter;
    }
}
