**A projekt linkje: https://turafoglalo-77c74.firebaseapp.com/**

## 🛠️ Általános
> - ✅ *Fordítási hiba:* **0**  
> - ✅ *Futtatási hiba:* **0**

---

## 📦 Adatmodellek (`src/app/models/`)  
| Modell fájl neve                | Leírás                                       |
|---------------------------------|----------------------------------------------|
| `booking.model.ts`              | Foglalás adatstruktúra                       |
| `tour.model.ts`                 | Túra alapadatai                              |
| `TourWithBookings.model.ts`     | Túra + kapcsolódó foglalások listája         |
| `user.model.ts`                 | Felhasználói profiladatok                    |

---

## ✨ Attribute Directive‑ök  
| Direktíva             | Fájl                                               |
|-----------------------|----------------------------------------------------|
| `[matDatepicker]`     | `components/create-tour/create-tour.component.html`|
| `[formGroup]`         | `components/login/login.component.html`           |
| `[routerLink]`        | `components/menu/menu.component.html`             |
| `[ngClass]`           | `components/profile/profile.component.html`       |

---

## 🔄 Vezérlési folyamatok  
- **`*ngIf`** használat:  
  - Fájl: `components/create-tour/tour.component.html`  
  - **4+** különböző feltételvezérlés  

---

## 🔄 Adatátadás  
- **Input**: 1 darab  
- **Output**: 1 darab  
- **Komponens**: `tour-card.component.ts`  

---

## 🎨 Angular Material elemek (10 db)  
| #  | Elem                     | Fájl                                                 |
|----|--------------------------|------------------------------------------------------|
| 1  | `mat-form-field`         | `create-tour.component.html`                         |
| 2  | `mat-label`              | `create-tour.component.html`                         |
| 3  | `mat-error`              | `create-tour.component.html`                         |
| 4  | `mat-hint`               | `create-tour.component.html`                         |
| 5  | `mat-datepicker-toggle`  | `create-tour.component.html`                         |
| 6  | `mat-datepicker`         | `create-tour.component.html`                         |
| 7  | `mat-option`             | `create-tour.component.html`                         |
| 8  | `mat-select`             | `create-tour.component.html`                         |
| 9  | `ng-container`           | `tour-detail.component.html`                         |
| 10 | `ng-template`            | `tour-detail.component.html`                         |

---

## 🛠️ Egyedi Pipe  
> **`TimeStampToDatePipe`**  
> - Elérési út: `src/shared/pipes/TimeStampToDatePipe.ts`  
> - Használat: `tour-manage.component.html`

---

## 📝 Űrlapok (Reactive Forms) – **4 db**  
1. Tour létrehozása / szerkesztése  
   - `components/create-tour/create-tour.component.ts`  
   - *Megjegyzés:* editnél fake-update logika  
2. Bejelentkezés  
   - `components/login/login.component.ts`  
3. Regisztráció  
   - `components/register/register.component.ts`  
4. ÚjraTour form (ugyanaz, de külön logika)

---

## 🔧 CRUD műveletek  
- **Create** → `create-tour` komponens  
- **Read**   → `tour-service.getTourById()`  
- **Update** → `tour-service.updateTour()`  
- **Delete** → `tour-service.deleteTour()`

---

## 🗺️ Route‑ok – **4 útvonal**  
- Fájl: `src/app/app-routing.module.ts`  


---

## 🔍 Komplex lekérdezések

* **TourService**

  * `getTourById(id: string): Observable<Tour>`
* **BookingService**

  * `loadBookingsByUser(userId: string): Observable<Booking[]>`
  * `getSignedUpTours(userId: string): Observable<Tour[]>`
  * `cancelBooking(bookingId: string): Observable<void>`

---

## 🛡️ Auth Guard - yes


