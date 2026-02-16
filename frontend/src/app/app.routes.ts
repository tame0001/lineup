import { Routes } from '@angular/router';
import { InterestForm } from './interest-form/interest-form';
import { Admin } from './admin/admin';
import { Fee } from './admin/fee/fee';
import { PlayerAdmin } from './player/player-admin/player-admin';

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
    path: 'player/:id',
    component: PlayerAdmin,
  },
];
