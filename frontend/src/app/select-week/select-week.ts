import { Component, effect, inject, signal, output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

import { MatchDay } from '../data-interface';
import { BackendService } from '../backend-service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-select-week',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    DatePipe,
  ],
  templateUrl: './select-week.html',
  styleUrl: './select-week.scss',
})
export class SelectWeek {
  private _backend = inject(BackendService);
  matchDays = signal<MatchDay[]>([]);
  selectedMatchDay = signal<number | null>(null);
  matchDayID = output<number>();

  constructor() {
    this._backend.getMatchDays().subscribe((matchDays) => {
      this.matchDays.set(matchDays);
    });

    effect(() => {
      const today = new Date().toISOString().split('T')[0];
      const nextMatch = this.matchDays()
        .filter((day) => day.date >= today)
        .sort((a, b) => a.date.localeCompare(b.date))[0];
      if (nextMatch) {
        this.selectedMatchDay.set(nextMatch.id);
      }
    });

    effect(() => {
      if (this.selectedMatchDay()) {
        this.matchDayID.emit(this.selectedMatchDay()!);
      }
    });
  }
}
