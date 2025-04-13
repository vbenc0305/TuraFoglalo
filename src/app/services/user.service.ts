// user.service.ts
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Observable, of } from 'rxjs';  // Importáljuk az Observable-t és az of-t

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private localStorageKey = 'users';

  registerUser(user: User): void {
    const users: User[] = this.getUsers();
    users.push(user);
    localStorage.setItem(this.localStorageKey, JSON.stringify(users));
  }

  getUsers(): User[] {
    const users = localStorage.getItem(this.localStorageKey);
    return users ? JSON.parse(users) as User[] : [];
  }

  loginUser(email: string, password: string): Observable<boolean> {
    const users = this.getUsers();
    const userFound = users.some((user: User) => user.email === email && user.password === password);
    return of(userFound);  // Observable<boolean> visszaadása
  }
}
