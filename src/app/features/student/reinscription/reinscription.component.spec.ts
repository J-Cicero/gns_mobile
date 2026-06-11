import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReinscriptionComponent } from './reinscription.component';

describe('ReinscriptionComponent', () => {
  let component: ReinscriptionComponent;
  let fixture: ComponentFixture<ReinscriptionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ReinscriptionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReinscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
