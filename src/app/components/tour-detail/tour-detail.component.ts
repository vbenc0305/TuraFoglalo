// src/app/components/tour-detail/tour-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TourService } from '../../services/tour.service';
import { Tour } from '../../models/tour.model'
import { switchMap } from 'rxjs/operators';
import {CurrencyPipe, DatePipe, NgIf} from '@angular/common';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-tour-detail',
  templateUrl: './tour-detail.component.html',
  imports: [
    DatePipe,
    CurrencyPipe,
    NgIf
  ],
  styleUrls: ['./tour-detail.component.css']
})
export class TourDetailComponent implements OnInit {
  tour!: Tour;

  constructor(
    private route: ActivatedRoute,
    private tourService: TourService
  ) {}

  ngOnInit(): void {
    // URL-ből olvassuk ki az 'id' paramétert, majd kérjük le a túra adatait
    this.route.paramMap
      .pipe(
        switchMap(params => {
          const tourId = params.get('id');
          return this.tourService.getTourById(tourId!);
        })
      )
      .subscribe(
        (tourData) => {
          this.tour = tourData;
        },
        error => console.error('Hiba történt a túra betöltésekor:', error)
      );
  }

  // Jelentkezés gomb eseménykezelője
  apply(): void {
    console.log('Jelentkezem gomb megnyomva, túra:', this.tour);
    // Itt akár további logikát is bevezethetsz,
    // például navigálást egy jelentkezési oldalra vagy dialógus megnyitását.
  }
}
