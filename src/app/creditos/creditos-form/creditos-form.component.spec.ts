import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreditosFormComponent } from './creditos-form.component';

describe('CreditosFormComponent', () => {
  let component: CreditosFormComponent;
  let fixture: ComponentFixture<CreditosFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditosFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
