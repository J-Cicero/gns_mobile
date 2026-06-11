import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ScolariteComponent } from './scolarite.component';

describe('ScolariteComponent', () => {
  let component: ScolariteComponent;
  let fixture: ComponentFixture<ScolariteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ScolariteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScolariteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
