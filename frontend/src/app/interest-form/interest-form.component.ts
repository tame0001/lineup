import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-interest-form',
  templateUrl: './interest-form.component.html',
  styleUrls: ['./interest-form.component.css'],
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
