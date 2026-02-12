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
  readonly playerID = this.activatedRoute.snapshot.paramMap.get('id');
}
