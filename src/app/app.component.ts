import { Component } from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import { TourCardComponent } from './components/tour-card/tour-card.component';
import { MatButton } from '@angular/material/button';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    TourCardComponent,
    MatButton,
    NgIf,
    NgForOf,
    RouterOutlet,
    RouterLink
  ],
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  userName: string | null = null;  // A bejelentkezett felhasználó neve
  tours: any[] = []; // Dummy túralista, ezt később valódi adatokkal helyettesítheted

  constructor(private router: Router) {
    console.log("username " +this.userName)
  }

  // Sikeres bejelentkezés esetén átállítjuk a felhasználó nevét
  onLoginSuccess(userName: string): void {
    this.userName = userName;  // Beállítjuk a felhasználó nevét
    console.log("NYOMOM!");
  }

  // Túra kiválasztása
  onTourSelected(tour: any): void {
    console.log('Kiválasztott túra:', tour);
  }
}
