import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChatService } from '@app/services/chat.service';
import { JoinPageComponent } from '@app/pages/join-page/join-page.component';
@Component({
  selector: 'app-waiting-player-two',
  templateUrl: './waiting-player-two.component.html',
  styleUrls: ['./waiting-player-two.component.scss']
})
export class WaitingPlayerTwoComponent implements OnInit {
  
  constructor(private multiplayerDialog: MatDialog, public chatService: ChatService) { }

  ngOnInit(): void {
  }
  
  join(){
    this.multiplayerDialog.closeAll();
    this.chatService.joinRoom();
    this.chatService.gotAccepted=false;


}
refused(){
  this.multiplayerDialog.open(JoinPageComponent, {
    disableClose: true,
  });
  this.chatService.gotRefused = false;
  }
}
