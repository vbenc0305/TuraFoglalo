import { Injectable } from '@angular/core';
import {Booking} from '../models/booking.model';
import {
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  getDocs,
  query,
  setDoc,
  where
} from '@angular/fire/firestore';
import {from, Observable} from 'rxjs';
import {map, switchMap, take} from 'rxjs/operators';
import {AuthService} from '../shared/service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(private firestore:Firestore, private authService: AuthService,) { }

  async loadBookingsByUser(uid: string): Promise<Booking[]> {
    try {
      const bookingsQuery = query(
        collection(this.firestore, 'Bookings'),
        where('userId', '==', uid)
      );
      const bookingSnap = await getDocs(bookingsQuery);

      const bookings: Booking[] = [];
      bookingSnap.forEach(doc => bookings.push({ ...doc.data(), id: doc.id } as Booking));

      return bookings;
    } catch (error) {
      console.error('⚠️ Hiba a loadBookingsByUser során:', error);
      return [];
    }
  }

  getSignedUpTourIds(userId: string): Observable<string[]> {
    const bookingsRef = collection(this.firestore, 'Bookings');
    const q = query(
      bookingsRef,
      where('userId', '==', userId),
    );

    return collectionData(q).pipe(
      map((bookings: any[]) => bookings.map(b => b.tourId))
    );
  }
  createBooking(tourId: string) {
    return this.authService.currentUser$.pipe(
      take(1),
      switchMap(user => {
        if (!user) {
          throw new Error('Nem vagy bejelentkezve');
        }
        // Generálunk egy új doc ref-et a Bookings kollekcióban
        const bookingsCol = collection(this.firestore, 'Bookings');
        const bookingRef = doc(bookingsCol);

        const newBooking: Booking = {
          id: bookingRef.id,
          userId: user.id,
          tourId: tourId,
          status: 'pending',
          bookedAt: new Date().toISOString()
        };

        // Promise-t alakítunk Observable-é
        return from(setDoc(bookingRef, newBooking));
      })
    );
  }

  cancelBooking(tourId: string, userId: string): Observable<void> {
    const bookingsRef = collection(this.firestore, 'Bookings');
    const q = query(bookingsRef,
      where('tourId', '==', tourId),
      where('userId', '==', userId)
    );

    return from(getDocs(q)).pipe(
      take(1),
      switchMap(snapshot => {
        if (snapshot.empty) {
          throw new Error(`❌ Nincs ilyen foglalás: tourId = ${tourId}, userId = ${userId}`);
        }

        const bookingDoc = snapshot.docs[0]; // ha több is van, csak az elsőt törli
        const bookingDocRef = doc(this.firestore, 'Bookings', bookingDoc.id);

        return from(deleteDoc(bookingDocRef));
      })
    );
  }


}
