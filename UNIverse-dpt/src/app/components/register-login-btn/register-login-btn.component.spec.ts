import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterLoginBtnComponent } from './register-login-btn.component';

describe('RegisterLoginBtnComponent', () => {
  let component: RegisterLoginBtnComponent;
  let fixture: ComponentFixture<RegisterLoginBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterLoginBtnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterLoginBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
