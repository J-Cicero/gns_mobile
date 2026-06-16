import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AcademicEnrollmentComponent } from './academic-enrollment.component';

describe('AcademicEnrollmentComponent', () => {
  let component: AcademicEnrollmentComponent;
  let fixture: ComponentFixture<AcademicEnrollmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AcademicEnrollmentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AcademicEnrollmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
