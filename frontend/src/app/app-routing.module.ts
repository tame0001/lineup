import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VolleyballComponent } from './volleyball/volleyball.component';

const routes: Routes = [
  {path: '', component: VolleyballComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
