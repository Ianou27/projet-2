import { Injectable } from '@angular/core';
import { Tile } from './../../../../common/tile/Tile';
import { BoardService } from './board.service';
import { SocketClientService } from './socket-client.service';
import { TileHolderService } from './tile-holder/tile-holder.service';

@Injectable({
    providedIn: 'root',
})
export class ChatService {
    //vrai
    username = '';
    room = '';
    allRooms: any[] = [];
    roomMessage = '';
    roomMessages: any[] = [];
    playerJoined: boolean = false;
    socketWantToJoin: any;
    informationToJoin: any;
    gotAccepted: boolean = false;
    gotRefused: boolean = false;

    //
    serverMessage: string = '';
    serverClock: Date;

    wordInput = '';
    serverValidationResult = '';
    messageToServer = '';

    broadcastMessage = '';
    serverMessages: string[] = [];
    // lastCommandProcessed: string;
    constructor(public socketService: SocketClientService, public boardService: BoardService, public tileHolderService: TileHolderService) {}

    get socketId() {
        return this.socketService.socket.id ? this.socketService.socket.id : '';
    }

    ngOnInit(): void {
        this.connect();
    }

    connect() {
        if (!this.socketService.isSocketAlive()) {
            this.socketService.connect();
            this.configureBaseSocketFeatures();
            //enplus
            this.updateRooms();
        }
    }

    configureBaseSocketFeatures() {
        this.socketService.on('connect', () => {
            console.log(`Connexion par WebSocket sur le socket ${this.socketId}`);
        });

        // Gérer l'événement envoyé par le serveur : afficher le résultat de validation
        this.socketService.on('wordValidated', (isValid: boolean) => {});

        this.socketService.on('commandValidated', () => {
            this.roomMessages.push({username:"Server", message:"Commande Invalide"})
            
        });

        this.socketService.on('tileHolder', (letters: Tile[]) => {
            this.tileHolderService.tileHolder = letters;
        });

        this.socketService.on('placeFormatValidated', () => {
            this.roomMessages.push({username:"Server", message:"Format de la commande Invalide"});
        });

        this.socketService.on('placeBoardValidated', () => {
            this.roomMessages.push({username:"Server", message:"Mot impossible a placer "});
        });

        this.socketService.on('modification', (updatedBoard: Tile[][]) => {
            this.boardService.board = updatedBoard;
            //this.broadcastMessageToAll();
        });

        //vrai
        this.socketService.on('roomMessage', (roomMessage: any) => {
            console.log(roomMessage.player);
            this.roomMessages.push(roomMessage);
        });

        this.socketService.on('rooms', (rooms: any[]) => {
            this.allRooms = rooms;
        });

        this.socketService.on('didJoin', (didJoin: boolean) => {
            this.playerJoined = didJoin;
        });

        this.socketService.on('joining', (obj: any) => {
            this.gotAccepted = true;
            this.informationToJoin = obj;
        });

        this.socketService.on('refusing', (obj: any) => {
            this.informationToJoin = obj;
            this.gotRefused = true;
        });
        
        this.socketService.socket.on('asked', (username: string, socket: any, roomObj: any) => {
            this.socketWantToJoin = socket;
            this.playerJoined = true;

            this.informationToJoin = {
                username,
                roomObj,
            };
        });
        this.socketService.on('playerDc', () => {
            this.roomMessages.push({username:"Server", message:"  Partie interrompue : joueur deconnecté"});
            this.socketService.send('deleteRoom');
            this.updateRooms();

        });
    }

    impossibleCommand() {
        this.serverMessages.push('Commande impossible');

    }

    syntaxError() {
        this.serverMessages.push('Erreur de syntaxe');
        this.broadcastMessage = '';
    }
    updateRooms() {
        this.socketService.send('updateRoom', this.allRooms);
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

    sendToRoom() {
        this.socketService.send('roomMessage', this.roomMessage);
        this.roomMessage = '';
    }

    sendWordValidation() {
        this.socketService.send('validate');
    }

    askJoin(username: string, room: any) {
        this.socketService.socket.emit('askJoin', username, room);
        this.gotRefused = false;
    }

    accepted() {
        this.socketService.socket.emit('accepted', this.socketWantToJoin, this.informationToJoin);
        this.updateRooms();
    }

    messageLengthError() {}

    commandError(): void {}
}
