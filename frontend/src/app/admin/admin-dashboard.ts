import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  MatBottomSheetModule,
  MatBottomSheet,
} from '@angular/material/bottom-sheet';

import { PlayerCard } from './player-card/player-card';
import { BackendService } from '../backend-service';
import { Player } from '../data-interface';
import { SelectWeek } from '../week/select-week/select-week';
import { AddWeek } from '../week/add-week/add-week';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    PlayerCard,
    SelectWeek,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatBottomSheetModule,
  ],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboard implements OnInit {
  private _backend = inject(BackendService);
  private _addWeekSheet = inject(MatBottomSheet);
  players = signal<Player[]>([]); // All players fetched from the backend during onInit
  weekID = signal<number>(0); // Currently selected week ID

  matchDayResource = rxResource({
    // When weekID changes, fetch the match day details for that week
    // Return value has a date of the match day
    params: () => {
      const weekID = this.weekID();
      // Only fetch match day details if weekID is greater than 0
      return weekID > 0 ? { weekID } : undefined;
    },
    stream: ({ params }) => this._backend.getWeekDetails(params.weekID),
  });

  activePlayers = computed(() => {
    // If match day details are not available or players have not been fetched yet,
    // return an empty list
    if (!this.matchDayResource.hasValue() || this.players().length === 0) {
      return [];
    }
    // A list of players that are still active for the selected match day.
    const matchDay = this.matchDayResource.value().date;
    // Apply the filtering logic
    return this.players().filter((player) => {
      // Active players are those whose active_since date is before the match day
      // and inactive_since date is after the match day (or null)
      const activeSince = player.active_since;
      const inactiveSince = player.inactive_since;
      return (
        (!activeSince || activeSince <= matchDay) &&
        (!inactiveSince || inactiveSince >= matchDay)
      );
    });
  });

  rsvpResource = rxResource({
    // When weekID changes, fetch the RSVPs for that week
    // The return of player IDs that have RSVP'd 'in'
    params: () => {
      const weekID = this.weekID();
      // Only fetch RSVPs if weekID is greater than 0
      return weekID > 0 ? { weekID } : undefined;
    },
    stream: ({ params }) => this._backend.getWeekRSVPs(params.weekID),
  });

  rsvps = computed(() => {
    // If RSVPs have not been fetched yet, return an empty list
    if (!this.rsvpResource.hasValue()) {
      return [];
    }
    // Extract user IDs from the RSVPs
    return this.rsvpResource.value().map((rsvp) => rsvp.user_id);
  });

  rsvpCount = computed(() => this.rsvps().length); // Number of players who have RSVP'd 'in'

  ngOnInit() {
    this._backend
      // Fetch players from the backend
      .getPlayers()
      .subscribe((players) => {
        // Sort players alphabetically by name
        players = players.sort((a, b) => a.name.localeCompare(b.name));
        // update player list
        this.players.set(players);
      });
  }

  RSVPChange() {
    // Update the count of players from player-card component output signal
    this.rsvpResource.reload(); // Reload RSVPs to get the updated that sync with the backend
  }

  openAddWeekSheet() {
    // Open the bottom sheet for adding a new week
    this._addWeekSheet.open(AddWeek);
  }
}
