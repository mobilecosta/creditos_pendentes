import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreditosViewComponent } from './creditos-view.component';

describe('CreditosViewComponent', () => {
  let component: CreditosViewComponent;
  let fixture: ComponentFixture<CreditosViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditosViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditosViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
