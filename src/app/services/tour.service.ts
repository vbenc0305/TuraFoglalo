import { Injectable } from '@angular/core';
import { Tour } from '../models/tour.model';
import {
  Firestore,
  CollectionReference,
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  deleteDoc,
  addDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TourService {
  constructor(private fireStore: Firestore) {}

  // Minden túra lekérése
  getTours(): Observable<Tour[]> {
    const toursCollection = collection(this.fireStore, 'Tours');
    const toursQuery = query(toursCollection); // Az összes túra lekérése
    return from(getDocs(toursQuery)).pipe(
      map(snapshot => {
        const tours: Tour[] = [];
        snapshot.forEach(doc => {
          const tourData = doc.data() as Omit<Tour, 'id'>; // Az id-t levesszük a tour adatról
          tours.push({ ...tourData, id: doc.id } as Tour); // Hozzáadjuk az id-t a dokumentumhoz
        });
        return tours;
      })
    );
  }

  /**
   * Csak a megadott guideId-hoz tartozó túrák
   */
  getToursByGuide(guideId: string): Observable<Tour[]> {
    const toursCollection = collection(this.fireStore, 'Tours');

    // 🔁 Alakítsuk át a string guideId-t dokumentumreferenciává
    const guideRef = doc(this.fireStore, 'Users', guideId); // <--- EZ FONTOS

    const toursQuery = query(
      toursCollection,
      where('guideId', '==', guideRef) // <-- itt már dokumentumreferenciával hasonlítunk
    );

    return from(getDocs(toursQuery)).pipe(
      map(snapshot => {
        const tours: Tour[] = [];
        snapshot.forEach(docSnap => {
          const data = docSnap.data() as Omit<Tour, 'id'>;
          tours.push({ ...data, id: docSnap.id });
        });
        return tours;
      })
    );
  }

  /**
   * Törli a megadott ID-jú túrát a Firestore-ból.
   * @param tourId A törlendő túra dokumentum-azonosítója
   * @returns Promise<void>
   */
  deleteTour(tourId: string): Promise<void> {
    // 1️⃣ Dokumentumreferencia a 'Tours' kollekcióból
    const tourDocRef = doc(this.fireStore, 'Tours', tourId);
    // 2️⃣ Törlés
    return deleteDoc(tourDocRef);
  }

  async addTour(tour: Omit<Tour, 'id'>): Promise<void> {
    const toursCollection = collection(this.fireStore, 'Tours') as CollectionReference<Omit<Tour, 'id'>>;
    try {
      await addDoc(toursCollection, tour);
      console.log('✅ Túra sikeresen hozzáadva Firestore-hoz');
    } catch (error) {
      console.error('❌ Hiba a túra hozzáadásakor:', error);
      throw error;
    }
  }


  async loadToursByIdList(ids: string[]): Promise<Tour[]> {
    try {
      const tourCollection = collection(this.fireStore, 'Tours');
      const chunkSize = 10;
      const chunks: string[][] = [];

      for (let i = 0; i < ids.length; i += chunkSize) {
        chunks.push(ids.slice(i, i + chunkSize));
      }

      const allTours: Tour[] = [];
      for (const chunk of chunks) {
        const q = query(tourCollection, where('id', 'in', chunk));
        const snapshot = await getDocs(q);
        snapshot.forEach(doc => allTours.push({ ...doc.data(), id: doc.id } as Tour));
      }

      return allTours;
    } catch (error) {
      console.error('⚠️ Hiba a loadToursByIdList során:', error);
      return [];
    }
  }
  getTourById(tourId: string): Observable<Tour> {
    const tourDocRef = doc(this.fireStore, 'Tours', tourId);
    return from(getDoc(tourDocRef)).pipe(
      map(snapshot => {
        if (!snapshot.exists()) {
          throw new Error(`Tour with ID ${tourId} not found`);
        }
        const data = snapshot.data() as Omit<Tour, 'id'>;
        return { ...data, id: snapshot.id } as Tour;
      })
    );
  }


  async updateTour(id: string, data: any): Promise<void> {
    const tourDocRef = doc(this.fireStore, 'Tours', id);
    return updateDoc(tourDocRef, data);
  }

}
