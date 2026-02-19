import { Component, effect, inject, signal, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { PlayerCard } from './player-card/player-card';
import { BackendService } from '../backend-service';
import { Player } from '../data-interface';
import { SelectWeek } from '../select-week/select-week';

@Component({
  selector: 'app-admin',
  imports: [
    PlayerCard,
    SelectWeek,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin implements OnInit {
  private _backend = inject(BackendService);
  players = signal<Player[]>([]); // All players fetched from the backend
  filteredPlayers = signal<Player[]>([]);
  rsvps = signal<number[]>([]);
  weekID = signal<number>(1);
  filteredPlayerName = signal<string>('');
  n_player_in = signal<number>(0); // Number of players who have RSVP'd 'in'

  constructor() {
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
        this.players.set(players);
      });

    effect(() => {
      this._backend.getWeekRSVPs(this.weekID()).subscribe((rsvps) => {
        this.rsvps.set(rsvps.map((rsvp) => rsvp.user_id));
        this.n_player_in.set(this.rsvps().length);
      });
    });

    effect(() => {
      const filter = this.filteredPlayerName().toLowerCase();
      if (!filter) {
        this.filteredPlayers.set([...this.players()]);
      } else {
        this.filteredPlayers.set(
          this.players().filter((player) =>
            player.name.toLowerCase().includes(filter),
          ),
        );
      }
    });
  }

  ngOnInit() {
    this.filteredPlayers.set([...this.players()]);
  }

  updateWeekID(weekID: number) {
    this.weekID.set(weekID);
  }
}
