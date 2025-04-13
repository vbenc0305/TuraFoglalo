import { Component } from '@angular/core';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-success-dialog',
  template: `
    <h1 mat-dialog-title>Regisztráció sikeres!</h1>
    <div mat-dialog-content>
      <p>Sikeresen regisztráltál! Most már bejelentkezhetsz.</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button mat-dialog-close>Ok</button>
    </div>
  `,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose
  ]
})
export class SuccessDialogComponent {}
