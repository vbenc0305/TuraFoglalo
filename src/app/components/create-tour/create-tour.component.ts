import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Tour } from '../../models/tour.model';
import { TourService } from '../../services/tour.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatError, MatFormField, MatHint, MatInput, MatLabel} from '@angular/material/input';
import {NgIf} from '@angular/common';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatButton} from '@angular/material/button';
import {MAT_DATE_LOCALE, provideNativeDateAdapter} from '@angular/material/core';

@Component({
  selector: 'app-create-tour',
  templateUrl: './create-tour.component.html',
  imports: [
    MatLabel,
    MatFormField,
    MatError,
    ReactiveFormsModule,
    MatInput,
    NgIf,
    MatDatepickerInput,
    MatHint,
    MatDatepickerToggle,
    MatDatepicker,
    MatSelect,
    MatOption,
    MatButton,
  ],
  styleUrls: ['./create-tour.component.css'],
  providers: [
    provideNativeDateAdapter(), // 👈 ez a kulcs!
    { provide: MAT_DATE_LOCALE, useValue: 'hu-HU' } // 🇭🇺 opcionális: magyar dátumformátum
  ],
})
export class CreateTourComponent implements OnInit {
  tourForm!: FormGroup;
  tourId?: string;
  isEditMode = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tourService: TourService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // 1. Kinyerjük az ID-t az URL-ből, ha van
    this.tourId = this.route.snapshot.paramMap.get('id') || undefined;

    // 2. Inicializáljuk a formot (üresen)
    this.initForm();

    // 3. Ha van ID, szerkesztési mód, töltsük be a túrát
    if (this.tourId) {
      this.isEditMode = true;
      this.tourService.getTourById(this.tourId).subscribe(tour => {
        if (tour) {
          this.tourForm.patchValue(tour);
        } else {
          alert('Nem található a túra!');
          this.router.navigate(['/tours']);
        }
      });
    }
  }

  initForm() {
    this.tourForm = this.fb.group({
      name: ['', Validators.required],
      date: ['', Validators.required],
      description: [''],
      difficulty: ['', Validators.required],
      duration: ['', Validators.required],
      location: ['', Validators.required],
      maxParticipants: [0, Validators.required],
      price: [0, Validators.required]
    });
  }

  onSubmit() {
    if (this.tourForm.invalid) {
      return;
    }

    const tourData: Tour = this.tourForm.value;

    if (this.isEditMode && this.tourId) {
      // Update túra
      this.tourService.updateTour(this.tourId, tourData).then(() => {
        alert('Túra frissítve!');
        this.router.navigate(['/tours']);
      });
    } else {
      // Új túra létrehozása
      this.tourService.addTour(tourData).then(() => {
        alert('Túra létrehozva!');
        this.router.navigate(['/tours']);
      });
    }
  }

  onCancel() {
    this.router.navigate(['/tours']);
  }
}
