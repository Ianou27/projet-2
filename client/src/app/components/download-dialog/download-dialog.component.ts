import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ClientSocketHandler } from '@app/services/client-socket-handler/client-socket-handler.service';

@Component({
  selector: 'app-download-dialog',
  templateUrl: './download-dialog.component.html',
  styleUrls: ['./download-dialog.component.scss']
})
export class DownloadDialogComponent implements OnInit {

  constructor(public socketHandler: ClientSocketHandler,private sanitizer: DomSanitizer) { }
  dicName: string ='dict';
  downloadJsonHref:any;
  ngOnInit(): void {
  }
  generateDownloadJsonUri() {
    const theJSON = this.socketHandler.dictionaryToDownload.toString();
    this.dicName = JSON.parse(this.socketHandler.dictionaryToDownload).title;
    const uri = this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(theJSON));
    this.downloadJsonHref = uri;
}
}
