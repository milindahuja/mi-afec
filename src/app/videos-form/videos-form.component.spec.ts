import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideosFormComponent } from './videos-form.component';

describe('VideosFormComponent', () => {
  let component: VideosFormComponent;
  let fixture: ComponentFixture<VideosFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VideosFormComponent]
    });
    fixture = TestBed.createComponent(VideosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
