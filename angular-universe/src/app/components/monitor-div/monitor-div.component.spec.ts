import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorDivComponent } from './monitor-div.component';

describe('MonitorDivComponent', () => {
  let component: MonitorDivComponent;
  let fixture: ComponentFixture<MonitorDivComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonitorDivComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonitorDivComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
