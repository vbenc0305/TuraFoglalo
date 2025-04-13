import { TourListComponent } from './components/tour-list/tour-list.component';
import {Routes} from '@angular/router';
import {TourDetailComponent} from './components/tour-detail/tour-detail.component';

export const routes: Routes = [
  { path: 'tours', component: TourListComponent },
  { path: '', redirectTo: '/tours', pathMatch: 'full' },
  { path: 'tour/:id', component: TourDetailComponent },
{ path: '', redirectTo: '/tours', pathMatch: 'full' },
{ path: '**', redirectTo: '/tours' } // hibakezeléshez
];
