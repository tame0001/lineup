import { Component, effect, inject, input, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { Player, RSVP } from '../../data-interface';
import { BackendService } from '../../backend-service';

@Component({
  selector: 'app-player-card',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './player-card.html',
  styleUrls: ['./player-card.scss'],
})
export class PlayerCard {
  player = input.required<Player>();
  cardClass = signal<string>('out');
  rsvp = signal<RSVP | null>(null);

  private _backend = inject(BackendService);

  constructor() {
    effect(() => {
      this._backend.getPlayerRSVP(this.player().id, 1).subscribe((rsvp) => {
        this.rsvp.set(rsvp);
      });
    });

    effect(() => {
      let cardClass = this.rsvp() && this.rsvp()!.status ? '' : 'out';
      this.cardClass.set(cardClass);
    });
  }

  setRSVP(status: boolean) {
    this.rsvp.set({ user_id: this.player().id, week_id: 1, status });
    console.log('Sending new RSVP for', this.player().name, this.rsvp());
  }
}
