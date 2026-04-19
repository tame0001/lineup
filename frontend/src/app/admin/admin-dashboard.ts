import { Component, effect, inject, signal, OnInit } from '@angular/core';

import { PlayerCard } from './player-card/player-card';
import { BackendService } from '../backend-service';
import { Player } from '../data-interface';
import { SelectWeek } from '../select-week/select-week';

@Component({
  selector: 'app-admin-dashboard',
  imports: [PlayerCard, SelectWeek],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboard implements OnInit {
  private _backend = inject(BackendService);
  players = signal<Player[]>([]); // All players fetched from the backend
  activePlayers = signal<Player[]>([]); // Only active players
  rsvps = signal<number[]>([]); // List of user IDs who have RSVP'd 'in'
  weekID = signal<number>(0); // Currently selected week ID
  nPlayerIn = signal<number>(0); // Number of players who have RSVP'd 'in'

  constructor() {
    effect(() => {
      // Preventing fetching RSVPs for weekID 0, which is the initial state
      if (this.weekID() > 0) {
        // Update player list. Only keep active players
        // First, need to get match day
        this._backend.getWeekDetails(this.weekID()).subscribe((matchDay) => {
          const matchDate = new Date(matchDay.date);
          // Active players are those whose active_since date is before the match day
          // and inactive_since date is after the match day (or null)
          this.activePlayers.set(
            this.players().filter((player) => {
              // Extract active_since date
              const activeSince = this.extractDate(player.active_since);
              // Extract inactive_since date
              const inactiveSince = this.extractDate(player.inactive_since);
              // Apply the filtering logic
              return (
                (!activeSince || activeSince <= matchDate) &&
                (!inactiveSince || inactiveSince >= matchDate)
              );
            }),
          );
        });
        // Fetch RSVPs for the selected week and update the rsvps signal
        this._backend.getWeekRSVPs(this.weekID()).subscribe((rsvps) => {
          // Extract user IDs from the RSVPs
          this.rsvps.set(rsvps.map((rsvp) => rsvp.user_id));
          // Count how many players have RSVP'd
          this.nPlayerIn.set(this.rsvps().length);
        });
      }
    });
  }

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

  updateWeekID(weekID: number) {
    // Update the weekID signal when a new week is selected
    this.weekID.set(weekID);
  }

  extractDate(dateString: string | null): Date | null {
    // Helper function to convert date string to Date object, handling null values
    return dateString ? new Date(dateString) : null;
  }
}
