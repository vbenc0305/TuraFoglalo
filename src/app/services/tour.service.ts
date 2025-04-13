import { Injectable } from '@angular/core';
import { Tour } from '../models/tour.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TourService {
  private tours: Tour[] = [
    {
      id: '1',
      name: 'Alpok Túra',
      location: 'Ausztria',
      date: '2025-06-12',
      price: 50000,
      maxParticipants: 10,
      description: 'Egy csodálatos túra az Alpok hegyeiben.',
      duration: 4,
      difficulty: 'easy',
      guideId: '',
    },
    {
      id: '2',
      name: 'Bakonyi kirándulás',
      location: 'Magyarország',
      date: '2025-07-20',
      price: 15000,
      maxParticipants: 20,
      description: 'Egynapos túra a Bakony vadregényes tájain.',
      duration: 2,
      difficulty: 'easy',
      guideId: '',
    }
  ];

  constructor() {}

  getTours(): Observable<Tour[]> {
    return of(this.tours);
  }

  getTourById(id: string): Observable<Tour> {
    const tour = this.tours.find(t => t.id === id);
    return of(tour!);
  }
}
