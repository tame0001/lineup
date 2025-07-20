import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormModule } from '@angular/material/input';
import { MMatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-interest-form',
  templateUrl: './interest-form.component.html',
  styleUrls: ['./interest-form.component.css'],
  imports: [
    ReactiveFormsModule,
    MatFormModule,
    MMatRadioModule,
    MatCheckboxModule,
    MatStepperModule,
  ],
})
export class InterestFormComponent {
  playerInfoForm = this._formBuilder.group({
    name: [null, Validators.required],
    gender: [null, Validators.required],
    isGrad: [false],
  });

  playerContactFormGroup = this._formBuilder.group({
    playerContactCtrl: ['', Validators.required],
  });

  constructor(private _formBuilder: FormBuilder) {}

  onSubmit() {
    if (this.playerInfoForm.valid) {
      console.log(this.playerInfoForm.value);
    }
  }
}
