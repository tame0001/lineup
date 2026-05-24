import { Component, inject, input } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatExpansionModule } from '@angular/material/expansion';

import { BackendService } from '../../backend-service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-player-admin',
  imports: [
    MatButtonToggleModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatGridListModule,
    MatExpansionModule,
  ],
  templateUrl: './player-admin.html',
  styleUrl: './player-admin.scss',
})
export class PlayerAdmin {
  private _backend = inject(BackendService);
  // Get the player ID from input
  playerID = input.required<number>();
  playerResource = rxResource({
    params: () => ({ playerId: this.playerID() }),
    stream: ({ params }) => this._backend.getPlayer(params.playerId),
  });

  changePlayerPaidStatus(isPaid: boolean) {
    this._backend
      .changePlayerPaidStatus(this.playerID()!, isPaid)
      .subscribe((updatedPlayer) => {
        // Update the player$ observable with the new player data
        console.log('Player paid status updated:', updatedPlayer);
      });
  }

  changePlayerActiveStatus(isActive: boolean, date?: Date | null) {
    // This function handles status changes. The use cases are:
    // 1. Changing isActive status: this function use today date to set active_since or inactive_since depending on the new status.
    // 2. Changing active_since or inactive_since date: function will take the new date and set it to active_since or inactive_since.

    const currentDate = date || new Date(); // If date is not provided, use today date.
    const request = isActive
      ? // If changing to active, set active_since to current date
        this._backend.changePlayerActiveStatus(this.playerID()!, {
          // Only need to set active_since, the backend will handle setting isActive to true
          active_since: currentDate,
        })
      : // If changing to inactive, set inactive_since to current date
        this._backend.changePlayerActiveStatus(this.playerID()!, {
          // Only need to set inactive_since, the backend will handle setting isActive to false
          inactive_since: currentDate,
        });
    // Subscribe to the request
    request.subscribe((updatedPlayerInfo) => {
      // Verify that the player's active status has been updated correctly
      if (isActive && updatedPlayerInfo.is_active) {
        // Status is correct
        console.log(
          'Player active status updated correctly:',
          updatedPlayerInfo,
        );
      } else {
        // Status is incorrect
        console.log(
          `Player active status updated is incomplete: expected is_active to be ${isActive}, but got ${updatedPlayerInfo.is_active}`,
        );
      }
    });
  }
}
