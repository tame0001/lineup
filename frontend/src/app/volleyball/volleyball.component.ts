import { Component } from '@angular/core';

@Component({
  selector: 'app-volleyball',
  templateUrl: './volleyball.component.html',
  styleUrls: ['./volleyball.component.css']
})
export class VolleyballComponent {

  pos4:String = "" ;
  constructor() { }

  substitute(){
    console.log(this.pos4);
  }

}
