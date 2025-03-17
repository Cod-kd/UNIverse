import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGroupPopupComponent } from './create-group-popup.component';

describe('CreateGroupPopupComponent', () => {
  let component: CreateGroupPopupComponent;
  let fixture: ComponentFixture<CreateGroupPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateGroupPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateGroupPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
