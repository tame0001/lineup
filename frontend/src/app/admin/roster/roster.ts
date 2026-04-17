import { Component, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { BackendService } from '../../backend-service';
import { Player } from '../../data-interface';
import { PlayerAdmin } from '../../player/player-admin/player-admin';

@Component({
  selector: 'app-roster',
  imports: [
    MatCardModule,
    PlayerAdmin,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
  ],
  templateUrl: './roster.html',
  styleUrl: './roster.scss',
})
export class Roster implements OnInit {
  private _backend = inject(BackendService);
  roster = signal<Player[]>([]); // All players fetched from the backend
  selectedPlayer = signal<Player | null>(null); // Player selected for editing
  // Filter options for the roster list
  filterOptions = [
    { value: 'all', label: 'All Players' },
    { value: 'active', label: 'Active Players' },
    { value: 'inactive', label: 'Inactive Players' },
  ];
  // Currently selected filter
  selectedFilter = signal('all');

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
