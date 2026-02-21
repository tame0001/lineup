import { Component, effect, inject, signal, OnInit } from '@angular/core';
import { map } from 'rxjs';

import { PlayerCard } from './player-card/player-card';
import { BackendService } from '../backend-service';
import { Player } from '../data-interface';
import { SelectWeek } from '../select-week/select-week';

@Component({
  selector: 'app-admin',
  imports: [PlayerCard, SelectWeek],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin implements OnInit {
  private _backend = inject(BackendService);
  players = signal<Player[]>([]); // All players fetched from the backend
  rsvps = signal<number[]>([]); // List of user IDs who have RSVP'd 'in'
  weekID = signal<number>(0); // Currently selected week ID
  n_player_in = signal<number>(0); // Number of players who have RSVP'd 'in'

  constructor() {
    effect(() => {
      // Preventing fetching RSVPs for weekID 0, which is the initial state
      if (this.weekID() > 0) {
        // Fetch RSVPs for the selected week and update the rsvps signal
        this._backend.getWeekRSVPs(this.weekID()).subscribe((rsvps) => {
          // Extract user IDs from the RSVPs
          this.rsvps.set(rsvps.map((rsvp) => rsvp.user_id));
          // Count how many players have RSVP'd
          this.n_player_in.set(this.rsvps().length);
        });
      }
    });
  }

  ngOnInit() {
    this._backend
      // Fetch players from the backend
      .getPlayers()
      .pipe(
        // Filter out non-active players
        map((players) => players.filter((player) => player.is_active)),
      )
      .subscribe((players) => {
        // Sort players alphabetically by name
        players = players.sort((a, b) => a.name.localeCompare(b.name));
        // update player list
        this.players.set(players);
      });
  }

  updateWeekID(weekID: number) {
    // Update the weekID signal when a new week is selected
    this.weekID.set(weekID);
  }
}
