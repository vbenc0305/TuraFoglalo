import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideFirebaseApp(() => initializeApp({ projectId: "turafoglalo-77c74", appId: "1:29866769338:web:31868d4fff17eac14b7b83", storageBucket: "turafoglalo-77c74.firebasestorage.app", apiKey: "AIzaSyD1Z_N6DLLVhHFpS0nBlf_TUppde3FYsgc", authDomain: "turafoglalo-77c74.firebaseapp.com", messagingSenderId: "29866769338", measurementId: "G-ZK6PZ7HRY3" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())]
};
