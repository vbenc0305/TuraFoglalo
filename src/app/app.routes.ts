import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import {TourListComponent} from './components/tour-list/tour-list.component';
import {TourDetailComponent} from './components/tour-detail/tour-detail.component';
import {authGuard, publicGuard} from './shared/guards/auth/auth.guard';
import {ProfileComponent} from './components/profile/profile.component';
import {TourManageComponent} from './components/tour-manage/tour-manage.component';
import {CreateTourComponent} from './components/create-tour/create-tour.component';


export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate:[publicGuard] },
  { path: 'register', component: RegisterComponent, canActivate:[publicGuard] },
  { path: 'tour/:id/edit', component: CreateTourComponent, canActivate: [authGuard] }, // ← ideadtuk
  { path: 'tours', component: TourListComponent },  // Itt szerepel a komponens
  { path: 'tour/:id', component: TourDetailComponent }, // Dinamikus route
  { path: 'profile',  component: ProfileComponent,  canActivate: [ authGuard ] },  // ← ideadtuk
  { path: 'tourManage',  component: TourManageComponent,  canActivate: [ authGuard ] },  // ← ideadtuk
  { path: 'createTour',  component: CreateTourComponent,  canActivate: [ authGuard ] },
  { path: '', redirectTo: '/tours', pathMatch: 'full' } , // Alapértelmezett route

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
