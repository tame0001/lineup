import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatStepperModule } from '@angular/material/stepper';

@Component({
  selector: 'app-interest-form',
  imports: [
    MatStepperModule,
    MatInputModule,
    MatRadioModule,
    MatCheckboxModule,
    ReactiveFormsModule,
  ],
  templateUrl: './interest-form.html',
  styleUrl: './interest-form.scss',
})
export class InterestForm {
  playerInfoForm = new FormGroup({
    name: new FormControl(''),
    gender: new FormControl(''),
    isGrad: new FormControl(false),
  });

  playerContactFormGroup = new FormGroup({
    playerContactCtrl: new FormControl(''),
  });

  onSubmit() {
    if (this.playerInfoForm.valid) {
      console.log(this.playerInfoForm.value);
    }
  }
}
