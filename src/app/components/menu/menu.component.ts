import { Component } from '@angular/core';
import { AuthService} from '../../shared/service/auth.service';
import { Observable } from 'rxjs';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {MatButton} from '@angular/material/button';
import {AsyncPipe, NgIf} from '@angular/common';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  imports: [
    RouterLink,
    MatButton,
    RouterLinkActive,
    NgIf,
    AsyncPipe
  ],
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  isLoggedIn$: Observable<boolean>;

  constructor(private auth: AuthService) {
    this.isLoggedIn$ = this.auth.isLoggedIn$;
  }

  onLogout() {
    this.auth.signOut();
  }
}
