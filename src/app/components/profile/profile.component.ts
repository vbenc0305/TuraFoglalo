import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { Subscription, forkJoin, from, Observable, of } from 'rxjs';
import { UserService } from '../../services/user.service';
import { TourWithBookingStatus } from '../../models/TourWithBookingStatus';
import { Booking } from '../../models/booking.model';
import { BookingService } from '../../services/booking.service';
import { TourService } from '../../services/tour.service';
import { map, switchMap } from 'rxjs/operators';
import { NgIf, NgForOf, NgClass, TitleCasePipe } from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  imports: [
    NgIf,
    NgForOf,
    NgClass,
    TitleCasePipe,
    RouterLink
  ],
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: User | null = null;
  tours: TourWithBookingStatus[] = [];
  bookedTours: TourWithBookingStatus[] = [];
  stats = { total: 0, confirmed: 0, pending: 0 };
  isLoading = true;

  private sub = new Subscription();

  constructor(
    private userService: UserService,
    private bookingService: BookingService,
    private tourService: TourService,
  ) {}

  ngOnInit() {
    this.loadProfileAndTours();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  private loadProfileAndTours() {
    this.isLoading = true;

    this.sub.add(
      this.userService.getUserProfile().pipe(
        switchMap(profile => {
          this.user  = profile.user;
          this.tours = profile.tours;
          // ideiglenes statok – majd felülírjuk a bookedTours után
          this.stats = profile.stats;

          if (!this.user) {
            this.isLoading = false;
            return of<Booking[]>([]);
          }
          return from(this.bookingService.loadBookingsByUser(this.user.id));
        })
      ).subscribe({
        next: bookings => this.loadBookedToursFromObjects(bookings),
        error: err => {
          console.error('Error loading bookings:', err);
          this.bookedTours = [];
          // nullázzuk, ha hiba
          this.stats = { total: 0, confirmed: 0, pending: 0 };
          this.isLoading = false;
        }
      })
    );
  }

  private loadBookedToursFromObjects(bookings: Booking[]) {
    console.log('DEBUG: loadBookingsByUser eredménye:', bookings);

    if (bookings.length === 0) {
      this.bookedTours = [];
      this.stats = { total: 0, confirmed: 0, pending: 0 };
      this.isLoading = false;
      return;
    }

    const calls: Observable<TourWithBookingStatus>[] = bookings.map(bk =>
      this.tourService.getTourById(bk.tourId).pipe(
        map(tour => ({
          ...tour,
          bookingStatus: bk.status
        } as TourWithBookingStatus))
      )
    );

    this.sub.add(
      forkJoin(calls).subscribe({
        next: tours => {
          console.log('DEBUG: bookedTours:', tours);
          this.bookedTours = tours;
          // ▶️ Statisztikák frissítése
          this.stats.total     = tours.length;
          this.stats.confirmed = tours.filter(t => t.bookingStatus === 'confirmed').length;
          this.stats.pending   = tours.filter(t => t.bookingStatus === 'pending').length;
          this.isLoading       = false;
        },
        error: err => {
          console.error('Hiba a booked tours lekérésekor', err);
          this.bookedTours = [];
          this.stats = { total: 0, confirmed: 0, pending: 0 };
          this.isLoading = false;
        }
      })
    );
  }
}
