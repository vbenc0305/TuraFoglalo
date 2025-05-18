import {Component, Input, OnInit} from '@angular/core';
import {MatButton, MatIconButton} from '@angular/material/button';
import {Router, RouterLink} from '@angular/router';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {MatIcon} from '@angular/material/icon';
import {Tour} from '../../models/tour.model';
import {TourService} from '../../services/tour.service';
import {AuthService} from '../../shared/service/auth.service';
import {DatePipe, DecimalPipe} from '@angular/common';
import {TimestampToDatePipe} from '../../shared/pipes/TimeStampToDatePipe';

@Component({
  selector: 'app-tour-manage',
  imports: [
    MatButton,
    RouterLink,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatIconButton,
    MatHeaderRow,
    MatRow,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatRowDef,
    MatIcon,
    DatePipe,
    DecimalPipe,
    TimestampToDatePipe
  ],
  templateUrl: './tour-manage.component.html',
  styleUrl: './tour-manage.component.css'
})
export class TourManageComponent implements OnInit {
  tours!: Tour[];

  displayedColumns: string[] = [
    'name', 'date', 'description',
    'difficulty', 'duration',
    'location', 'maxParticipants',
    'price', 'actions'
  ];

  constructor(
    private tourSvc: TourService,
    private router: Router,
    private authService: AuthService,
  ) {
  }

  ngOnInit() {
    this.loadTours();
  }

  loadTours() {
    // 1. Először feliratkozunk a currentUser$-re
    this.authService.currentUser$
      .subscribe(user => {
        if (user) {
          // 2. Ha van user, meghívjuk a service-t az ID-val
          this.tourSvc.getToursByGuide(user.id)
            .subscribe(tours => {
              this.tours = tours;
            });
        }
      });
  }


  onEdit(tourId: string) {
    this.router.navigate(['/tour', tourId, 'edit']);
  }

  onDelete(tourId: string) {
    if (confirm('Biztosan törlöd ezt a túrát?')) {
      this.tourSvc.deleteTour(tourId).then(() => this.loadTours());
    }
  }
}
