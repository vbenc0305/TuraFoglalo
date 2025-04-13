import { Component, OnInit } from '@angular/core';
import { Tour } from '../../models/tour.model';
import { TourService } from '../../services/tour.service';
import { Router } from '@angular/router';
import {TourCardComponent} from '../tour-card/tour-card.component';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-tour-list',
  standalone: true,
  templateUrl: './tour-list.component.html',
  imports: [
    TourCardComponent,
    NgForOf,
    NgIf
  ],
  styleUrls: ['./tour-list.component.css']
})
export class TourListComponent implements OnInit {
  tours: Tour[] = [];
  activeComponent: 'login' | 'register' | null = null;

  constructor(private tourService: TourService, private router: Router) {}

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

  showLogin() {
    this.activeComponent = 'login';
  }

  showRegister() {
    this.activeComponent = 'register';
  }

  hideComponents() {
    this.activeComponent = null;
  }
}
