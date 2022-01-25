import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss']
})
export class TextInputComponent implements AfterViewInit {

  constructor() { }

  @Output() newTextEvent = new EventEmitter<string>();
  
  addNewText(text: string){
    this.newTextEvent.emit(text);
  }

  ngAfterViewInit(): void {

  }

}
