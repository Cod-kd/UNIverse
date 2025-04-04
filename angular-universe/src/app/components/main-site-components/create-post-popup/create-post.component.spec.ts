import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePostPopupComponent } from './create-post.component';

describe('CreatePostPopupComponent', () => {
  let component: CreatePostPopupComponent;
  let fixture: ComponentFixture<CreatePostPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePostPopupComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CreatePostPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
