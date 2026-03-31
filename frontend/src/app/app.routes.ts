import { Routes } from '@angular/router';
import { InterestForm } from './interest-form/interest-form';
import { AdminDashboard } from './admin/admin-dashboard';
import { Fee } from './admin/fee/fee';
import { Roster } from './admin/roster/roster';

export const routes: Routes = [
  { path: '', component: InterestForm },
  {
    path: 'admin',
    component: AdminDashboard,
  },
  {
    path: 'admin/fee',
    component: Fee,
  },
  {
    path: 'admin/roster',
    component: Roster,
  },
];
