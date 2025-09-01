import { Component, inject, signal, WritableSignal } from '@angular/core';

import { PlayerCard } from './player-card/player-card';
import { BackendService } from '../backend-service';
import { Player } from '../data-interface';

@Component({
  selector: 'app-admin',
  imports: [PlayerCard],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin {
  private _backend = inject(BackendService);
  players: WritableSignal<Player[]> = signal([]);

  constructor() {
    this._backend.getPlayers().subscribe((players) => {
      players = players.sort((a, b) => a.name.localeCompare(b.name));
      // set temporary status to fallback value
      players = players.map((player) => ({
        ...player,
        rsvp: player.rsvp ?? false,
      }));
      this.players.set(players);
    });
  }
}
