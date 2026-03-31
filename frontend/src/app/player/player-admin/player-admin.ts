import { Component, effect, inject, input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { BackendService } from '../../backend-service';
import { Player } from '../../data-interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-player-admin',
  imports: [AsyncPipe, MatButtonToggleModule],
  templateUrl: './player-admin.html',
  styleUrl: './player-admin.scss',
})
export class PlayerAdmin {
  private _backend = inject(BackendService);
  // Get the player ID from input
  playerID = input<number>();
  player$?: Observable<Player>;

  constructor() {
    effect(() => {
      // Fetch player data from the database
      this.player$ = this._backend.getPlayer(this.playerID()!);
    });
  }

  changePlayerActiveStatus(isActive: boolean) {
    this._backend
      .changePlayerActiveStatus(this.playerID()!, isActive)
      .subscribe((updatedPlayer) => {
        // Update the player$ observable with the new player data
        console.log('Player active status updated:', updatedPlayer);
      });
  }
}
