import { Timestamp } from 'firebase/firestore';
import {DocumentReference} from '@angular/fire/compat/firestore'; // Firebase Timestamp importálása

export interface Tour {
  id: string;
  name: string;
  location: string;
  date: Timestamp; // Firebase Timestamp típus
  duration: number; // Órákban
  difficulty: 'easy' | 'medium' | 'hard';
  price: number;
  guideId: DocumentReference;
  maxParticipants: number;
  description: string;
}
