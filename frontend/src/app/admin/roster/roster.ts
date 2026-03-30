import { Component, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { BackendService } from '../../backend-service';
import { Player } from '../../data-interface';

@Component({
  selector: 'app-roster',
  imports: [MatCardModule],
  templateUrl: './roster.html',
  styleUrl: './roster.scss',
})
export class Roster implements OnInit {
  private _backend = inject(BackendService);
  roster = signal<Player[]>([]); // All players fetched from the backend

  ngOnInit() {
    // Fetch the roster data from the backend when the component initializes
    this._backend.getPlayers().subscribe((roster) => {
      // Sort players alphabetically by name
      roster = roster.sort((a, b) => a.name.localeCompare(b.name));
      // update roster list
      this.roster.set(roster);
    });
  }
}
