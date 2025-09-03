import { Component, inject, signal, WritableSignal } from '@angular/core';

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
export class Admin {
  private _backend = inject(BackendService);
  players: WritableSignal<Player[]> = signal([]);

  constructor() {
    this._backend.getPlayers().subscribe((players) => {
      players = players.sort((a, b) => a.name.localeCompare(b.name));
      this.players.set(players);
    });
  }
}
