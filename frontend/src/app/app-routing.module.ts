import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InterestFormComponent } from './interest-form/interest-form.component';

const routes: Routes = [
  {
    path: '',
    component: InterestFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
