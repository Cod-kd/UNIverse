import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEventPopupComponent } from './create-event-popup.component';

describe('CreateEventPopupComponent', () => {
  let component: CreateEventPopupComponent;
  let fixture: ComponentFixture<CreateEventPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEventPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEventPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
