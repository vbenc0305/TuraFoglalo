import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../../service/auth.service';
import {map, take} from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    return authService.currentUser.pipe(
      take(1),
      map(user => {
        if (user) {
          return true;  // Ha a felhasználó be van jelentkezve, engedélyezzük az útvonalat
        } else {
          console.log("Access denied - Not authenticated");
          router.navigate(['/login']);  // Ha nem, átirányítjuk a bejelentkezési oldalra
          return false;
        }
      }
    ));
};

export const publicGuard : CanActivateFn = (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    return authService.currentUser.pipe(
      take(1),
      map(user => {
        if (!user) {
          return true;
        } else {
          console.log("Already authenticated - redirecting to home.");
          router.navigate(['/tours']);
          return false;
        }
      }
    ));
}
