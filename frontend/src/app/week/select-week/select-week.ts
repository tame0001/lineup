import { Component, effect, inject, signal, output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { MatchDay } from '../../data-interface';
import { BackendService } from '../../backend-service';

@Component({
  selector: 'app-select-week',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatDatepickerModule,
  ],
  templateUrl: './select-week.html',
  styleUrl: './select-week.scss',
})
export class SelectWeek {
  private _backend = inject(BackendService);
  matchDays = signal<MatchDay[]>([]);
  selectedMatchDayID = signal<number | null>(null);
  matchDayID = output<number>();
  // An array of match day's date in timestamp format
  matchDayDates = signal<number[] | null>(null);

  matchDayFilter = (date: Date | null): boolean => {
    // Only allow selection of dates that are in the matchDays list
    if (!date) return false;
    return this.matchDayDates()?.includes(date.setHours(0, 0, 0, 0)) ?? false;
  };

  constructor() {
    // Fetch match days from the backend and populate the matchDays signal
    this._backend.getMatchDays().subscribe((matchDays) => {
      this.matchDays.set(matchDays);
      // Extract just the dates for the datepicker filter
      this.matchDayDates.set(
        matchDays.map((day) => new Date(day.date).setHours(0, 0, 0, 0)),
      );
      console.log('Fetched match days:', this.matchDayDates());
    });

    effect(() => {
      const today = new Date();
      // Automatically select the next upcoming match day by default
      const nextMatch = this.matchDays()
        .filter((day) => day.date >= today)
        .sort((a, b) => a.date.getTime() - b.date.getTime())[0];
      if (nextMatch) {
        this.selectedMatchDayID.set(nextMatch.id);
      }
    });

    effect(() => {
      // Emit the selected match day ID whenever it changes
      if (this.selectedMatchDayID()) {
        this.matchDayID.emit(this.selectedMatchDayID()!);
      }
    });
  }

  onMatchDaySelected(matchDay: Date) {
    console.log('Selected Match Day ID:', matchDay);
  }
}
