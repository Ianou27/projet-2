import { Injectable } from '@angular/core';
import { Tile } from './../../../../common/tile/Tile';
import { InfoToJoin, Message, Room } from './../../../../common/types';
import { INITIAL_NUMBER_LETTERS_RESERVE, NUMBER_LETTER_TILEHOLDER } from './../constants/general-constants';
import { BoardService } from './board.service';
import { SocketClientService } from './socket-client.service';
import { TileHolderService } from './tile-holder/tile-holder.service';
@Injectable({
    providedIn: 'root',
})
export class ChatService {
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
        this.socketService.on('commandValidated', (message: string) => {
            this.roomMessages.push({ username: 'Server', message, player: 'server' });
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
        this.socketService.socket.on('updateReserve', (reserve: number, player1: number, player2: number) => {
            this.player1ChevaletLetters = player1;
            this.player2ChevaletLetters = player2;
            this.reserve = reserve;
        });

        this.socketService.on('roomMessage', (roomMessage: Message) => {
            this.roomMessages.push(roomMessage);
        });

        this.socketService.on('rooms', (rooms: Room[]) => {
            this.allRooms = rooms;
        });

        this.socketService.on('didJoin', (didJoin: boolean) => {
            this.playerJoined = didJoin;
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

    createRoom(username: string, room: string) {
        this.socketService.socket.emit('createRoom', username, room);
        this.updateRooms();
    }

    joinRoom() {
        this.socketService.socket.emit('joinRoom', this.informationToJoin.username, this.informationToJoin.roomObj);
        this.updateRooms();
    }
    passerTour() {
        this.socketService.send('passer');
    }
    sendToRoom() {
        this.socketService.send('roomMessage', this.roomMessage);
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
}
