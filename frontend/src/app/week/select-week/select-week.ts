import {
  Component,
  effect,
  inject,
  signal,
  output,
  OnInit,
} from '@angular/core';
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
export class SelectWeek implements OnInit {
  private _backend = inject(BackendService);
  matchDays = signal<MatchDay[]>([]);
  selectedMatchDay = signal<MatchDay | null>(null);
  matchDayID = output<number>();
  // An array of match day's date in timestamp format
  matchDayDates = signal<number[] | null>(null);

  matchDayFilter = (date: Date | null): boolean => {
    // Only allow selection of dates that are in the matchDays list
    if (!date) return false;
    return this.matchDayDates()?.includes(date.setHours(0, 0, 0, 0)) ?? false;
  };

  constructor() {
    effect(() => {
      const today = new Date().setHours(0, 0, 0, 0);
      // Automatically select the next upcoming match day by default
      const nextMatch = this.matchDayDates()
        ?.filter((matchDay) => matchDay >= today)
        .sort((a, b) => a - b)[0];
      if (nextMatch) {
        const nextMatchDay = this.findMatchDayByDate(new Date(nextMatch));
        this.selectedMatchDay.set(nextMatchDay);
      }
    });

    effect(() => {
      // Emit the selected match day ID whenever it changes
      if (this.selectedMatchDay()) {
        this.matchDayID.emit(this.selectedMatchDay()!.id);
      }
    });
  }

  ngOnInit() {
    // Fetch match days from the backend and populate the matchDays signal
    this._backend.getMatchDays().subscribe((matchDays) => {
      this.matchDays.set(matchDays);
      // Extract just the dates for the datepicker filter
      this.matchDayDates.set(
        matchDays.map((day) => new Date(day.date).setHours(0, 0, 0, 0)),
      );
    });
  }

  findMatchDayByDate(date: Date): MatchDay | null {
    // Find the match day ID based on the selected date
    const matchDay = this.matchDays().find(
      (day) =>
        new Date(day.date).setHours(0, 0, 0, 0) === date.setHours(0, 0, 0, 0),
    );
    return matchDay ? matchDay : null;
  }

  onMatchDaySelected(matchDay: Date | null) {
    const selectedMatchDay = this.findMatchDayByDate(matchDay!);
    // Update the selected match day signal and it will activate the effect
    if (selectedMatchDay) {
      this.selectedMatchDay.set(selectedMatchDay);
    }
  }
}
