import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe } from '@angular/common';

import { BackendService } from '../../backend-service';
import { Player } from '../../data-interface';

@Component({
  selector: 'app-player-admin',
  imports: [AsyncPipe],
  templateUrl: './player-admin.html',
  styleUrl: './player-admin.scss',
})
export class PlayerAdmin {
  private _backend = inject(BackendService);
  // Get the player ID from the route parameters
  private activatedRoute = inject(ActivatedRoute);
  readonly playerID = this.activatedRoute.snapshot.paramMap.get('id');
  player!: Player;

  constructor() {
    // Fetch player data from the database

    this._backend.getPlayer(Number(this.playerID)).subscribe((player) => {
      this.player = player;
    });
  }
}
