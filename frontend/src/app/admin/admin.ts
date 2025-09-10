import { Component, effect, inject, signal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';

import { PlayerCard } from './player-card/player-card';
import { BackendService } from '../backend-service';
import { Player } from '../data-interface';
import { SelectWeek } from '../select-week/select-week';

@Component({
  selector: 'app-admin',
  imports: [PlayerCard, SelectWeek, MatInputModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin {
  private _backend = inject(BackendService);
  players = signal<Player[]>([]);
  filteredPlayers = signal<Player[]>([]);
  rsvps = signal<number[]>([]);
  weekID = signal<number>(1);
  filteredPlayerName = signal<string>('');

  constructor() {
    this._backend.getPlayers().subscribe((players) => {
      players = players.sort((a, b) => a.name.localeCompare(b.name));
      this.players.set(players);
    });

    effect(() => {
      this._backend.getWeekRSVPs(this.weekID()).subscribe((rsvps) => {
        this.rsvps.set(rsvps.map((rsvp) => rsvp.user_id));
      });
    });
    effect(() => {
      const filter = this.filteredPlayerName().toLowerCase();
      if (!filter) {
        this.filteredPlayers.set([...this.players()]);
      } else {
        this.filteredPlayers.set(
          this.players().filter((player) =>
            player.name.toLowerCase().includes(filter)
          )
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
