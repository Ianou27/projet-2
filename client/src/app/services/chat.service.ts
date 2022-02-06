import { Injectable } from '@angular/core';
import { SocketClientService } from './socket-client.service';

@Injectable({
    providedIn: 'root',
})
export class ChatService {
    serverMessage: string = '';
    serverClock: Date;
    username ="";

    wordInput = '';
    serverValidationResult = '';
    messageToServer = '';

    broadcastMessage = '';
    serverMessages: string[] = [];

    roomMessage = '';
    roomMessages: string[] = [];

    constructor(public socketService: SocketClientService) {}

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

        this.socketService.on('commandValidated', (isValid: boolean) => {
            isValid ? this.broadcastMessageToAll() : this.commandError();
        });

        // Gérer l'événement envoyé par le serveur : afficher le message envoyé par un client connecté
        this.socketService.on('massMessage', (broadcastMessage: string) => {
            this.serverMessages.push(broadcastMessage);
        });

        // Gérer l'événement envoyé par le serveur : afficher le message envoyé par un membre de la salle
        this.socketService.on('roomMessage', (roomMessage: string) => {
            this.roomMessages.push(roomMessage);
        });
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
        this.socketService.send('joinRoom',this.username);
        
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
