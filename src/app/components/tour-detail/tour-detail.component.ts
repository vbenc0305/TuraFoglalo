import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TourService } from '../../services/tour.service';
import { Tour } from '../../models/tour.model';
import { switchMap } from 'rxjs/operators';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tour-detail',
  templateUrl: './tour-detail.component.html',
  styleUrls: ['./tour-detail.component.css'],
  imports: [
    DatePipe,
    CurrencyPipe,
  ]
})
export class TourDetailComponent implements OnInit {
  tour!: Tour;

  constructor(
    private route: ActivatedRoute,
    private tourService: TourService,
    private router: Router
  ) {}

  ngOnInit(): void {
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
        (error) => {
          console.error('Hiba történt a túra betöltésekor:', error);
          // Ide érdemes lehet egy hibaüzenet megjelenítése
        }
      );
  }

  apply(): void {
    console.log('Jelentkezem gomb megnyomva, túra:', this.tour);
    this.router.navigate(['/application', this.tour.id]);  // Példa navigálás
  }
}
