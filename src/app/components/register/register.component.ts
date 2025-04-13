// register.component.ts
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user.model';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatOption} from '@angular/material/core';
import {MatButton} from '@angular/material/button';
import {MatSelect} from '@angular/material/select';
import {SuccessDialogComponent} from '../success-dialog/success-dialog.component';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';


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
    MatButton,
    MatSelect,
 ],
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialog : MatDialog,
  ) {}

  ngOnInit(): void {
    // Az űrlapmezők inicializálása
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['tourist', Validators.required] // Alapesetben 'tourist'
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
      const newUser: User = {
        id: uuidv4(),  // Generálunk egy egyedi ID-t
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      };

      // Regisztráció végrehajtása a service segítségével
      this.userService.registerUser(newUser);
      console.log('Regisztráció sikeres:', newUser);
      this.dialog.open(SuccessDialogComponent, {
        width: '300px',
        data: { message: 'Sikeresen regisztráltál!' }  // További adatokat is átadhatsz a dialógusnak
      })
      // Űrlap reseteléseco
      this.registerForm.reset();
    }
  }
}
