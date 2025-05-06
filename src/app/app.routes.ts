import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import {TourListComponent} from './components/tour-list/tour-list.component';
import {TourDetailComponent} from './components/tour-detail/tour-detail.component';
import {publicGuard} from './shared/guards/auth/auth.guard';


export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate:[publicGuard] },
  { path: 'register', component: RegisterComponent, canActivate:[publicGuard] },
  { path: 'tours', component: TourListComponent },  // Itt szerepel a komponens
  { path: 'tour/:id', component: TourDetailComponent }, // Dinamikus route
  { path: '', redirectTo: '/tours', pathMatch: 'full' }  // Alapértelmezett route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
