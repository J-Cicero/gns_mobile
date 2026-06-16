import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EligibilityComponent } from './eligibility.component';

describe('EligibilityComponent', () => {
  let component: EligibilityComponent;
  let fixture: ComponentFixture<EligibilityComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EligibilityComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EligibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
