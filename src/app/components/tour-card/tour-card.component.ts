import { Component, Input, Output, EventEmitter } from '@angular/core';
import {Tour} from '../../models/tour.model';
import {CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-tour-card',
  templateUrl: './tour-card.component.html',
  imports: [
    CurrencyPipe
  ],
  styleUrls: ['./tour-card.component.css']
})
export class TourCardComponent {
  @Input() tour!: Tour;

  @Output() tourSelected = new EventEmitter<Tour>();

  selectTour() {
    this.tourSelected.emit(this.tour);
  }
}
