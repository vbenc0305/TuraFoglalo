// register.component.ts
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import {UserService} from '../../services/user.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'; // Ha használod az input mezőt
import { MatIconModule } from '@angular/material/icon'; // Ha használsz ikont (pl. a jelszó láthatóság kapcsolásához)

import {User} from '../../models/user.model';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatOption} from '@angular/material/core';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatSelect} from '@angular/material/select';
import {SuccessDialogComponent} from '../success-dialog/success-dialog.component';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {AuthService} from '../../shared/service/auth.service';
import {MatIcon} from '@angular/material/icon';
import {NgIf} from '@angular/common';
import {Router} from '@angular/router';
import {passwordMatchValidator} from '../../validators/password-match.validator';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatFormField,
    MatOption,
    MatFormFieldModule,  // Különösen a mat-error miatt
    MatInputModule,      // Az input mezőkhöz
    MatIconModule,       // Ha ikont használsz
    MatButton,
    MatSelect,
    MatIcon,
    MatIconButton,
    NgIf,
  ],
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  protected signUpError: string = "";
  hidePassword = true;
  hideConfirm = true;


  constructor(
    private fb: FormBuilder,
    private dialog : MatDialog,
    private authService: AuthService,
    private router : Router,
  ) {}

  ngOnInit(): void {
    // Az űrlapmezők inicializálása
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required , Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      role: ['tourist', Validators.required] // Alapesetben 'tourist'
    }, { validators:passwordMatchValidator });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
      const userData:Partial<User> = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        signedUpTours: []
      }

      const email = formData.email;
      const pw = formData.password;

      console.log("DEBUG: RegisterComponent -> onSubmit -> userData", userData);
      // Regisztráció végrehajtása a service segítségével
      this.authService.signUp(email, pw,userData)
        .then(userCredential => {
          console.log('Regisztráció sikeres:', userCredential);
          this.router.navigate(['/tours']); // Átirányítás a túrák oldalra


          this.dialog.open(SuccessDialogComponent, {
            width: '300px',
            data: { message: 'Sikeresen regisztráltál!' }
          });

          this.registerForm.reset();
        })
        .catch(error => {
          console.error('Regisztráció sikertelen:', error);
          this.signUpError = "Registration failed. Please try again.";

          switch (error.code){
            case 'auth/email-already-in-use':
              this.signUpError = "Ez az email cím már használatban van.";
              break;
            case 'auth/invalid-email':
              this.signUpError = "Érvénytelen email cím.";
              break;
            case 'auth/operation-not-allowed':
              this.signUpError = "A regisztráció nem engedélyezett.";
              break;
            case 'auth/weak-password':
              this.signUpError = "A jelszó túl gyenge.";
              break;
            default:
              this.signUpError = "Ismeretlen hiba történt.";
              this.signUpError = "Nem várt hiba: " + JSON.stringify(error);

          }
        })

      // Űrlap reseteléseco
    }
    else{
      this.signUpError = "Please correct any errors in the form.";
      return;
    }
  }
}
