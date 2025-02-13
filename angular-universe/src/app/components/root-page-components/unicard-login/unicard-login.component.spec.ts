import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UNIcardLoginComponent } from './unicard-login.component';

describe('UNIcardLoginComponent', () => {
  let component: UNIcardLoginComponent;
  let fixture: ComponentFixture<UNIcardLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UNIcardLoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UNIcardLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
