import { Component, inject, signal } from '@angular/core';
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

  constructor() {
    this._backend.getMatchDays().subscribe((matchDays) => {
      this.matchDays.set(matchDays);
      console.table(matchDays);
    });
  }
}
