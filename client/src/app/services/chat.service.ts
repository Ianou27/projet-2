import { Injectable } from '@angular/core';
import { SocketClientService } from './socket-client.service';

@Injectable({
    providedIn: 'root',
})
export class ChatService {
    
    username ="";
    room="";
    allRooms:any[]=[];
    roomMessage = '';
    currentRoom ='';
    roomMessages: any[] = [];
    playerJoined:boolean =false;
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
            this.updateRooms();
            
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
        this.socketService.on('roomMessage', (roomMessage: string[]) => {
            this.roomMessages =roomMessage;
            
        });

        this.socketService.on('rooms', (rooms: any[]) => {
            this.allRooms =rooms;
            
        });

        this.socketService.on('salut', (testa:boolean) => {
            this.playerJoined=testa;
            console.log("YOUPIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII");
            
        });
    }

    sendWordValidation() {
        this.socketService.send('validate');
    }

    

    updateRooms(){ 
        this.socketService.send('updateRoom',this.allRooms);
    }
 

    createRoom(username:string, room:string) {
       
        this.socketService.socket.emit('createRoom',username,room);
        this.updateRooms();
        
    }

    joinRoom(username:string, room:string){
        this.socketService.socket.emit('joinRoom',username,room);
        this.playerJoined=true;
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