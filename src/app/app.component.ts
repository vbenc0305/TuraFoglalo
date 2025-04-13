import { Component } from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {TourCardComponent} from './components/tour-card/tour-card.component';
import {MatButton} from '@angular/material/button';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    RouterOutlet,
    RouterLink,
    TourCardComponent,
     MatButton,
    NgIf,
    NgForOf
  ],
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  userName: string | null = null;  // A bejelentkezett felhasználó neve
  tours: any;

  constructor(private router: Router) {}

  // Sikeres bejelentkezés esetén átállítjuk a felhasználó nevét és navigálunk
  onLoginSuccess(userName: string): void {
    this.userName = userName;  // Beállítjuk a felhasználó nevét
    this.router.navigate(['/tours']);  // Navigálás a túrák oldalra
  }

  // Túra kiválasztása
  onTourSelected(tour: any): void {
    console.log('Kiválasztott túra:', tour);
  }
}
