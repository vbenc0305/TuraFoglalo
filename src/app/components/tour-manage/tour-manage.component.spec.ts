import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourManageComponent } from './tour-manage.component';

describe('TourManageComponent', () => {
  let component: TourManageComponent;
  let fixture: ComponentFixture<TourManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TourManageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TourManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
