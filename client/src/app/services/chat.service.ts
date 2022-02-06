import { Injectable } from '@angular/core';
import { SocketClientService } from './socket-client.service';

@Injectable({
    providedIn: 'root',
})
export class ChatService {
    
    username ="";
    room="";
  
    roomMessage = '';
    currentRoom ='';
    roomMessages: any[] = [];

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
        


        // Gérer l'événement envoyé par le serveur : afficher le résultat de validation
        this.socketService.on('wordValidated', (isValid: boolean) => {
           
        });

        this.socketService.on('commandValidated', (isValid: boolean) => {
            
        });

        

        // Gérer l'événement envoyé par le serveur : afficher le message envoyé par un membre de la salle
        this.socketService.on('roomMessage', (roomMessage: any) => {
            this.roomMessages =roomMessage;
            
        });
    }

    sendWordValidation() {
        this.socketService.send('validate');
    }

    

  

    joinRoom() {
        console.log(this.room)
        this.socketService.socket.emit('joinRoom',this.username,this.room);
        
    }
  
    sendToRoom() {
        this.socketService.send('roomMessage', this.roomMessage);
        this.roomMessage = '';
    }

    messageLengthError() {
        
    }

    commandError(): void {
      
    }
}
