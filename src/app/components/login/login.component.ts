import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../shared/service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    NgIf
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  loginError = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginError = 'Kérlek, töltsd ki helyesen a mezőket!';
      return;
    }

    this.isLoading = true;
    this.loginError = '';

    const { email, password } = this.loginForm.value;
    this.authService.signIn(email, password)
      .then(() => {
        this.isLoading = false;
        this.router.navigate(['/tours']);
      })
      .catch(error => {
        this.isLoading = false;
        this.loginError = this.mapErrorCodeToMessage(error.code);
      });
  }

  private mapErrorCodeToMessage(code: string): string {
    const map: Record<string, string> = {
      'auth/user-not-found': 'Nincs fiók ezzel az email címmel.',
      'auth/wrong-password': 'Helytelen jelszó.',
      'auth/invalid-credential': 'Érvénytelen hitelesítő adatok.',
    };
    return map[code] || 'Hiba a bejelentkezés során. Próbáld újra!';
  }
}
