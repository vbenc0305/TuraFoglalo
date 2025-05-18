import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Tour } from '../../models/tour.model';
import { Subject, Subscription, of } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { CurrencyPipe, DatePipe, NgIf } from '@angular/common';
import { AuthService } from '../../shared/service/auth.service';
import { User } from '../../models/user.model';
import { TourService } from '../../services/tour.service';
import { BookingService } from '../../services/booking.service';
import { UserService } from '../../services/user.service';

// ⛔️ Hibás import eltávolítva
// import {subscribe} from '@angular/fire/data-connect';

export enum BookingStatus {
  Pending   = 'pending',
  Confirmed = 'confirmed',
  Cancelled = 'cancelled',
}

@Component({
  selector: 'app-tour-detail',
  templateUrl: './tour-detail.component.html',
  imports: [ NgIf, DatePipe, CurrencyPipe ],
  styleUrls: ['./tour-detail.component.css'],
})
export class TourDetailComponent implements OnInit, OnDestroy {
  tour: Tour | null = null;
  guide: User | null = null;
  bookingStatus: BookingStatus | null = null;
  isLoggedIn = false;
  errorMessage: string | null = null;

  private subs: Subscription[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private tourService: TourService,
    private bookingService: BookingService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    const tourId = this.route.snapshot.paramMap.get('id')!;
    if (!tourId) {
      console.error('❌ Nincs tourId az URL-ben!');
      return;
    }

    // 1️⃣ Túra + Guide betöltése
    const tourSub = this.tourService.getTourById(tourId).pipe(
      takeUntil(this.destroy$),
      switchMap(tourData => {
        this.tour = tourData;
        console.log('DEBUG: Full tourData:', tourData);

        const guideRef = tourData.guideId;
        let guideId: string | null = null;

        if (guideRef && typeof guideRef === 'object' && 'id' in guideRef) {
          guideId = guideRef.id;
        }

        if (!guideId) {
          console.warn('⚠️ Nincs érvényes guideId a tourData-ban!');
          return of(null);
        }

        return this.userService.getUserByIdObservable(guideId);
      })
    ).subscribe({
      next: guideUser => {
        this.guide = guideUser;
        console.log('DEBUG: Loaded guide:', this.guide);
      },
      error: err => console.error('Hiba a tour vagy guide lekérésekor:', err)
    });

    this.subs.push(tourSub);

    // 2️⃣ Felhasználó és booking státusz figyelés
    const userSub = this.authService.currentUser$.pipe(
      takeUntil(this.destroy$),
      switchMap(user => {
        this.isLoggedIn = !!user;
        if (!user) return of(null);
        return this.bookingService.getSignedUpTourIds(user.id);
      })
    ).subscribe({
      next: ids => {
        if (!ids || !Array.isArray(ids)) {
          this.bookingStatus = null;
          return;
        }
        this.bookingStatus = ids.includes(tourId)
          ? BookingStatus.Confirmed
          : null;
        console.log('DEBUG: bookingStatus:', this.bookingStatus);
      },
      error: err => console.error('Hiba a booking státusz lekérésekor:', err)
    });

    this.subs.push(userSub);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.subs.forEach(s => s.unsubscribe());
  }

  // 🟢 Foglalás
  onSubscribe(): void {
    if (!this.tour) return;
    this.bookingService.createBooking(this.tour.id).subscribe({
      next: () => this.bookingStatus = BookingStatus.Pending,
      error: (err: any) => {
        this.errorMessage = 'Foglalás hiba történt!';
        console.error('Foglalás hiba:', err);
        this.bookingStatus = null;
      }
    });
  }

  // 🔴 Foglalás törlése
  onCancel(): void {
    if (!this.tour) return;
    this.authService.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(user => {
      if (!user) return;
      this.bookingService.cancelBooking(this.tour!.id, user.id).subscribe({
        next: () => {
          console.log('Foglalás törölve az adatbázisból ✅');
          this.bookingStatus = BookingStatus.Cancelled;
        },
        error: err => {
          this.errorMessage = 'Törlés hiba történt!';
          console.error('🔥 Hiba a törlésnél:', err);
        }
      });
    });
  }
}
