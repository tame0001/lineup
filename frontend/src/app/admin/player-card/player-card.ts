import {
  Component,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
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
  private _backend = inject(BackendService);
  player = input.required<Player>();
  cardClass = signal<string>('out');
  rsvpInput = input<boolean>(false);
  rsvp = signal<RSVP | null>(null);
  weekID = input.required<number>();
  rsvpOutput = output();

  constructor() {
    effect(() => {
      const rsvp: RSVP = {
        user_id: this.player().id,
        week_id: this.weekID(),
        status: this.rsvpInput(),
      };
      this.rsvp.set(rsvp);
    });

    effect(() => {
      const cardClass = this.rsvp() && this.rsvp()!.status ? '' : 'out';
      this.cardClass.set(cardClass);
    });
  }

  setRSVP(status: boolean) {
    this.rsvp.set({
      user_id: this.player().id,
      week_id: this.weekID(),
      status,
    });
    this._backend.postPlayerRSVP(this.rsvp()!).subscribe(() => {
      // Emit an event to update number of RSVPs in the parent component
      this.rsvpOutput.emit();
    });
  }
}
