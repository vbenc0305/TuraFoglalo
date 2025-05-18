import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentListComponentComponent } from './comment-list-component.component';

describe('CommentListComponentComponent', () => {
  let component: CommentListComponentComponent;
  let fixture: ComponentFixture<CommentListComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentListComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentListComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
