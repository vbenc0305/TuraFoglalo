import { Component } from '@angular/core';
import { RouterLink, RouterOutlet} from '@angular/router';
import { TourCardComponent } from './components/tour-card/tour-card.component';
import { MatButton } from '@angular/material/button';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {Observable} from 'rxjs';
import {AuthService} from './shared/service/auth.service';
import {MenuComponent} from './components/menu/menu.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    TourCardComponent,
    MatButton,
    NgIf,
    NgForOf,
    RouterOutlet,
    RouterLink,
    AsyncPipe,
    MenuComponent
  ],
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  userName: string | null = null;  // A bejelentkezett felhasználó neve
  tours: any[] = []; // Dummy túralista, ezt később valódi adatokkal helyettesítheted
  isLoggedIn$:Observable<boolean>;

  constructor(public auth: AuthService) {
    this.isLoggedIn$ = this.auth.isLoggedIn$;  // csak ez kell
  }

  onLogout() {
    this.auth.signOut();
  }
  // Túra kiválasztása
  onTourSelected(tour: any): void {
    console.log('Kiválasztott túra:', tour);
  }
}
