import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-select-week',
  providers: [provideNativeDateAdapter()],
  imports: [MatDatepickerModule, MatCardModule],
  templateUrl: './select-week.html',
  styleUrl: './select-week.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectWeek {}
