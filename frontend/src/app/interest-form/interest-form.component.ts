import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import {
  MatStepper,
  MatStep,
  MatStepLabel,
  MatStepperNext,
  MatStepperPrevious,
} from '@angular/material/stepper';
import {
  MatFormField,
  MatLabel,
  MatInput,
  MatError,
} from '@angular/material/input';
import { MatRadioGroup, MatRadioButton } from '@angular/material/radio';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'app-interest-form',
  templateUrl: './interest-form.component.html',
  styleUrls: ['./interest-form.component.css'],
  imports: [
    MatStepper,
    MatStep,
    ReactiveFormsModule,
    MatStepLabel,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatRadioGroup,
    MatRadioButton,
    MatCheckbox,
    MatStepperNext,
    MatStepperPrevious,
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
