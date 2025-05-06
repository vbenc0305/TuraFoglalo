import { Injectable } from '@angular/core';
import {Observable, from, BehaviorSubject} from 'rxjs';  // from importálása
import {
  Auth,
  signOut,
  authState,
  signInWithEmailAndPassword,
  UserCredential,
  User as FirebaseUser,
  createUserWithEmailAndPassword
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import {Firestore, doc, getDoc, setDoc} from '@angular/fire/firestore';  // Firestore importálása
import { switchMap } from 'rxjs/operators';  // switchMap importálása
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: Observable<User | null>;  // Observable<User | null> típussal
  private loggedInSubject = new BehaviorSubject<boolean>(false);  // BehaviorSubject a bejelentkezési állapot kezelésére
  public isLoggedIn$ = this.loggedInSubject.asObservable();


  constructor(
    private auth: Auth,
    private firestore: Firestore,  // Firestore szolgáltatás
    private router: Router,
  ) {
    this.currentUser = authState(this.auth).pipe(
      switchMap((firebaseUser) =>
        from(this.mapFirebaseUserToAppUser(firebaseUser))  // from használata, hogy Promise-ból Observable legyen
      )
    );
    this.auth.onAuthStateChanged(user => {
      this.loggedInSubject.next(!!user);
    });
  }

  async signIn(email: string, password: string) {
    const cred = await signInWithEmailAndPassword(this.auth, email, password);
    this.loggedInSubject.next(true);
    return cred;
  }

  signOut() {
    return signOut(this.auth).then(() => {
      this.loggedInSubject.next(false);
    });
  }

  isLoggedIn(): Observable<User | null> {
    return this.currentUser;
  }

  updateLoginStatus(isLoggedIn: boolean): void {
    localStorage.setItem('isLoggedIn', isLoggedIn ? 'true' : 'false');
  }

  private async mapFirebaseUserToAppUser(firebaseUser: FirebaseUser | null): Promise<User | null> {
    if (firebaseUser) {
      try {
        // Firebase felhasználói adatokat átalakítjuk a saját User modellünkre
        const userDocRef = doc(this.firestore, 'users', firebaseUser.uid);
        const userDocSnapshot = await getDoc(userDocRef);  // await-elni kell, hogy a Promise feloldódjon

        // Ha találunk felhasználót a Firestore-ban
        if (userDocSnapshot.exists()) {  // Most már közvetlenül elérhető az exists() metódus
          const userData = userDocSnapshot.data();

          return {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'Név nincs megadva',
            email: firebaseUser.email || '',
            password: '',  // A jelszó nem tárolódik Firebase-ben, nem töltjük le
            role: userData?.['role'] || 'tourist',  // A role-t a Firestore-ból töltjük le
            profilePicture: firebaseUser.photoURL || '',
            signedUpTours: userData?.['signedUpTours'] || [],  // A signedUpTours-t a Firestore-ból töltjük le
          };
        }
      } catch (error) {
        console.error("Hiba történt a felhasználó adatainak betöltésekor:", error);
        return null;  // Hiba esetén visszatérhetünk null értékkel
      }
    }
    return null;
  }

  async signUp(email:string,password:string,userData:Partial<User>):Promise<UserCredential> {
    try {
      console.log("DEBUG: signUp userData:", userData, email,password);
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      await this.createUserData(userCredential.user.uid, {
        ...userData,
        id: userCredential.user.uid,
        email: email,
        signedUpTours: []
      });

      return userCredential;
    } catch (error) {
      console.error("Hiba történt a regisztráció során:", error);
      throw error;  // Hiba esetén dobjuk tovább a hibát
    }
  }

  private async createUserData(userId: string, userData: Partial<User>):Promise<void> {
    const userRef = doc(this.firestore, 'Users', userId);
    console.log("DEBUG: createUserData userRef:", userRef);
    return setDoc(userRef, userData);
  }
}

