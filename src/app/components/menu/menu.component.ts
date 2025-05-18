import { Component } from '@angular/core';
import { AuthService} from '../../shared/service/auth.service';
import {combineLatest, Observable} from 'rxjs';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {MatButton} from '@angular/material/button';
import {AsyncPipe, NgIf} from '@angular/common';
import {UserService} from '../../services/user.service';
import {map} from 'rxjs/operators';

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
  isGuide$: Observable<boolean>;

  constructor(private auth: AuthService) {
    this.isLoggedIn$ = this.auth.isLoggedIn$;
    this.isGuide$ = combineLatest([
      this.auth.isLoggedIn$,
      this.auth.isGuide$
    ]).pipe(
      map(([loggedIn, guide]) => loggedIn && guide)
    );
  }

  onLogout() {
    this.auth.signOut();
  }
}
