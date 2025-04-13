import { Component, OnInit } from '@angular/core';
import { TourService } from '../../services/tour.service';
import {Tour} from '../../models/tour.model';
import {TourCardComponent} from '../tour-card/tour-card.component';
import {NgForOf} from '@angular/common';
import {Router} from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';



@Component({
  selector: 'app-tour-list',
  templateUrl: './tour-list.component.html',
  imports: [
    TourCardComponent,
    NgForOf,
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
  ],
  styleUrls: ['./tour-list.component.css']
})
export class TourListComponent implements OnInit {
  tours: Tour[] = [];

  constructor(private tourService: TourService, private router:Router) {}

  ngOnInit() {
    this.tourService.getTours().subscribe(data => {
      this.tours = data;
    });
  }

  handleTourSelected(selectedTour: Tour) {
    console.log('Kiválasztott túra:', selectedTour);
  }

  onTourSelected(tour: Tour) {
    this.router.navigate(['/tour', tour.id]);
  }
}
