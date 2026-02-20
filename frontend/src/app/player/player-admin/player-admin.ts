import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  // Get the player ID from the route parameters
  private activatedRoute = inject(ActivatedRoute);
  readonly playerID = this.activatedRoute.snapshot.paramMap.get('id');
  // Fetch player data from the database
  player$: Observable<Player> = this._backend.getPlayer(Number(this.playerID));

  changePlayerActiveStatus(isActive: boolean) {
    this._backend
      .changePlayerActiveStatus(Number(this.playerID), isActive)
      .subscribe((updatedPlayer) => {
        // Update the player$ observable with the new player data
        console.log('Player active status updated:', updatedPlayer);
      });
  }
}
