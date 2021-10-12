import { Component } from '@angular/core';

@Component({
  selector: 'app-volleyball',
  templateUrl: './volleyball.component.html',
  styleUrls: ['./volleyball.component.css']
})
export class VolleyballComponent {

  position:Array<string> = [
    'OH',
    'MB',
    'SET',
    'OH',
    'MB',
    'OPP'
  ];
  constructor() { }

  substitute(){
    console.log(this.position);
  }

  rotate(){
    let temp = this.position[0];
    for (let index = 0;
         index < this.position.length -1;
         index++) {
      this.position[index] = this.position[index+1]
    }
    this.position[5] = temp;
  }
}
