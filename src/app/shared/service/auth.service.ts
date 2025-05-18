import {Injectable} from '@angular/core';
import {BehaviorSubject, from, Observable, of} from 'rxjs';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
  UserCredential
} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {doc, Firestore, getDoc, setDoc} from '@angular/fire/firestore';
import {map, switchMap} from 'rxjs/operators';
import {User} from '../../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  /** Stream a Firestore-ból betöltött applikációs User objektumhoz */
  public currentUser$: Observable<User | null>;

  /** Bejelentkezett állapot követése */
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.loggedInSubject.asObservable();

  /** Túravezető jogosultság stream */
  public isGuide$: Observable<boolean>;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {
    // Követjük a Firebase authState-et, majd Firestore User-re váltunk
    this.currentUser$ = authState(this.auth).pipe(
      switchMap(firebaseUser => {
        if (firebaseUser?.uid) {
          return this.getAppUser(firebaseUser);
        }
        return of(null);
      })
    );

    // Frissítjük a loggedInSubject-et
    authState(this.auth).subscribe(user => {
      this.loggedInSubject.next(!!user);
    });

    // Meghatározzuk, guide szerepkörű-e a felhasználó
    this.isGuide$ = this.currentUser$.pipe(
      map(user => !!user && user.role === 'guide')
    );
  }

  /** Bejelentkezés metódus */
  async signIn(email: string, password: string): Promise<UserCredential> {
    // A authState subscribe automatikusan kezeli a loggedInSubject-et és currentUser$
    return await signInWithEmailAndPassword(this.auth, email, password);
  }

  /** Kijelentkezés */
  async signOut(): Promise<void> {
    await signOut(this.auth);
    // A loggedInSubject false lesz az authState subscribe-ban
  }
  

  /** Regisztráció */
  async signUp(
    email: string,
    password: string,
    userData: Partial<User>
  ): Promise<UserCredential> {
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);
    await this.createUserInFirestore(cred.user.uid, {
      id: cred.user.uid,
      email,
      name: userData.name || '',
      role: userData.role || 'tourist',
      profilePicture: userData.profilePicture || '',
      signedUpTours: []
    });
    return cred;
  }

  /** Helper: FirebaseUser -> applikációs User (Observable) */
  private getAppUser(
    firebaseUser: FirebaseUser
  ): Observable<User | null> {
    const userRef = doc(this.firestore, 'Users', firebaseUser.uid);
    return from(getDoc(userRef)).pipe(
      switchMap(snapshot => {
        if (!snapshot.exists()) return of(null);
        const data = snapshot.data() as any;
        const appUser: User = {
          id: firebaseUser.uid,
          name: data.name || firebaseUser.displayName || '',
          email: data.email || firebaseUser.email || '',
          password: '',
          role: data.role || 'tourist',
          profilePicture: data.profilePicture || '',
          signedUpTours: data.signedUpTours || []
        };
        return of(appUser);
      })
    );
  }

  /** Helper: új felhasználó mentése Firestore-ba */
  private async createUserInFirestore(
    userId: string,
    userData: Partial<User>
  ): Promise<void> {
    const userRef = doc(this.firestore, 'Users', userId);
    await setDoc(userRef, userData);
  }
}
