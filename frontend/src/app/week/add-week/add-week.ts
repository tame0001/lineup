import { DatePipe } from '@angular/common';
import { Component, inject, model } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BackendService } from '../../backend-service';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-add-week',
  imports: [MatDatepickerModule, MatCardModule, MatButtonModule, DatePipe],
  templateUrl: './add-week.html',
  styleUrl: './add-week.scss',
  providers: [provideNativeDateAdapter()],
})
export class AddWeek {
  private _backendService = inject(BackendService);
  private _bottomSheetRef = inject(MatBottomSheetRef<AddWeek>);
  selectedDate = model<Date | null>(null);

  addWeek() {
    // Call backend service to add the week with the selected date
    if (this.selectedDate()) {
      this._backendService.createWeek(this.selectedDate()!).subscribe({
        next: (matchDay) => {
          console.log('Week added successfully:', matchDay);
          // Optionally, you can navigate to the week details page or show a success message
        },
        error: (error) => {
          console.error('Error adding week:', error);
          // Optionally, show an error message to the user
        },
      });
    }
    // Then close the bottom sheet
    this._bottomSheetRef.dismiss();
  }
}
