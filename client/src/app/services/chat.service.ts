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
    roomMessages: any[] = [];
    playerJoined:boolean =false;
    socketWantToJoin:any;
 

    informationToJoin:any;
    gotAccepted:boolean =false;

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

        this.socketService.on('didJoin', (didJoin:boolean) => {
            this.playerJoined=didJoin;
         
  
            
        });

        this.socketService.on('joining', (obj:any) => {
            this.gotAccepted=true;
            this.informationToJoin= obj;
         
  
            
        });
        this.socketService.socket.on('asked', ( username:string,socket:any,roomObj:any) => {
            
            this.socketWantToJoin = socket;
            this.playerJoined=true;
    
            this.informationToJoin={
                username,
                roomObj
            }

            
  
            
        });

    }

    sendWordValidation() {
        this.socketService.send('validate');
    } 

    

    updateRooms(){ 
        this.socketService.send('updateRoom',this.allRooms);
    }
    
    askJoin(username:string, room:any){
        this.socketService.socket.emit('askJoin',username,room);
    }
 
    accepted(){

        this.socketService.socket.emit('accepted',this.socketWantToJoin,this.informationToJoin);
    }
 
    createRoom(username:string, room:string) {
       
        this.socketService.socket.emit('createRoom',username,room);
        this.updateRooms();
         
    }

    joinRoom(){
     
        
        this.socketService.socket.emit('joinRoom',this.informationToJoin.username,this.informationToJoin.roomObj);
        
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
