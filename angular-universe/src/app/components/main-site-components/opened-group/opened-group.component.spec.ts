import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenedGroupComponent } from './opened-group.component';

describe('OpenedGroupComponent', () => {
  let component: OpenedGroupComponent;
  let fixture: ComponentFixture<OpenedGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenedGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenedGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
