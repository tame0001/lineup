import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-player',
  imports: [],
  templateUrl: './player.html',
  styleUrl: './player.scss',
})
export class Player {
  private activatedRoute = inject(ActivatedRoute);

  constructor() {
    console.log(this.activatedRoute.snapshot.paramMap.get('id'));
  }
}
