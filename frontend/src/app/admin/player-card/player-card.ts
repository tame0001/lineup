import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-player-card',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './player-card.html',
  styleUrls: ['./player-card.scss'],
})
export class PlayerCard {
  playerName = input<string>('Player Name');
}
