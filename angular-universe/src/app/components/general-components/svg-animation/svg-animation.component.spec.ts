import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgAnimationComponent } from './svg-animation.component';

describe('SvgAnimationComponent', () => {
  let component: SvgAnimationComponent;
  let fixture: ComponentFixture<SvgAnimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SvgAnimationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SvgAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
