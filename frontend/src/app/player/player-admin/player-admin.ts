import { Component, effect, inject, input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';

import { BackendService } from '../../backend-service';
import { Player } from '../../data-interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-player-admin',
  imports: [
    AsyncPipe,
    MatButtonToggleModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './player-admin.html',
  styleUrl: './player-admin.scss',
  providers: [provideNativeDateAdapter()],
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

  changePlayerPaidStatus(isPaid: boolean) {
    this._backend
      .changePlayerPaidStatus(this.playerID()!, isPaid)
      .subscribe((updatedPlayer) => {
        // Update the player$ observable with the new player data
        console.log('Player paid status updated:', updatedPlayer);
      });
  }

  changeActiveSinceDate(date: Date | null) {
    console.log('Changing active since date to:', date);
    // Check if date is not null before making the API call
    if (date) {
      this._backend
        .changePlayerActiveSinceDate(this.playerID()!, date)
        .subscribe((updatedPlayer) => {
          // Update the player$ observable with the new player data
          console.log('Player active since date updated:', updatedPlayer);
        });
    }
  }

  changeInactiveSinceDate(date: Date | null) {
    console.log('Changing inactive since date to:', date);
    // Check if date is not null before making the API call
    if (date) {
      this._backend
        .changePlayerInactiveSinceDate(this.playerID()!, date)
        .subscribe((updatedPlayer) => {
          // Update the player$ observable with the new player data
          console.log('Player inactive since date updated:', updatedPlayer);
        });
    }
  }

  changePlayerActiveStatus(isActive: boolean) {
    const currentDate = new Date();
    // If changing to active, set active_since to current date
    if (isActive) {
      this.changeActiveSinceDate(currentDate);
    }
    // If changing to inactive, set inactive_since to current date
    else {
      this.changeInactiveSinceDate(currentDate);
    }
  }
}
