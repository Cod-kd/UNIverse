import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleGroupComponent } from './single-group.component';

describe('SingleGroupComponent', () => {
  let component: SingleGroupComponent;
  let fixture: ComponentFixture<SingleGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
