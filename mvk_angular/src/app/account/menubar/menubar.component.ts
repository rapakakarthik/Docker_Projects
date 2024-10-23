import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.scss']
})
export class MenubarComponent implements OnInit{

  @Output() hoverEmit = new EventEmitter();
  
  constructor() {}
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }

  onHover(isHovered: boolean) {
    this.hoverEmit.emit(isHovered)
  }
  
  // hideHover = false;


  // text = "";
  // changeData(text: string) {
  //   // this.array = data;
  //   this.hideHover = true;
  //   this.text = text;
  // }

  // array = [
  //   {
  //     type: 'anchor',
  //     text: 'hello'
  //   },
  //   {
  //     type: 'dropdown',
  //     drop: ['hi', 'hello', 'jow']
  //   },
  // ]
}
