import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { TourWithBookingStatus } from '../models/TourWithBookingStatus';
import { AuthService } from '../shared/service/auth.service';

import {
  Firestore,
  doc,
  getDoc, docData,
} from '@angular/fire/firestore';

import {Observable, from, of} from 'rxjs';
import { switchMap, } from 'rxjs/operators';
import {TourService} from './tour.service';
import {BookingService} from './booking.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {



  constructor(
    private fireStore: Firestore,
    private authService: AuthService,
    private tourService: TourService,
    private bookingService: BookingService,
  ) {}

  getUserProfile(): Observable<{
    user: User | null;
    tours: TourWithBookingStatus[];
    stats: {
      total: number;
      confirmed: number;
      pending: number;
    };
  }> {
    return this.authService.currentUser$.pipe(
      switchMap(user => {
        if (!user) {
          return of({
            user: null,
            tours: [],
            stats: { total: 0, confirmed: 0, pending: 0 }
          });
        }
        return from(this.fetchUserWithTours(user.id));
      })
    );
  }

  private async fetchUserWithTours(uid: string): Promise<{
    user: User | null;
    tours: TourWithBookingStatus[];
    stats: {
      total: number;
      confirmed: number;
      pending: number;
    };
  }> {
    try {
      const user = await this.loadUser(uid);
      if (!user) {
        return {
          user: null,
          tours: [],
          stats: { total: 0, confirmed: 0, pending: 0 }
        };
      }

      const bookings = await this.bookingService.loadBookingsByUser(uid);
      if (bookings.length === 0) {
        return {
          user,
          tours: [],
          stats: { total: 0, confirmed: 0, pending: 0 }
        };
      }

      const tourIds = bookings.map(b => b.tourId);
      const tours = await this.tourService.loadToursByIdList(tourIds);

      const toursWithStatus: TourWithBookingStatus[] = tours.map(tour => {
        const booking = bookings.find(b => b.tourId === tour.id);
        return {
          ...tour,
          bookingStatus: booking?.status ?? null
        };
      });

      const total = toursWithStatus.length;
      const confirmed = toursWithStatus.filter(t => t.bookingStatus === 'confirmed').length;
      const pending = toursWithStatus.filter(t => t.bookingStatus === 'pending').length;

      return {
        user,
        tours: toursWithStatus,
        stats: { total, confirmed, pending }
      };
    } catch (error) {
      console.error('❌ Hiba a fetchUserWithTours során:', error);
      return {
        user: null,
        tours: [],
        stats: { total: 0, confirmed: 0, pending: 0 }
      };
    }
  }
  private async loadUser(uid: string): Promise<User | null> {
    try {
      const userDocRef = doc(this.fireStore, 'Users', uid);
      const userSnapShot = await getDoc(userDocRef);
      if (!userSnapShot.exists()) return null;

      const userData = userSnapShot.data() as User;
      return { ...userData, id: uid };
    } catch (error) {
      console.error('⚠️ Hiba a loadUser során:', error);
      return null;
    }
  }

  getUserByIdObservable(uid: string): Observable<User> {
    const ref = doc(this.fireStore, 'Users', uid);
    return docData(ref, { idField: 'id' }) as Observable<User>;
  }


}
