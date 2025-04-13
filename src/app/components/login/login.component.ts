import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    ReactiveFormsModule,
    MatLabel,
    MatFormField,
    MatInput,
    MatButton,
    NgIf
  ],
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loginError: boolean = false;

  @Output() loginSuccess = new EventEmitter<string>();  // Esemény a sikeres loginról

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.userService.loginUser(email, password).subscribe(
        (isValid: boolean) => {
          if (isValid) {
            console.log('Login sikeres!');
            const userName = email.split('@')[0];  // A felhasználó nevének kiszedése
            sessionStorage.setItem('authToken', 'dummyAuthToken');  // Dummy authToken
            this.loginSuccess.emit(userName);  // Esemény kibocsátása
            this.router.navigate(['/tours']);  // Navigálás a túrák oldalra
          } else {
            this.loginError = true;
            console.error('Hibás email vagy jelszó!');
          }
        },
        (error) => {
          this.loginError = true;
          console.error('Hiba történt a bejelentkezéskor:', error);
        }
      );
    }
  }
}
