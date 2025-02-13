import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UNIcardComponent } from './unicard.component';

describe('UNIcardComponent', () => {
  let component: UNIcardComponent;
  let fixture: ComponentFixture<UNIcardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UNIcardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UNIcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
