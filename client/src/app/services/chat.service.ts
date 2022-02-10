import { Injectable } from '@angular/core';
import { Tile } from './../../../../common/tile/Tile';
import { BoardService } from './board.service';
import { SocketClientService } from './socket-client.service';
import { TileHolderService } from './tile-holder/tile-holder.service';

@Injectable({
    providedIn: 'root',
})
export class ChatService {
    serverMessage: string = '';
    serverClock: Date;

    wordInput = '';
    serverValidationResult = '';
    messageToServer = '';

    broadcastMessage = '';
    serverMessages: string[] = [];
    // lastCommandProcessed: string;

    roomMessage = '';
    roomMessages: string[] = [];

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
        }
    }

    configureBaseSocketFeatures() {
        this.socketService.on('connect', () => {
            console.log(`Connexion par WebSocket sur le socket ${this.socketId}`);
        });
        // Afficher le message envoyé lors de la connexion avec le serveur
        this.socketService.on('hello', (message: string) => {
            this.serverMessage = message;
        });

        // Afficher le message envoyé à chaque émission de l'événement "clock" du serveur
        this.socketService.on('clock', (time: Date) => {
            this.serverClock = time;
        });

        // Gérer l'événement envoyé par le serveur : afficher le résultat de validation
        this.socketService.on('wordValidated', (isValid: boolean) => {
            isValid ? this.broadcastMessageToAll() : this.messageLengthError();
        });

        this.socketService.on('commandValidated', (command: string) => {
            // this.lastCommandProcessed = this.broadcastMessage;
            if (command === '!placer') this.socketService.send('placeFormatVerification', this.broadcastMessage);
            /*
            Il y aura les autres conditions ici
            */
        });

        this.socketService.on('tileHolder', (letters: Tile[]) => {
            this.tileHolderService.tileHolder = letters;
        });

        this.socketService.on('placeFormatValidated', (isValid: boolean) => {
            if (isValid) {
                this.socketService.send('boardVerification', this.broadcastMessage);
            } else {
                this.syntaxError();
            }
            // isValid ? this.socketService.send('boardVerification', this.broadcastMessage) : this.syntaxError();
        });

        this.socketService.on('placeBoardValidated', (isValid: boolean) => {
            if (isValid) {
                this.socketService.send('placeWord', this.broadcastMessage);
            } else {
                this.impossibleCommand();
            }
            // isValid ? this.socketService.send('placeWord', this.broadcastMessage) : this.impossibleCommand();
        });

        // Gérer l'événement envoyé par le serveur : afficher le message envoyé par un client connecté
        this.socketService.on('massMessage', (broadcastMessage: string) => {
            this.serverMessages.push(broadcastMessage);
        });

        this.socketService.on('modification', (updatedBoard: Tile[][]) => {
            this.boardService.board = updatedBoard;
            this.broadcastMessageToAll();
        });

        // Gérer l'événement envoyé par le serveur : afficher le message envoyé par un membre de la salle
        this.socketService.on('roomMessage', (roomMessage: string) => {
            this.roomMessages.push(roomMessage);
        });
    }

    impossibleCommand() {
        this.serverMessages.push('Commande impossible');
        this.broadcastMessage = '';
    }

    syntaxError() {
        this.serverMessages.push('Erreur de syntaxe');
        this.broadcastMessage = '';
    }

    sendWordValidation() {
        this.socketService.send('validate', this.broadcastMessage);
    }

    sendToServer() {
        this.socketService.send('message', this.messageToServer);
        this.messageToServer = '';
    }

    broadcastMessageToAll() {
        this.socketService.send('broadcastAll', this.broadcastMessage);
        this.broadcastMessage = '';
    }

    joinRoom() {
        this.socketService.send('joinRoom');
    }

    sendToRoom() {
        this.socketService.send('roomMessage', this.roomMessage);
        this.roomMessage = '';
    }

    messageLengthError() {
        this.serverMessages.push('Votre message est trop long');
        this.broadcastMessage = '';
    }

    commandError(): void {
        this.serverMessages.push('Commande non reconnue');
        this.broadcastMessage = '';
    }
}
