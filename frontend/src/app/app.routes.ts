import { Routes } from '@angular/router';
import { InterestForm } from './interest-form/interest-form';
import { Admin } from './admin/admin';
import { Player } from './player/player';
import { Fee } from './admin/fee/fee';

export const routes: Routes = [
  { path: '', component: InterestForm },
  {
    path: 'admin',
    component: Admin,
  },
  {
    path: 'admin/fee',
    component: Fee,
  },
  {
    path: 'player',
    component: Player,
  },
];
