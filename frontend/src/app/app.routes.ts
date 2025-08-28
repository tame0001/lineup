import { Routes } from '@angular/router';
import { InterestForm } from './interest-form/interest-form';
import { Admin } from './admin/admin';
import { Player } from './player/player';

export const routes: Routes = [
  { path: '', component: InterestForm },
  {
    path: 'admin',
    component: Admin,
  },
  {
    path: 'player',
    component: Player,
  },
];
